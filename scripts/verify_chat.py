import requests
import json
import sys

def verify_chat():
    url = "http://localhost:8000/api/v1/chat/query"
    payload = {
        "query": "What is in the mal.txt file?",
        "mode": "hybrid",
        "only_need_context": False
    }
    headers = {"Content-Type": "application/json"}

    print(f"Sending request to {url}...")
    try:
        response = requests.post(url, json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        try:
            data = response.json()
            print("Response JSON:")
            print(json.dumps(data, indent=2))
            
            if data.get("data"):
                print("SUCCESS: Received data from chat endpoint.")
            else:
                print("WARNING: 'data' field is empty or null.")
                
        except json.JSONDecodeError:
            print("Response is not JSON.")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to backend. Is it running?")

if __name__ == "__main__":
    verify_chat()
