from fastapi import APIRouter, UploadFile, File, HTTPException
import google.generativeai as genai
import os
import tempfile
import shutil

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        # Check if API key is set
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
             raise HTTPException(status_code=500, detail="GOOGLE_API_KEY not set in server environment")
        
        genai.configure(api_key=api_key)
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.split('.')[-1]}") as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_path = tmp_file.name

        try:
            # Upload to Gemini
            myfile = genai.upload_file(tmp_path)
            
            # Generate content using specific model configuration
            model_name = os.environ.get("LLM_MODEL", "gemini-2.5-flash")
            model = genai.GenerativeModel(model_name)
            
            # Prompt for transcription
            result = model.generate_content(
                [myfile, "Transcribe this audio file strictly. Output only the transcription text."]
            )
            
            return {"text": result.text}
            
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
                
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
