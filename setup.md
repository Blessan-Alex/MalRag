# MalRag Project Setup Guide

This guide describes how to set up the MalRag project from scratch on a Windows machine (also applicable to macOS/Linux with minor command adjustments).

## Prerequisites

Before starting, ensure you have the following installed:

1.  **Python 3.9+**:
    *   Download and install from [python.org](https://www.python.org/downloads/).
    *   **Important during installation**: Check the box **"Add Python to PATH"**.
    *   Verify installation:
        ```powershell
        python --version
        ```

2.  **Node.js & npm** (for Frontend):
    *   Download the **LTS (Long Term Support)** version from [nodejs.org](https://nodejs.org/).
    *   Verify installation:
        ```powershell
        node -v
        npm -v
        ```

3.  **Git** (Optional but recommended):
    *   Download from [git-scm.com](https://git-scm.com/).

---

## Backend Setup (Python)

1.  **Navigate to the project directory**:
    Open a terminal (Command Prompt or PowerShell) and go to the project folder:
    ```powershell
    cd path\to\malrag
    ```

2.  **Create a Virtual Environment**:
    It is best practice to use a virtual environment to manage dependencies locally.
    ```powershell
    python -m venv venv
    ```

3.  **Activate the Virtual Environment**:
    *   **Windows**:
        ```powershell
        .\venv\Scripts\Activate
        ```
    *   **Mac/Linux**:
        ```bash
        source venv/bin/activate
        ```
    *(You should see `(venv)` appear at the start of your terminal line).*

4.  **Install Dependencies**:
    Install all required Python packages from `requirements.txt`:
    ```powershell
    pip install -r requirements.txt
    ```

5.  **Configure Environment Variables**:
    Create a `.env` file in the root directory (`malrag/`) if it doesn't exist. Add your API keys (like Google Gemini or OpenAI):
    ```env
    # Example .env content
    GOOGLE_API_KEY=your_google_api_key_here
    OPENAI_API_KEY=your_openai_api_key_here
    ```

6.  **Run the Backend Server**:
    Start the FastAPI backend:
    ```powershell
    python -m backend.app.main
    ```
    The backend should now be running (usually at `http://localhost:8000`).

---

## Frontend Setup (Next.js)

1.  **Navigate to the frontend directory**:
    Open a **new** terminal window (keep the backend running in the first one) and go to the `frontend` folder:
    ```powershell
    cd path\to\malrag\frontend
    ```

2.  **Install Dependencies**:
    Run the following command to install all Node.js packages:
    ```powershell
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the `frontend/` directory if needed.
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

4.  **Run the Frontend**:
    Start the development server:
    ```powershell
    npm run dev
    ```
    The frontend should now be running at `http://localhost:3000`.

---

## Troubleshooting

-   **"python is not recognized..."**: Ensure you checked "Add Python to PATH" during installation. You may need to reinstall Python or add it to your system PATH manually.
-   **"npm is not recognized..."**: Ensure Node.js is installed and you have restarted your terminal after installation.
-   **ModuleNotFoundError**: Make sure your virtual environment is activated (`(venv)` is visible) and you have run `pip install -r requirements.txt`.
