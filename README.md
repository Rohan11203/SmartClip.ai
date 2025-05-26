# SmartClip

A web application that lets users paste a YouTube link, select a start/end time, and either download the clipped segment or get an AI-generated explanation of its content.

---

## 🚀 Features

- **Precise Clip Extraction**  
  Uses [yt-dlp](https://github.com/yt-dlp/yt-dlp) to fetch YouTube videos and [FFmpeg](https://ffmpeg.org/) to trim to the specified time window.
- **AI-Powered Explanation**  
  Sends the clipped video segment to Google Gemini (via GenAI) for natural-language summaries.
- **Cloud Storage & Delivery**  
  Uploads trimmed clips to Cloudinary for fast, scalable media hosting.
- **Modern Web UI**  
  Built with React, featuring client-side validation, progress bars, and in-browser playback.
- **RESTful API**  
  Node.js + Express backend with MongoDB for clip metadata and user-request management.
- **Containerized & CI/CD**  
  Dockerized services, GitHub Actions pipeline for linting, tests, builds & deployments.

---

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Axios  
- **Backend**: Node.js, Express.js  
- **Video Processing**: yt-dlp, FFmpeg  
- **AI**: Google Gemini (GenAI)  
- **Storage**: Cloudinary  
- **Database**: MongoDB (Mongoose)  
- **CI/CD**: GitHub Actions  
- **Containerization**: Docker  

---

## 📥 Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/yourusername/smartclip.git
   cd smartclip

   PORT=4000
MONGODB_URI=your_mongo_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key


