import os
from fastapi import HTTPException
import logging
import pypdf
import docx

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def parse_file_content(file_path: str, original_filename: str) -> str:
    """
    Parses file content based on extension.
    Supports PDF, DOCX, TXT.
    """
    try:
        ext = os.path.splitext(original_filename)[1].lower()
        logger.info(f"Parsing file: {file_path} (Extension: {ext})")
        
        if ext == '.pdf':
            text = ""
            try:
                reader = pypdf.PdfReader(file_path)
                for page in reader.pages:
                    text += page.extract_text() + "\n"
            except Exception as e:
                logger.error(f"PDF parsing error: {e}")
                raise ValueError("Invalid PDF file")
            return text

        elif ext == '.docx':
            try:
                try:
                    import docx
                except ImportError:
                    logger.error("python-docx not installed.")
                    raise ValueError("Server configuration error: python-docx not installed")

                doc = docx.Document(file_path)
                text = "\n".join([para.text for para in doc.paragraphs])
                logger.info(f"DOCX parsing successful. Extracted {len(text)} characters.")
            except Exception as e:
                logger.error(f"DOCX parsing error: {str(e)}", exc_info=True)
                raise ValueError(f"Invalid DOCX file: {str(e)}")
            return text
            
        elif ext in ['.txt', '.md', '.csv', '.json']:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()

        elif ext in ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff']:
            try:
                import google.generativeai as genai
                from PIL import Image
                from malrag.llm import gemini_key_manager

                api_key = gemini_key_manager.get_current_key()
                if not api_key:
                    raise ValueError("No Gemini API key available for image OCR")

                genai.configure(api_key=api_key)
                model_name = os.environ.get("LLM_MODEL", "gemini-2.5-flash")
                model = genai.GenerativeModel(model_name)
                img = Image.open(file_path)

                response = model.generate_content([
                    "Extract all text from this image exactly as written. "
                    "Include text in all languages (English, Malayalam, Hindi, etc). "
                    "Output only the extracted text, nothing else.",
                    img
                ])

                text = response.text
                if not text or len(text.strip()) < 5:
                    raise ValueError("No text could be extracted from the image")

                logger.info(f"Image OCR successful. Extracted {len(text)} characters.")
                return text

            except Exception as e:
                logger.error(f"Image OCR error: {e}")
                raise ValueError(f"Failed to extract text from image: {str(e)}")

        else:
            # Fallback text
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()
            
    except Exception as e:
        logger.error(f"Error parsing file {original_filename}: {e}")
        # Don't crash the server, just return error text or raise HTTP
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")
