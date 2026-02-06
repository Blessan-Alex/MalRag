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
        
        else:
            # Fallback text
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()
            
    except Exception as e:
        logger.error(f"Error parsing file {original_filename}: {e}")
        # Don't crash the server, just return error text or raise HTTP
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")
