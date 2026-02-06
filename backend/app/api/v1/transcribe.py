from fastapi import APIRouter, UploadFile, File, HTTPException
import google.generativeai as genai
import os
import tempfile
import shutil
import logging
import time
from malrag.llm import gemini_key_manager

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        # Save uploaded file temporarily
        # Ensure we keep the extension correctly
        ext = os.path.splitext(file.filename)[1]
        if not ext:
            ext = ".webm" # Defaul fallback
            
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_path = tmp_file.name

        file_size = os.path.getsize(tmp_path)
        logger.info(f"Received audio file: {tmp_path} (Size: {file_size} bytes)")
        
        if file_size < 100:
             logger.warning(f"File size is suspiciously small ({file_size} bytes). This might be why Gemini fails.")

        text = None
        max_retries = 3
        
        # Retry loop with key rotation
        for attempt in range(max_retries):
            try:
                api_key = gemini_key_manager.get_current_key()
                if not api_key:
                    raise ValueError("No Gemini API key available")
                
                genai.configure(api_key=api_key)
                
                # Upload to Gemini
                logger.info(f"Uploading audio file to Gemini (Attempt {attempt+1})...")
                myfile = genai.upload_file(tmp_path)
                logger.info(f"File uploaded: {myfile.name}")
                
                # Wait for file to be active
                logger.info("Waiting for file to process...")
                while myfile.state.name == "PROCESSING":
                    time.sleep(2)
                    myfile = genai.get_file(myfile.name)
                    
                if myfile.state.name != "ACTIVE":
                    raise ValueError(f"File {myfile.name} failed to process. State: {myfile.state.name}")
                
                logger.info("File is ACTIVE. Requesting transcription...")
                
                # Generate content
                model_name = os.environ.get("LLM_MODEL", "gemini-2.5-flash")
                model = genai.GenerativeModel(model_name)
                
                result = model.generate_content(
                    [myfile, "Transcribe this audio file exactly as spoken. Output only the text."]
                )
                
                text = result.text
                logger.info(f"Transcription successful. Length: {len(text)} chars")
                break # Success
                
            except Exception as e:
                logger.error(f"Transcription failed with key ...{api_key[-4:] if api_key else 'None'}: {e}")
                gemini_key_manager.rotate_key()
                if attempt == max_retries - 1:
                    raise HTTPException(status_code=500, detail=f"Transcription failed after retries (File Size: {file_size} bytes): {str(e)}")
                time.sleep(1) # wait a bit before retry

        return {"text": text}
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Transcription error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temp file
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except:
                pass
