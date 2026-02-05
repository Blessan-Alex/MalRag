import google.generativeai as genai
import os
from PIL import Image

async def process_image_with_gemini(image_path: str, prompt: str = "Describe this image in detail, extracting all visible text and entities.", api_key: str = None) -> str:
    """
    Processes an image using Gemini Vision to get a text description.
    """
    if not os.path.exists(image_path):
        return f"Error: Image file not found at {image_path}"

    if api_key:
        genai.configure(api_key=api_key)
    else:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            return "Error: GOOGLE_API_KEY not set."
            
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        img = Image.open(image_path)
        
        # Gemini expects PIL Image object or path
        response = model.generate_content([prompt, img])
        return response.text
    except Exception as e:
        return f"Error processing image: {str(e)}"
