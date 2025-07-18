import axios from "axios";
import { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import ProcessingModal from "./ui/ProcessingModal";
import { Clock, Link as LinkIcon } from 'lucide-react';

const TimeInput = ({ value, onChange, name }:any) => {
  const [time, setTime] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    const [h = '00', m = '00', s = '00'] = (value || "00:00:00").split(':');
    setTime({ h, m, s });
  }, [value]);

  const handleTimeChange = (part:any, val:any) => {
    const numericVal = parseInt(val, 10);
    let newPartVal = val;

    if (part === 'h' && numericVal > 23) newPartVal = '23';
    if ((part === 'm' || part === 's') && numericVal > 59) newPartVal = '59';
    if (numericVal < 0) newPartVal = '00';
    
    const newTime = { ...time, [part]: newPartVal };
    setTime(newTime);
  };
  
  const handleBlur = (part:any, val:any) => {
      const paddedVal = val.toString().padStart(2, '0');
      const newTime = { ...time, [part]: paddedVal };
      setTime(newTime);
      
      const fullTimeString = `${newTime.h}:${newTime.m}:${newTime.s}`;
      onChange({ target: { name, value: fullTimeString } });
  }

  return (
    <div className="flex items-center gap-2 rounded-md bg-gray-100 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-600 px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
      <Clock className="w-5 h-5 text-gray-400" />
      <input
        type="number"
        min="0"
        max="23"
        value={time.h}
        onBlur={(e) => handleBlur('h', e.target.value)}
        onChange={(e) => handleTimeChange('h', e.target.value)}
        className="w-10 bg-transparent text-center font-mono focus:outline-none no-spinner"
        placeholder="HH"
      />
      <span className="font-mono text-gray-400">:</span>
      <input
        type="number"
        min="0"
        max="59"
        value={time.m}
        onBlur={(e) => handleBlur('m', e.target.value)}
        onChange={(e) => handleTimeChange('m', e.target.value)}
        className="w-10 bg-transparent text-center font-mono focus:outline-none no-spinner"
        placeholder="MM"
      />
      <span className="font-mono text-gray-400">:</span>
      <input
        type="number"
        min="0"
        max="59"
        value={time.s}
        onBlur={(e) => handleBlur('s', e.target.value)}
        onChange={(e) => handleTimeChange('s', e.target.value)}
        className="w-10 bg-transparent text-center font-mono focus:outline-none no-spinner"
        placeholder="SS"
      />
    </div>
  );
};


const ClipForm = () => {
  const [data, setData] = useState({
    url: "",
    startTime: "00:00:00",
    endTime: "00:00:00",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
      setTheme(localStorage.getItem('theme') || 'dark');
  }, []);


  async function handleSubmit() {
    setIsProcessing(true);
    setLoading(true);
    setError(""); 
    try {
      const response = await axios.post(
        "https://smartclip-ai.onrender.com/api/v1/videos/clip",
        data,
        { responseType: "blob" }
      );

      if (response.headers['content-type'] === 'application/json') {
          const errorJson = JSON.parse(await response.data.text());
          throw new Error(errorJson.error || 'An unknown error occurred');
      }

      const blob = new Blob([response.data], { type: "video/mp4" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `clip_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Download failed", err);
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* This style tag will hide the spinners on number inputs */}
      <style>{`
        .no-spinner::-webkit-outer-spin-button,
        .no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
      <div className="w-full max-w-lg mx-auto">
          <ProcessingModal
              isOpen={isProcessing}
              onComplete={() => setIsProcessing(false)}
              error={error}
          />
          <div className="space-y-6">
              <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video URL</label>
                  <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <LinkIcon className="w-5 h-5 text-gray-400" />
                      </span>
                      <input
                          id="url"
                          value={data.url}
                          name="url"
                          onChange={handleChange}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full pl-10 p-3 bg-gray-100 dark:bg-black border border-gray-300 dark:border-neutral-700  rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500 dark:placeholder-gray-400 transition"
                      />
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Time</label>
                      <TimeInput name="startTime" value={data.startTime} onChange={handleChange} />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Time</label>
                      <TimeInput name="endTime" value={data.endTime} onChange={handleChange} />
                  </div>
              </div>

              <button
                  disabled={loading}
                  onClick={handleSubmit}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 cursor-pointer disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-semibold rounded-md shadow-md transition flex items-center justify-center"
              >
                  {loading ? (
                      <>
                          <ClipLoader size={20} color={"#FFF"} className="mr-2" />
                          <span>Creating Clip...</span>
                      </>
                  ) : "Download Clip"}
              </button>
              
              {error && !isProcessing && <p className="text-center text-red-500 text-sm">{error}</p>}
          </div>
      </div>
    </>
  );
};

export default ClipForm;
