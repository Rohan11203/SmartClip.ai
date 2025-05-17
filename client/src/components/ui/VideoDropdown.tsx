import { useState } from "react";

type VideoItem = {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
};

type Props = {
  videos: VideoItem[];
  onSelect: (videoId: string) => void;
};

export default function VideoDropdown({ videos, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<VideoItem | null>(null);

  const handleSelect = (video: VideoItem) => {
    setSelected(video);
    onSelect(video.id);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-full pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-[#121212] dark:border-slate-600 border rounded-md shadow-sm hover:bg-gray-100"
      >
        {selected ? (
          <div className="flex items-center gap-2">
            <img src={selected.thumbnail} alt="thumb" className="w-10 h-6 rounded object-cover" />
            <div className="text-sm">{selected.title}</div>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Select a video</span>
        )}
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-black border rounded-md shadow-lg max-h-64 overflow-auto">
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleSelect(video)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-900 cursor-pointer"
            >
              <img src={video.thumbnail} alt="thumb" className="w-12 h-8 rounded object-cover" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{video.title}</span>
                <span className="text-xs text-gray-500">{video.duration}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}