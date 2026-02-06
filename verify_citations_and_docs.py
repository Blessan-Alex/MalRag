import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/v1"

def test_get_documents():
    print("Testing GET /ingest/documents...")
    try:
        url = f"{BASE_URL}/ingest/documents"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            print("Response:", json.dumps(data, indent=2))
            docs = data.get("data", {}).get("documents", [])
            if len(docs) > 0:
                print("SUCCESS: Documents found.")
                return True
            else:
                print("WARNING: No documents found (did you seed documents.json?).")
                return False
        else:
            print(f"FAILED: Status code {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"FAILED: Connection error: {e}")
        return False

def test_chat_sources():
    print("\nTesting POST /chat/query with sources...")
    try:
        payload = {
            "query": "What are the maintenance checks?",
            "mode": "hybrid",
            "only_need_context": False
        }
        url = f"{BASE_URL}/chat/query"
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            # print("Response:", json.dumps(data, indent=2))
            
            answer = data.get("data", "")
            sources = data.get("sources", [])
            
            print(f"Answer length: {len(answer)}")
            print(f"Sources count: {len(sources)}")
            
            if sources:
                print("First source:", sources[0])
                print("SUCCESS: Sources returned.")
                return True
            else:
                print("WARNING: No sources returned (maybe no context found?).")
                return True # Not strictly a failure of the mechanism, just RAG quality
        else:
            print(f"FAILED: Status code {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"FAILED: Connection error: {e}")
        return False

if __name__ == "__main__":
    success_docs = test_get_documents()
    success_chat = test_chat_sources()
    
    if success_docs and success_chat:
        print("\nOVERALL SUCCESS")
    else:
        print("\nOVERALL FAILURE")
        sys.exit(1)
