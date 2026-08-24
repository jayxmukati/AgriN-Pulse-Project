"""
Agronomic Knowledge Base mapping disease classifications to regenerative treatments.
"""

TREATMENT_DB = {
    "Tomato Early Blight": {
        "natural_treatments": [
            "Apply Bio-fungicide sprays (e.g., Bacillus subtilis based) immediately to surrounding healthy plants.",
            "Use Neem oil at a dosage of 2 tablespoons per gallon of water, applied weekly in the early morning or late evening.",
            "Remove and securely dispose of infected lower leaves to reduce spore spread."
        ],
        "soil_water_management": [
            "Switch entirely to drip irrigation to keep foliage dry. Avoid overhead watering.",
            "Increase spacing for airflow: Ensure a minimum of 24 inches between plants if possible.",
            "Apply a thick layer of organic mulch to prevent soil-borne spores from splashing onto lower leaves."
        ],
        "warning_level": "High"
    },
    "Wheat Rust": {
        "natural_treatments": [
            "Apply wettable sulfur early in the morning before temperatures exceed 85°F.",
            "Use compost tea foliar spray to boost plant surface immunity against rust spores.",
            "Ensure complete removal of volunteer wheat or alternate host weeds (like barberry) near the field."
        ],
        "soil_water_management": [
            "Optimize nitrogen application; avoid excessive nitrogen which can exacerbate rust susceptibility.",
            "Improve field drainage to reduce micro-climate humidity.",
            "Plant resistant crop varieties in future rotations."
        ],
        "warning_level": "High"
    },
    "Powdery Mildew": {
        "natural_treatments": [
            "Spray a baking soda and liquid soap solution (1 tbsp baking soda, 1/2 tsp soap per gallon of water).",
            "Apply potassium bicarbonate as an organic, curative fungicidal treatment.",
            "Selectively prune dense canopy areas to increase sunlight penetration."
        ],
        "soil_water_management": [
            "Avoid late afternoon or evening watering; allow soil surface to dry before nightfall.",
            "Maintain moderate soil moisture; do not allow plants to undergo extreme drought stress.",
            "Ensure proper air circulation by managing crop density."
        ],
        "warning_level": "Moderate"
    },
    "Septoria Leaf Spot": {
        "natural_treatments": [
            "Apply copper-based organic fungicides early in the disease cycle.",
            "Promptly prune and destroy severely spotted lower leaves.",
            "Sanitize all pruning tools with a 10% bleach solution between cuts."
        ],
        "soil_water_management": [
            "Utilize drip or soaker hose irrigation to completely avoid wetting the leaf canopy.",
            "Rotate crops; avoid planting solanaceous crops in the same plot for at least 2-3 years.",
            "Add a 3-4 inch layer of straw mulch immediately after transplanting."
        ],
        "warning_level": "Moderate"
    },
    "Healthy": {
        "natural_treatments": [],
        "soil_water_management": [],
        "warning_level": "None"
    }
}

def get_treatment_plan(disease_name: str) -> dict:
    """Returns the treatment mapping for a given disease class, or a generic fallback."""
    # Ensure exact matching, stripping prefixes like "AI-Predicted" if they exist
    lookup_name = disease_name.replace("AI-Predicted ", "").strip()
    
    return TREATMENT_DB.get(lookup_name, {
        "natural_treatments": [
            "Consult with a local agronomic extension agent for unidentified pathogen treatments.",
            "Quarantine affected plants if possible to prevent potential spread."
        ],
        "soil_water_management": [
            "Maintain standard regenerative soil practices (minimal till, optimal hydration).",
            "Monitor daily for further symptom development."
        ],
        "warning_level": "Unknown"
    })
