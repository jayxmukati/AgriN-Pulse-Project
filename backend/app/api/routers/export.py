from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/jsonld")
async def export_jsonld():
    """
    Exports regional agro-ecological datasets in W3C JSON-LD format
    following the OpenAgri Common Semantic Model (OCSM) for BRICS cross-border interoperability.
    """
    payload = {
        "@context": {
            "@vocab": "https://schema.org/",
            "openagri": "https://openagri.brics.int/schema/v4/",
            "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
            "h3": "https://h3geo.org/terms#"
        },
        "@type": "Dataset",
        "name": "BRICS AgriN-Pulse Regional Agro-Ecological Node Dataset",
        "description": "Anonymized, privacy-preserving crop vigor (NDVI), pathogen outbreak alerts, and micro-climate indicators for the Madhya Pradesh Sector.",
        "creator": {
            "@type": "Organization",
            "name": "IIT Delhi Node & BRICS Agricultural Research Taskforce"
        },
        "spatialCoverage": {
            "@type": "Place",
            "name": "Madhya Pradesh Agro-Climatic Sector",
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": 23.2599,
                "longitude": 77.4126
            }
        },
        "temporalCoverage": "2024-05-01/2024-05-24",
        "variableMeasured": [
            {
                "@type": "PropertyValue",
                "name": "Normalized Difference Vegetation Index",
                "alternateName": "NDVI",
                "unitText": "Unitless Index (0.0 - 1.0)",
                "value": 0.72
            },
            {
                "@type": "PropertyValue",
                "name": "Active Pathogen Stress Clusters",
                "value": 14
            },
            {
                "@type": "PropertyValue",
                "name": "Climate Adaptation Index",
                "value": "84/100"
            }
        ],
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "distribution": {
            "@type": "DataDownload",
            "encodingFormat": "application/ld+json",
            "contentUrl": "http://localhost:8000/api/v1/export/jsonld"
        }
    }
    return JSONResponse(
        content=payload,
        headers={"Content-Disposition": "attachment; filename=agrin_pulse_brics_export.jsonld"}
    )

