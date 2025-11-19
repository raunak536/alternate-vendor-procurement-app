import { useEffect, useRef, useState, useMemo } from 'react'
import Globe from 'react-globe.gl'
import * as topojson from 'topojson-client'
import './GlobeView.css'

// Mapping from our country codes to ISO country names (as they appear in world-atlas)
const COUNTRY_NAME_MAPPING = {
  'usa': ['United States of America', 'United States'],
  'uk': ['United Kingdom'],
  'india': ['India'],
  'germany': ['Germany'],
  'france': ['France'],
  'italy': ['Italy'],
  'spain': ['Spain'],
  'netherlands': ['Netherlands'],
  'switzerland': ['Switzerland'],
  'japan': ['Japan'],
  'china': ['China'],
  'canada': ['Canada'],
  'australia': ['Australia'],
  'ireland': ['Ireland'],
  'poland': ['Poland'],
  'denmark': ['Denmark'],
  'greece': ['Greece'],
  'mexico': ['Mexico'],
  'belgium': ['Belgium'],
  'sweden': ['Sweden'],
  'finland': ['Finland'],
  'israel': ['Israel'],
  'south korea': ['South Korea', 'Korea'],
  'hong kong': ['Hong Kong'],
  'brazil': ['Brazil'],
  'austria': ['Austria'],
  'hungary': ['Hungary'],
  'portugal': ['Portugal'],
  'norway': ['Norway'],
  'russia': ['Russia'],
}

function GlobeView({ vendors, formatSpend }) {
  const globeEl = useRef()
  const [countries, setCountries] = useState([])

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ altitude: 2.5 })
    }
  }, [])

  // Load world country data
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(res => res.json())
      .then(data => {
        const countriesGeoJson = topojson.feature(data, data.objects.countries)
        setCountries(countriesGeoJson.features)
      })
      .catch(err => {
        console.error('Error loading country data:', err)
        // Fallback: try alternative CDN
        fetch('https://unpkg.com/world-atlas@2/countries-110m.json')
          .then(res => res.json())
          .then(data => {
            const countriesGeoJson = topojson.feature(data, data.objects.countries)
            setCountries(countriesGeoJson.features)
          })
          .catch(err2 => console.error('Error loading country data from fallback:', err2))
      })
  }, [])

  // Format spend helper
  const formatSpendValue = (spend) => {
    if (formatSpend) {
      return formatSpend(spend)
    }
    const crores = spend / 10000000
    return `₹${crores.toFixed(2)} Cr`
  }

  // Aggregate vendor data by country
  const countryData = useMemo(() => {
    const data = {}
    vendors.forEach(v => {
      if (!v.country) return
      const countryLower = v.country.toLowerCase()
      if (!data[countryLower]) {
        data[countryLower] = {
          totalSpend: 0,
          vendorCount: 0,
          vendors: []
        }
      }
      data[countryLower].totalSpend += v.total_spend || 0
      data[countryLower].vendorCount += 1
      data[countryLower].vendors.push(v)
    })
    return data
  }, [vendors])

  // Calculate color based on spend with better hue contrast
  const getColorForSpend = (spend, maxSpend) => {
    if (!spend || spend === 0) return null
    
    const intensity = Math.min(spend / maxSpend, 1)
    
    // Create a gradient from light blue-purple (low spend) to deep blue-purple (high spend)
    // Low spend: lighter, more purple-tinted, more transparent
    // High spend: deeper, richer blue, more opaque
    const opacity = 0.5 + (intensity * 0.5) // 0.5 to 1.0 opacity
    
    // Hue shift: low spend = lighter purple-blue, high spend = deeper blue-purple
    // Base color #667eea is rgb(102, 126, 234)
    // For low spend: shift toward lighter purple (higher red, higher blue)
    // For high spend: shift toward deeper blue-purple (lower red, deeper blue)
    
    const lowSpendRed = 120
    const lowSpendGreen = 140
    const lowSpendBlue = 245
    
    const highSpendRed = 80
    const highSpendGreen = 110
    const highSpendBlue = 220
    
    // Interpolate between low and high spend colors
    const red = Math.floor(lowSpendRed + (highSpendRed - lowSpendRed) * intensity)
    const green = Math.floor(lowSpendGreen + (highSpendGreen - lowSpendGreen) * intensity)
    const blue = Math.floor(lowSpendBlue + (highSpendBlue - lowSpendBlue) * intensity)
    
    return `rgba(${Math.max(0, Math.min(255, red))}, ${Math.max(0, Math.min(255, green))}, ${Math.max(0, Math.min(255, blue))}, ${opacity})`
  }

  // Calculate max spend for legend
  const maxSpend = useMemo(() => {
    const spends = Object.values(countryData).map(d => d.totalSpend)
    return spends.length > 0 ? Math.max(...spends, 0) : 0
  }, [countryData])

  // Prepare polygons with vendor data - only include countries with vendor data
  const polygonsData = useMemo(() => {
    if (countries.length === 0) return []

    return countries
      .map(country => {
        // Try multiple property names that world-atlas might use
        const countryName = country.properties?.NAME || 
                           country.properties?.NAME_LONG || 
                           country.properties?.name ||
                           country.properties?.NAME_EN ||
                           ''
        
        let matchedCountryCode = null

        // Find matching country code - try exact match first, then partial
        if (countryName) {
          const countryNameLower = countryName.toLowerCase()
          for (const [code, names] of Object.entries(COUNTRY_NAME_MAPPING)) {
            if (names.some(name => {
              const nameLower = name.toLowerCase()
              // Exact match or contains match
              return countryNameLower === nameLower || 
                     countryNameLower.includes(nameLower) || 
                     nameLower.includes(countryNameLower)
            })) {
              matchedCountryCode = code
              break
            }
          }
        }

        const data = matchedCountryCode ? countryData[matchedCountryCode] : null
        const totalSpend = data?.totalSpend || 0
        const vendorCount = data?.vendorCount || 0

        // Only include countries with vendor data
        if (totalSpend === 0) return null

        return {
          ...country,
          color: getColorForSpend(totalSpend, maxSpend || 1),
          totalSpend,
          vendorCount,
          countryCode: matchedCountryCode,
          vendors: data?.vendors || []
        }
      })
      .filter(p => p !== null) // Remove countries without data
  }, [countries, countryData, maxSpend])

  // Get top spending countries for legend
  const topCountries = useMemo(() => {
    return Object.entries(countryData)
      .map(([code, data]) => ({
        code: code.toUpperCase(),
        totalSpend: data.totalSpend,
        vendorCount: data.vendorCount,
        color: getColorForSpend(data.totalSpend, maxSpend || 1)
      }))
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 8) // Top 8 countries
  }, [countryData, maxSpend])

  return (
    <div className="globe-wrapper">
      <div className="globe-container">
        <Globe
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundColor="rgba(0,0,0,0)"
          polygonsData={polygonsData}
          polygonAltitude={0.01}
          polygonCapColor={d => d.color}
          polygonSideColor={d => d.color}
          polygonStrokeColor={() => 'rgba(255, 255, 255, 0.25)'}
          polygonLabel={d => {
            const countryName = d.properties?.NAME || d.properties?.NAME_LONG || d.properties?.name || ''
            const displayCountry = d.countryCode ? d.countryCode.toUpperCase() : countryName
            return `
              <div class="globe-tooltip">
                <strong>${displayCountry}</strong><br/>
                <span style="color: #667eea; font-weight: 600">Total Spend: ${formatSpendValue(d.totalSpend)}</span><br/>
                <span style="color: #86868b">Vendors: ${d.vendorCount}</span>
              </div>
            `
          }}
          onPolygonHover={(polygon, prevPolygon) => {
            // Optional: handle hover events if needed
          }}
        />
      </div>
      {topCountries.length > 0 && (
        <div className="globe-legend">
          <div className="legend-title">Top Countries</div>
          <div className="legend-list">
            {topCountries.map((country, index) => (
              <div key={country.code} className="legend-item">
                <div className="legend-item-header">
                  <div className="legend-item-rank">{index + 1}</div>
                  <div className="legend-item-color" style={{ backgroundColor: country.color }} />
                  <div className="legend-item-country">{country.code}</div>
                </div>
                <div className="legend-item-spend">{formatSpendValue(country.totalSpend)}</div>
                <div className="legend-item-vendors">{country.vendorCount} vendor{country.vendorCount !== 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GlobeView

