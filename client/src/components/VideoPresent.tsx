const VideoPlayer = ({ src, className = "" }: any) => (
  <div
    className={`max-w-2xl mx-auto p-4  rounded-lg ${className}`}
  >
    <video
      src={src}
      controls
      autoPlay
      muted
      playsInline
      className="w-full h-auto rounded shadow-md outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
    />
  </div>
);

export default VideoPlayer;
