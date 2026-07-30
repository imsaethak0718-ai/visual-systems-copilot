import requests
import json
from PIL import Image, ImageDraw

def run_test():
    print("1. Creating dummy test image and text file...")
    
    # Create a dummy image
    img = Image.new('RGB', (400, 300), color=(73, 109, 137))
    d = ImageDraw.Draw(img)
    d.text((10,10), "Architecture Diagram", fill=(255,255,0))
    d.text((10,30), "API Gateway -> Auth Service -> Database", fill=(255,255,255))
    img.save('test_diagram.png')
    
    # Create a dummy text file
    with open('test_notes.txt', 'w') as f:
        f.write("The system relies on a Redis cache for sessions. The database is a single PostgreSQL instance with no replicas.")
    
    print("2. Uploading files to the local FastAPI server...")
    
    url_upload = 'http://127.0.0.1:8000/upload'
    files = [
        ('files', ('test_diagram.png', open('test_diagram.png', 'rb'), 'image/png')),
        ('files', ('test_notes.txt', open('test_notes.txt', 'rb'), 'text/plain'))
    ]
    
    res = requests.post(url_upload, files=files)
    print("Upload response:", res.json())
    
    print("\n3. Calling /analyze to trigger Gemma multimodal analysis (this might take 10-20 seconds)...")
    url_analyze = 'http://127.0.0.1:8000/analyze'
    res_analyze = requests.post(url_analyze)
    
    if res_analyze.status_code == 200:
        data = res_analyze.json()
        print("\n=== SUCCESS: GEMMA OUTPUT ===\n")
        print(json.dumps(data, indent=2))
        
        # Verify if the expected keys are present
        if "Components" in data:
            print(f"\nGemma found {len(data['Components'])} components.")
        else:
            print("\nWarning: Expected JSON structure not returned by model.")
            
    else:
        print("\n=== ERROR ===\n")
        print("Status code:", res_analyze.status_code)
        print("Response:", res_analyze.text)

if __name__ == "__main__":
    run_test()
