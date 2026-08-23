# BRICS AgriN-Pulse

![BRICS AgriN-Pulse Banner](https://img.shields.io/badge/Status-Hackathon_Prototype-brightgreen)
![React](https://img.shields.io/badge/Frontend-React_19-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-teal)
![Python](https://img.shields.io/badge/Python-3.13-yellow)

**BRICS AgriN-Pulse** is a cutting-edge, community-driven agricultural intelligence platform built for the *Build with AI: Code for Communities* hackathon. The platform aims to empower farmers with localized insights, leveraging simulated on-device object detection for disease diagnostics, voice-driven AI advisories, and regenerative farming guidelines.

Embracing the futuristic, high-fantasy **"Glowinn"** design aesthetic (dark glassmorphism, dynamic video backgrounds, and neon-tinged UI elements), AgriN-Pulse delivers an engaging, intuitive, and visually stunning experience specifically tailored for agricultural communities.

---

## 🌟 Key Features

*   **Live Leaf Disease Diagnostics:** A mobile-first diagnostic tool that leverages native device cameras (`capture="environment"`) to scan crop leaves. The backend utilizes a dynamic bounding box object detection pipeline (inspired by the PlantDoc dataset) to visualize localized disease spots and confidence scores on-screen.
*   **Voice-Driven Advisory:** Ask farming questions directly through voice! Uses the WebRTC API to capture microphone input and streams it to the backend for simulated local Whisper-based transcription and RAG-powered guidance.
*   **Real-time Alerting:** A global WebSocket connection continuously pushes time-sensitive alerts (e.g., flash flood warnings, extreme heat, pest outbreaks) to the user's dashboard.
*   **Community Forum & Crop Calendar:** An interactive hub for farmers to share knowledge and track optimal sowing, irrigation, and harvesting windows based on localized weather datasets.
*   **Analytics & Policy Dashboards:** Beautiful data visualization using Recharts to present local yields, market prices, and regional agricultural policy updates.
*   **Seamless Localization:** A quick-toggle language selector to easily switch between English (EN), Hindi (HI), Swahili (SW), and Portuguese (PT) to cater to diverse BRICS communities.

---

## 🏗️ Architecture & Tech Stack

### Frontend (React + Vite)
*   **Framework:** React 19, Vite 6
*   **Styling:** TailwindCSS 3.4 (Custom glassmorphism utilities)
*   **Routing:** React Router v7
*   **State Management & Data Fetching:** TanStack React Query v5, Axios
*   **UI Components & Icons:** Recharts, Lucide-React

### Backend (Python + FastAPI)
*   **Framework:** FastAPI (Uvicorn server)
*   **Database:** SQLite with SQLAlchemy ORM (swapped from PostgreSQL/pgvector for rapid hackathon deployment)
*   **Machine Learning (Mocked/Simulated):** 
    *   ONNXRuntime / Transformers (Simulated for live demo to ensure stability and avoid macOS/ARM64 tokenizers deadlocks).
    *   Dynamic pseudo-random inference algorithms designed to mimic real ML bounding box coordinates based on image hashes.
*   **Audio Processing:** Pydub (Audio transcoding for WebRTC Blobs)

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python 3.13 (or 3.11+)
*   `ffmpeg` (Required by `pydub` for audio processing)

### 1. Start the Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Start the FastAPI server on http://localhost:8000
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Start the Frontend
```bash
cd frontend
npm install

# Start the Vite development server on http://localhost:5173
npm run dev
```

---

## 💡 Hackathon Considerations

*   **Mocked ML Workloads:** Due to hardware constraints and threading complexities with Apple Silicon (`libc++abi recursive_mutex lock failed`), the Hugging Face pipelines (`openai/whisper-tiny` & `sentence-transformers`) have been gracefully disabled. The pipeline now deterministically simulates AI responses to guarantee a smooth and uninterrupted live presentation.
*   **In-Memory/SQLite Persistence:** To eliminate the overhead of standing up an external PostgreSQL/pgvector database during a live demo, the application uses a lightweight local `test.db` SQLite database with `check_same_thread=False`.
*   **Simulated Auth:** A bypass mechanism is implemented for demo purposes, placing a mock `agrin_token` in `localStorage` when clicking "Sign In".

---

## 🤝 Contributing
Built with passion for the **Build with AI: Code for Communities** Hackathon.
