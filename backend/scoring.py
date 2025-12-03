"""
Vendor Suitability Scoring Module

Simple scoring based on data completeness.
TODO: Enhance with more sophisticated logic later.
"""

from typing import Dict, Any, List


def calculate_suitability_score(vendor: Dict[str, Any]) -> int:
    """
    Calculate a simple suitability score (0-100) based on data completeness.
    Each field present adds points. Simple and easy to adjust.
    """
    score = 50  # Base score
    
    # +10 for each key field that has data
    if vendor.get("price"):
        score += 10
    if vendor.get("certifications") or vendor.get("quality_certifications"):
        score += 10
    if vendor.get("shelf_life_storage_conditions"):
        score += 10
    if vendor.get("sterilization_method"):
        score += 10
    if vendor.get("packaging_format_volume_size"):
        score += 10
    
    return min(score, 100)


def rank_vendors(vendors: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Add scores and sort vendors by score descending."""
    for vendor in vendors:
        vendor["suitability_score"] = calculate_suitability_score(vendor)
    return sorted(vendors, key=lambda v: v["suitability_score"], reverse=True)
