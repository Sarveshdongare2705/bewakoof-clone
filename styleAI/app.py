import streamlit as st
import google.generativeai as genai
import os
import PIL.Image
import json
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# Initialize model
model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

# STRICT PROMPT
FASHION_PROMPT = """
You are a fashion stylist AI. Given an image of a clothing item, return a JSON object with the following fields:

{
  "mainCategory": [],
  "category": [],
  "color": [],
  "gender": [],
  "sizes": [],
  "brand": [],
  "sleeve": [],
  "discount": [],
  "ageGroup": [],
  "fitType": [],
  "designType": [],
  "occasion": [],
  "description": "",
  "keywords": ["", "", ""]
}

Rules:
- Choose values only from these allowed options:

mainCategory: ["Topwear", "Bottomwear"]

category: [
  "T_SHIRT", "SHIRT", "SWEATSHIRT", "HOODIE", "JACKET", "KURTA",
  "JEANS", "JOGGERS", "SHORTS", "TRACK_PANTS", "TROUSERS", "PYJAMAS"
]

color: Common colors like ["black", "white", "red", "blue", "beige", "grey", "lavender", "yellow", "green", "brown", "pink", "maroon", "navy blue"] First letter captial

gender: ["MEN", "WOMEN"]

sizes: ["XS", "S", "M", "L", "XL", "XXL"]

brand: ["Bewakoof", "Nike", "Adidas", "H&M"] or detect logos/text/themes (e.g., Marvel, Disney)

sleeve: [
  "HALF_SLEEVE", "FULL_SLEEVE", "SLEEVELESS",
  "THREE_QUARTER_SLEEVE", "CAP_SLEEVE",
  "RAGLAN_SLEEVE", "PUFF_SLEEVE", "BELL_SLEEVE"
]

discount: Leave empty ("")

ageGroup: ["KIDS", "TEENS", "ADULTS", "ALL"]

fitType: ["REGULAR", "SLIM", "OVERSIZED", "RELAXED", "BODYCON", "LOOSE"]

designType: [
  "GRAPHIC_PRINT", "PLAIN", "EMBROIDERED", "TYPOGRAPHY",
  "SOLID", "COLORBLOCK", "CHECKERED", "STRIPED"
]

occasion: [
  "CASUAL_WEAR", "FORMAL", "PARTY", "SPORTS",
  "LOUNGEWEAR", "GYM", "TRAVEL", "FESTIVE", "WEDDING"
]

description: Write a short 1-line sentence explaining the clothing item’s style, look, and theme.

keywords: Extract 5 specific searchable terms from the image, e.g., ["black hoodie", "marvel print", "casual wear"]
- Always chose filters values from the ones i have given. Nothing from outside For example give CHECKERED not CHECKED which is not present here for design type. Similarly for other. Chose precise filters
- Always return valid JSON only. in Json response return 3 fields as filters including all above filters , then description and then keywords list. No explanation, no markdown, no text.
- If something is unknown, leave its field empty. Give precise filters
"""

# Helper function to extract JSON from Gemini's raw output
def extract_json(text):
    try:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        return json.loads(match.group(0))
    except Exception:
        return {"error": "⚠️ Failed to extract JSON from AI response."}

# Generate filters
def extract_fashion_filters(img):
    response = model.generate_content([FASHION_PROMPT, img])
    return extract_json(response.text)

# Streamlit UI
st.set_page_config(page_title="🧠 Style Filter AI", layout="centered")
st.title("👕 Fashion Filter Extractor")
st.caption("Upload a clothing image and get smart filters for your catalog.")

upload_image = st.file_uploader("Upload a fashion image", type=["png", "jpg", "jpeg"])

if st.button("Generate Filters"):
    if upload_image:
        img = PIL.Image.open(upload_image)
        st.image(img, caption='Uploaded Image', use_column_width=True)

        with st.spinner("Analyzing style..."):
            filters = extract_fashion_filters(img)

        if "error" in filters:
            st.error(filters["error"])
        else:
            st.subheader("🎯 Extracted Filters")
            st.json(filters)
