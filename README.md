# DocMind — AI Document Assistant

A beginner-friendly full-stack AI app for uploading documents, generating summaries, and asking questions — powered by **Gemini**, **LangChain**, **MongoDB**, and **React**.


## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React + Vite + Tailwind CSS + Axios |
| Backend   | Node.js + Express.js                |
| Database  | MongoDB + Mongoose                  |
| AI        | LangChain JS + Google Gemini API    |
| File Upload | Multer                            |

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI
- **Google Gemini API Key** — free at [aistudio.google.com](https://aistudio.google.com/app/apikey)


## Setup Instructions

### 1. Clone the repo

bash
git clone <your-repo-url>
cd ai-doc-assistant


### 2. Set up the Backend

bash
cd server
npm install


Create a `.env` file:

bash
cp .env.example .env


Edit `.env`:

env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-doc-assistant
GEMINI_API_KEY=your_gemini_api_key_here

Start the server:

bash
npm run dev       # with nodemon (auto-reload)
# OR
npm start         # plain node


You should see:

MongoDB connected
Server running on port 5000


### 3. Set up the Frontend

bash
cd ../client
npm install
npm run dev


Open [http://localhost:3000](http://localhost:3000) in your browser.



## API Routes

| Method | Route        | Description                          |
|--------|--------------|--------------------------------------|
| POST   | `/upload`    | Upload a .txt or .pdf file           |
| GET    | `/upload`    | Get list of all uploaded documents   |
| POST   | `/summarize` | Generate AI summary for a document   |
| POST   | `/ask`       | Ask a question about a document      |
| GET    | `/history`   | Get chat history for a document      |

### Request / Response Examples

**POST /upload**

Form-data: { file: <file> }
Response: { message, document: { _id, filename, fileType, size, createdAt } }


**POST /summarize**
json
{ "documentId": "665abc123..." }
→ { "summary": "This document covers...", "cached": false }


**POST /ask**
json
{ "documentId": "665abc123...", "question": "What is the main topic?" }
→ { "question": "...", "answer": "The main topic is..." }


**GET /history?documentId=665abc123...**
json
[{ "question": "...", "answer": "...", "createdAt": "..." }]




## How the AI Pipeline Works


User uploads file
       ↓
Text extracted (TXT: fs.readFileSync / PDF: pdf-parse)
       ↓
Content saved to MongoDB
       ↓
User clicks "Generate Summary"
       ↓
LangChain PromptTemplate → ChatGoogleGenerativeAI (gemini-1.5-flash) → StringOutputParser
       ↓
Summary cached in MongoDB
       ↓
User asks a question
       ↓
Document content passed as context in prompt
       ↓
LangChain chain returns concise answer
       ↓
Q&A pair saved to ChatHistory in MongoDB


> **No vector database** is used. For simplicity, document text is passed directly in the prompt (truncated to 8000 characters). For production-scale RAG, you'd add a vector store like Chroma or Pinecone.



## Environment Variables

env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-doc-assistant
GEMINI_API_KEY=your_gemini_api_key_here


## Common Issues
| `Only .txt and .pdf files are allowed` |

## Possible Improvements

- Add vector-based RAG with ChromaDB for large document support
- Multi-document comparison
- Export chat history as PDF
- User authentication with JWT
- Streaming responses (SSE)
