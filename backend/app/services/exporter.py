def serialize_to_json_ld(data: dict) -> dict:
    """Mock W3C JSON-LD serializer following OpenAgri Common Semantic Model (OCSM)."""
    return {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": "BRICS AgriN-Pulse Export",
        "spatialCoverage": {
            "@type": "Place",
            "geo": {
                "@type": "GeoShape",
                "polygon": "..."
            }
        },
        "data": data
    }
