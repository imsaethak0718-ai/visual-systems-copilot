# Visual Systems Copilot 🧠📐

*Built for the IEEE CS SRMIST KTR "Build with Gemma" Hackathon — VisionWorks Track.*

Visual Systems Copilot is an intelligent engineering tool that turns static architecture diagrams into interactive, living Knowledge Graphs. Powered entirely by the multimodal reasoning capabilities of **Gemma 4**, this application ingests raw architecture images alongside textual infrastructure notes, reasons across them holistically, and automatically generates a topological graph of your system.

## ✨ Key Features

- **Multimodal Ingestion:** Upload any architecture diagram (`.png`, `.jpg`, `.pdf`) and infrastructure notes simultaneously.
- **Automated Knowledge Graph Generation:** Gemma 4's vision capabilities analyze the uploaded diagram, identify microservices, databases, gateways, and their exact relationships, and reconstruct them into an interactive ReactFlow topology map.
- **Risk & SPOF Detection:** The AI automatically scans the topological data to identify Single Points of Failure, latency bottlenecks, and un-replicated databases.
- **System Copilot Chat:** Chat directly with the AI about your architecture. The AI retains the full context of the visual diagram you uploaded.

## 🛠️ Tech Stack

- **AI Model:** Gemma 4 (`gemma-4-31b-it`) via the Gemini Developer API (`google-genai` SDK).
- **Backend:** Python, FastAPI, Uvicorn, Pillow (for image processing).
- **Frontend:** Next.js (App Router), ReactFlow, Tailwind CSS, Framer Motion.

## 🚀 Getting Started

### 1. Backend Setup

The backend handles the multimodal integration with Gemma 4.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Add your Google API Key:
   Create a `.env` file in the `backend/` directory and add your key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   GEMMA_MODEL=gemma-4-31b-it
   ```
4. Start the FastAPI server:
   ```bash
   python -m uvicorn app.main:app --reload --env-file .env
   ```
   The backend will run on `http://127.0.0.1:8000`.

### 2. Frontend Setup

The frontend provides the dashboard, interactive graph, and copilot chat.

1. Navigate to the root directory (or open a new terminal in the root).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 How to use it

1. Go to the **Upload** page in the web app.
2. Upload a sample architecture diagram image.
3. Click **Process** and wait ~40 seconds for Gemma to reason across the image.
4. Navigate to the **Knowledge Graph** tab to explore the dynamically generated topology mapped out directly from your image!
