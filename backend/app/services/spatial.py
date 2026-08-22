import h3

def get_h3_index(lat: float, lon: float, resolution: int = 9) -> str:
    """Convert coordinates to H3 hex index"""
    return h3.geo_to_h3(lat, lon, resolution)

def anonymize_location(lat: float, lon: float) -> str:
    """Return a privacy-preserving Geo-ID based on H3 index"""
    h3_idx = get_h3_index(lat, lon)
    return f"GEO-{h3_idx}"
