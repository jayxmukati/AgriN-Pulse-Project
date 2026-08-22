import requests

def get_ndvi(bbox: list) -> float:
    """Mock function to simulate fetching Copernicus Sentinel-2 STAC API data and computing NDVI."""
    # B8 (NIR) and B4 (Red)
    # NDVI = (B8 - B4) / (B8 + B4)
    # Simulate a return value for the prototype
    return 0.72

def get_weather_forecast(lat: float, lon: float) -> dict:
    """Fetch 7-day weather and soil moisture forecast from Open-Meteo."""
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=temperature_2m,precipitation_probability,soil_moisture_0_to_7cm&days=7"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        return {}
    except Exception:
        return {}
