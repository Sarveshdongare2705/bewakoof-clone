from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
import re
import json
import PIL.Image
import io
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# Gemini model
model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

# Strict fashion prompt
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

color: Common colors like ["black", "white", "red", "blue", "beige", "grey", "lavender", "yellow", "green", "brown", "pink", "maroon", "navy blue"]

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
  "SOLID", "COLORBLOCK", "CHECKED", "STRIPED"
]

occasion: [
  "CASUAL_WEAR", "FORMAL", "PARTY", "SPORTS",
  "LOUNGEWEAR", "GYM", "TRAVEL", "FESTIVE", "WEDDING"
]

description: Write a short 1-line sentence explaining the clothing item’s style, look, and theme.

keywords: Extract 3 specific searchable terms from the image, e.g., ["black hoodie", "marvel print", "casual wear"]

- Always return valid JSON only. No explanation, no markdown, no text.
- If something is unknown, leave its field empty.
"""

def extract_json(text):
    try:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        return json.loads(match.group(0))
    except Exception:
        return {"error": "⚠️ Failed to extract JSON from AI response."}

def analyze_image(img_bytes):
    image = PIL.Image.open(io.BytesIO(img_bytes))
    response = model.generate_content([FASHION_PROMPT, image])
    return extract_json(response.text)

# Flask app
app = Flask(__name__)
CORS(app)

@app.route("/styleAI", methods=["POST"])
def style_ai():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    try:
        image_file = request.files["image"]
        image_bytes = image_file.read()
        filters = analyze_image(image_bytes)

        if "error" in filters:
            return jsonify({"error": filters["error"]}), 500

        return jsonify(filters), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
