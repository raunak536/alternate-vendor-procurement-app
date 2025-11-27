import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { mockVendors } from '../data/mockData'
import './Compare.css'

function Compare() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const vendorIds = (searchParams.get('vendors') || '').split(',').map(Number).filter(Boolean)
  const productName = searchParams.get('q') || 'TSA Plates'
  
  const [quantity, setQuantity] = useState(500)
  const [searchQuery, setSearchQuery] = useState(productName)
  
  // Filter states (same as Results page for consistency)
  const [filters, setFilters] = useState({
    estUnitCost: 12,
    estQuantity: 500,
    priceBenchmark: true,
    currentPartnerOnly: false,
    source: ['INT', 'EXT'],
    priceRange: [0, 10000],
    certifications: [],
    locations: [],
    minSuitability: 75
  })
  
  // Get selected vendors from mock data
  const selectedVendors = mockVendors.filter(v => vendorIds.includes(v.id))

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(amount)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleExport = () => {
    // Placeholder for export functionality
    alert('Export comparison functionality would be implemented here')
  }

  const handleSelectVendor = (vendorId) => {
    // Placeholder for vendor selection
    alert(`Vendor ${vendorId} selected for procurement`)
  }

  if (selectedVendors.length < 2) {
    return (
      <div className="compare-page">
        <Header showSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="compare-empty">
          <p>Please select at least 2 vendors to compare.</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="compare-page">
      <Header showSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="compare-layout">
        {/* Left Sidebar - Same filters as Results */}
        <aside className="filters-sidebar">
          <div className="filter-section cost-adjustments">
            <div className="filter-header">
              <h3>Input Cost Adjustments</h3>
              <button className="collapse-btn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </button>
            </div>
            
            <div className="filter-field">
              <label>EST. UNIT COST ($)</label>
              <input 
                type="number" 
                value={filters.estUnitCost}
                onChange={(e) => setFilters(f => ({ ...f, estUnitCost: +e.target.value }))}
              />
            </div>
            
            <div className="filter-field">
              <label>EST. QUANTITY NEEDED</label>
              <input 
                type="number" 
                value={filters.estQuantity}
                onChange={(e) => setFilters(f => ({ ...f, estQuantity: +e.target.value }))}
              />
            </div>
            
            <div className="filter-toggle">
              <span>Benchmark: INT vs EXT</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={filters.priceBenchmark}
                  onChange={(e) => setFilters(f => ({ ...f, priceBenchmark: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-header">
              <div className="filter-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                </svg>
              </div>
              <h3>FILTERS</h3>
            </div>

            <div className="filter-group">
              <h4>
                Relationship Status
                <svg className="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </h4>
              <div className="filter-checkbox">
                <input 
                  type="checkbox" 
                  id="currentPartner"
                  checked={filters.currentPartnerOnly}
                  onChange={(e) => setFilters(f => ({ ...f, currentPartnerOnly: e.target.checked }))}
                />
                <label htmlFor="currentPartner">Current Partner Only</label>
              </div>
            </div>

            <div className="filter-group">
              <h4>
                Source
                <svg className="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </h4>
              <div className="filter-checkbox filled">
                <input 
                  type="checkbox" 
                  id="sourceInt"
                  checked={filters.source.includes('INT')}
                  onChange={(e) => {
                    const newSource = e.target.checked 
                      ? [...filters.source, 'INT'] 
                      : filters.source.filter(s => s !== 'INT')
                    setFilters(f => ({ ...f, source: newSource }))
                  }}
                />
                <label htmlFor="sourceInt">Internal (INT)</label>
              </div>
              <div className="filter-checkbox filled">
                <input 
                  type="checkbox" 
                  id="sourceExt"
                  checked={filters.source.includes('EXT')}
                  onChange={(e) => {
                    const newSource = e.target.checked 
                      ? [...filters.source, 'EXT'] 
                      : filters.source.filter(s => s !== 'EXT')
                    setFilters(f => ({ ...f, source: newSource }))
                  }}
                />
                <label htmlFor="sourceExt">External (EXT)</label>
              </div>
            </div>

            <div className="filter-group">
              <h4>
                Price Range
                <svg className="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </h4>
              <div className="dual-range-container">
                <input 
                  type="range" 
                  min="0" 
                  max="10000" 
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(f => ({ ...f, priceRange: [f.priceRange[0], +e.target.value] }))}
                  className="price-slider"
                />
              </div>
              <div className="price-range-labels">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1].toLocaleString()}</span>
              </div>
              <div className="benchmark-note">
                Benchmark: $8-9 per plate
              </div>
            </div>

            <div className="filter-group">
              <h4>
                Certifications
                <svg className="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </h4>
              {['GMP', 'ISO 9001', 'US FDA', 'EU GMP'].map(cert => (
                <div className="filter-checkbox filled" key={cert}>
                  <input 
                    type="checkbox" 
                    id={`cert-${cert}`}
                    checked={filters.certifications.includes(cert)}
                    onChange={(e) => {
                      const newCerts = e.target.checked 
                        ? [...filters.certifications, cert] 
                        : filters.certifications.filter(c => c !== cert)
                      setFilters(f => ({ ...f, certifications: newCerts }))
                    }}
                  />
                  <label htmlFor={`cert-${cert}`}>{cert}</label>
                </div>
              ))}
            </div>

            <div className="filter-group">
              <h4>Location</h4>
              {['India', 'Asia Pacific', 'Europe', 'North America'].map(loc => (
                <div className="filter-checkbox filled" key={loc}>
                  <input 
                    type="checkbox" 
                    id={`loc-${loc}`}
                    checked={filters.locations.includes(loc)}
                    onChange={(e) => {
                      const newLocs = e.target.checked 
                        ? [...filters.locations, loc] 
                        : filters.locations.filter(l => l !== loc)
                      setFilters(f => ({ ...f, locations: newLocs }))
                    }}
                  />
                  <label htmlFor={`loc-${loc}`}>{loc}</label>
                </div>
              ))}
              <div className="filter-checkbox">
                <input 
                  type="checkbox" 
                  id="loc-other"
                  checked={filters.locations.includes('Other')}
                  onChange={(e) => {
                    const newLocs = e.target.checked 
                      ? [...filters.locations, 'Other'] 
                      : filters.locations.filter(l => l !== 'Other')
                    setFilters(f => ({ ...f, locations: newLocs }))
                  }}
                />
                <label htmlFor="loc-other">Other Regions</label>
              </div>
            </div>

            <div className="filter-group">
              <h4>
                Min. Suitability Score
                <svg className="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </h4>
              <div className="suitability-slider-container">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={filters.minSuitability}
                  onChange={(e) => setFilters(f => ({ ...f, minSuitability: +e.target.value }))}
                  className="suitability-slider"
                />
              </div>
              <div className="suitability-labels">
                <span>0%</span>
                <span className="current-value">{filters.minSuitability}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="filter-actions">
            <button className="reset-btn" onClick={() => setFilters({
              estUnitCost: 12,
              estQuantity: 500,
              priceBenchmark: true,
              currentPartnerOnly: false,
              source: ['INT', 'EXT'],
              priceRange: [0, 10000],
              certifications: [],
              locations: [],
              minSuitability: 75
            })}>
              Reset
            </button>
            <button className="apply-btn">Apply</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="compare-main">
          <div className="compare-header">
            <button className="back-link" onClick={handleBack}>
              ← Back to Results
            </button>
            <div className="compare-actions">
              <button className="export-btn" onClick={handleExport}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Comparison
              </button>
            </div>
          </div>

          <div className="compare-title-row">
            <h1>{productName} / Vendor Comparison</h1>
            <div className="quantity-input">
              <span>Calculation based on Qty:</span>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
              />
              <span className="unit">kg</span>
            </div>
          </div>

          <div className="comparison-table">
            {/* Header Row */}
            <div className="table-row header-row">
              <div className="attribute-column">
                <span className="attribute-label">ATTRIBUTES</span>
              </div>
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="vendor-column">
                  <div className="vendor-header-card">
                    {vendor.isCurrentPartner && (
                      <div className="current-partner-tag">
                        <span className="partner-icon">⟲</span>
                        CURRENT PARTNER
                      </div>
                    )}
                    <div className="vendor-badges">
                      <span className={`source-badge ${vendor.source.toLowerCase()}`}>{vendor.source}</span>
                      {vendor.isPreferred && <span className="preferred-badge">Preferred</span>}
                    </div>
                    <h3 className="vendor-name">{vendor.name}</h3>
                    <button 
                      className="select-vendor-btn"
                      onClick={() => handleSelectVendor(vendor.id)}
                    >
                      SELECT VENDOR
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Est. Cost Row */}
            <div className="table-row highlight-row">
              <div className="attribute-column">
                <div className="attribute-content">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M2 9h20" />
                  </svg>
                  <div>
                    <span className="attribute-name">Total Est. Cost</span>
                    <span className="attribute-sub">(Based on {quantity} units)</span>
                  </div>
                </div>
              </div>
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="vendor-column">
                  <div className="cost-display">
                    <span className="cost-primary">{formatCurrency(vendor.unitPrice * quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price (Per Unit) Row */}
            <div className="table-row">
              <div className="attribute-column">
                <span className="attribute-name">Price (Per Unit)</span>
              </div>
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="vendor-column">
                  <span className="data-value">{formatCurrency(vendor.unitPrice)} / plate</span>
                </div>
              ))}
            </div>

            {/* Available Qty Row */}
            <div className="table-row">
              <div className="attribute-column">
                <span className="attribute-name">Available Qty</span>
              </div>
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="vendor-column">
                  <span className="data-value">{vendor.availableQty.toLocaleString()} plates</span>
                </div>
              ))}
            </div>

            {/* Internal History Row */}
            <div className="table-row">
              <div className="attribute-column">
                <span className="attribute-name">Internal History</span>
              </div>
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="vendor-column">
                  {vendor.internalHistory ? (
                    <div className="history-data">
                      <span>Spend: <strong>{formatCurrency(vendor.internalHistory.lifetimeSpend)}</strong></span>
                      <span>Partner: <strong>{vendor.internalHistory.partnerSince}</strong></span>
                    </div>
                  ) : (
                    <span className="no-data">No internal history</span>
                  )}
                </div>
              ))}
            </div>

            {/* Suitability Score Row */}
            <div className="table-row">
              <div className="attribute-column">
                <span className="attribute-name">Suitability Score</span>
              </div>
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="vendor-column">
                  <div className="score-display">
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ width: `${vendor.suitabilityScore}%` }}
                      ></div>
                    </div>
                    <span className="score-value">{vendor.suitabilityScore}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Lead Time Row */}
            <div className="table-row">
              <div className="attribute-column">
                <span className="attribute-name">Lead Time</span>
              </div>
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="vendor-column">
                  <span className="data-value">{vendor.leadTime}</span>
                </div>
              ))}
            </div>

            {/* Region Row */}
            <div className="table-row">
              <div className="attribute-column">
                <span className="attribute-name">Region</span>
              </div>
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="vendor-column">
                  <span className="data-value">{vendor.region}</span>
                </div>
              ))}
            </div>

            {/* Shelf Life Row */}
            <div className="table-row">
              <div className="attribute-column">
                <span className="attribute-name">Shelf Life</span>
              </div>
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="vendor-column">
                  <span className="data-value">{vendor.shelfLife}</span>
                </div>
              ))}
            </div>

            {/* Packaging Row */}
            <div className="table-row">
              <div className="attribute-column">
                <span className="attribute-name">Packaging</span>
              </div>
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="vendor-column">
                  <span className="data-value">{vendor.packaging}</span>
                </div>
              ))}
            </div>

            {/* Locking Row */}
            <div className="table-row">
              <div className="attribute-column">
                <span className="attribute-name">Locking</span>
              </div>
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="vendor-column">
                  <span className="data-value">{vendor.locking}</span>
                </div>
              ))}
            </div>

            {/* Storage Condition Row */}
            <div className="table-row">
              <div className="attribute-column">
                <span className="attribute-name">Storage Condition</span>
              </div>
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="vendor-column">
                  <span className="data-value">{vendor.storage}</span>
                </div>
              ))}
            </div>

            {/* Certifications Row */}
            <div className="table-row">
              <div className="attribute-column">
                <span className="attribute-name">Certifications</span>
              </div>
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="vendor-column">
                  <div className="cert-badges">
                    {vendor.certifications.map(cert => (
                      <span key={cert} className="cert-badge">{cert}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Risk Assessment Row */}
            <div className="table-row">
              <div className="attribute-column">
                <div className="attribute-content">
                  <span className="attribute-name">AI Risk Assessment</span>
                  <svg className="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
              </div>
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="vendor-column">
                  {vendor.riskAssessment ? (
                    <div className={`risk-badge ${vendor.riskAssessment.level.toLowerCase().replace(' ', '-')}`}>
                      <span className="risk-icon">✓</span>
                      <span className="risk-text">{vendor.riskAssessment.level}: {vendor.riskAssessment.description}</span>
                    </div>
                  ) : (
                    <span className="no-data">—</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Compare
