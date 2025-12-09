from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path

from scoring import calculate_suitability_score, rank_vendors

app = FastAPI()

# Load vendor data from JSON
VENDOR_DATA_PATH = Path(__file__).parent / "data" / "vendors.json"

def load_vendor_data():
    """Load vendor data from JSON file."""
    if VENDOR_DATA_PATH.exists():
        with open(VENDOR_DATA_PATH, 'r') as f:
            return json.load(f)
    return {"queries": {}}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/alternate-vendors")
def get_alternate_vendors(q: str = ""):
    """
    Search for alternate vendors based on a product query.
    Returns vendor data from deep research results stored in JSON.
    Each vendor includes a suitability_score (0-100) calculated based on
    data completeness and quality indicators.
    """
    if not q:
        return {"vendors": [], "query": "", "found": False}
    
    # Normalize the query
    q_normalized = q.lower().strip()
    
    # Load vendor data
    vendor_data = load_vendor_data()
    queries = vendor_data.get("queries", {})
    
    # Try exact match first
    if q_normalized in queries:
        query_data = queries[q_normalized]
        # Add suitability scores and rank vendors
        scored_vendors = rank_vendors(query_data["vendors"])
        return {
            "vendors": scored_vendors,
            "query": query_data["query_text"],
            "query_id": query_data["query_id"],
            "last_updated": query_data["last_updated"],
            "found": True
        }
    
    # Try partial match
    for stored_query, query_data in queries.items():
        if q_normalized in stored_query or stored_query in q_normalized:
            # Add suitability scores and rank vendors
            scored_vendors = rank_vendors(query_data["vendors"])
            return {
                "vendors": scored_vendors,
                "query": query_data["query_text"],
                "query_id": query_data["query_id"],
                "last_updated": query_data["last_updated"],
                "found": True
            }
    
    # No match found
    return {"vendors": [], "query": q, "found": False}
