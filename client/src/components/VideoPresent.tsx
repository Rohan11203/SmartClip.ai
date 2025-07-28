const VideoPlayer = ({ src, className = "" }: any) => (
  <div
    className={`max-w-7xl mx-auto p-2  rounded-2xl ${className}`}
  >
    <video
      src={src}
      controls
      autoPlay
      muted
      playsInline
      className="w-full h-auto rounded shadow-md outline-none"
    />
  </div>
);

export default VideoPlayer;
