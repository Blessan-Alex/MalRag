import asyncio
import os
import sys

# Add the parent directory to sys.path to import malrag modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from malrag.llm import gemini_key_manager, gemini_complete

async def main():
    print("--- Verifying Gemini Key Manager ---")
    keys = gemini_key_manager.keys
    print(f"Loaded {len(keys)} keys.")
    if len(keys) > 0:
        print(f"First key ends with: ...{keys[0][-4:]}")
    if len(keys) > 1:
        print(f"Second key ends with: ...{keys[1][-4:]}")
    
    current_key = gemini_key_manager.get_current_key()
    print(f"Current key: ...{current_key[-4:] if current_key else 'None'}")
    
    print("\n--- Testing Rotation Logic (Simulated) ---")
    # Simulate rotation
    new_key = gemini_key_manager.rotate_key()
    print(f"Rotated key: ...{new_key[-4:] if new_key else 'None'}")
    
    print("\n--- Testing Real API Call ---")
    try:
        response = await gemini_complete("Say 'Hello, World!'")
        print(f"Response: {response}")
    except Exception as e:
        print(f"API Call Failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
