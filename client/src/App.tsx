import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState({
    url: "",
    startTime: "",
    endTime: "",
  });

  async function handleSubmit() {
    try {
      // 1) Tell axios to give us a blob
      const response = await axios.post(
        "http://localhost:3000/api/v1/videos/clip",
        data,
        { responseType: "blob" }            // <-- important
      );

      // 2) Build a URL for that blob
      const blob = new Blob([response.data], { type: "video/mp4" });
      const url = window.URL.createObjectURL(blob);

      // 3) Create a temporary <a> to kick off the download
      const link = document.createElement("a");
      link.href = url;
      link.download = "clip.mp4";           // the suggested filename
      document.body.appendChild(link);
      link.click();
      link.remove();

      // 4) (Optional) Release the object URL
      window.URL.revokeObjectURL(url);

      console.log("Download started");
    } catch (err) {
      console.error("Download failed", err);
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex justify-center">
      <div className="bg-slate-300 flex justify-center flex-col h-70 w-96 p-4 space-y-2">
        <input
          value={data.url}
          name="url"
          onChange={handleChange}
          placeholder="YouTube URL"
          className="p-2 border"
        />
        <input
          value={data.startTime}
          name="startTime"
          onChange={handleChange}
          placeholder="Start Time (HH:MM:SS)"
          className="p-2 border"
        />
        <input
          value={data.endTime}
          name="endTime"
          onChange={handleChange}
          placeholder="End Time (HH:MM:SS)"
          className="p-2 border"
        />
        <button
          onClick={handleSubmit}
          className="p-2 border bg-yellow-500"
        >
          Download Clip
        </button>
      </div>
    </div>
  );
}

export default App;
