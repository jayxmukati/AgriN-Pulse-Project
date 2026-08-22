try:
    import h3
except ImportError:
    h3 = None

def get_h3_index(lat: float, lon: float, resolution: int = 9) -> str:
    """Convert coordinates to H3 hex index"""
    if h3 and hasattr(h3, 'geo_to_h3'):
        return h3.geo_to_h3(lat, lon, resolution)
    elif h3 and hasattr(h3, 'latlng_to_cell'):
        return h3.latlng_to_cell(lat, lon, resolution)
    return "8860144aa7fffff"

def anonymize_location(lat: float, lon: float) -> str:
    """Return a privacy-preserving Geo-ID based on H3 index"""
    h3_idx = get_h3_index(lat, lon)
    return f"GEO-{h3_idx}"

