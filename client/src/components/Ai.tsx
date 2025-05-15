import React from "react";

const Ai = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 mb-40 p-12 rounded-4xl bg-gradient-to-b from-orange-200 to-white">
      <h1 className="text-center spectral-bold  text-6xl text-slate-700">
        <span>Turn Your Content Into an</span>
        <br />
        <span>AI Assistant Today</span>
      </h1>
      <p className="text-center text-lg p-4">
        No code. No prompt engineering. Just results.
      </p>
      <div className="text-center pt-4 spectral-medium">
        <input
          placeholder="Enter Your Email"
          className="border-none outline-none shadow-md h-14 p-4 bg-white rounded-4xl mr-4 w-86"
        />
        <button className="border bg-orange-500 text-white h-14 w-26 rounded-4xl">
          Join Beta
        </button>
      </div>
    </div>
  );
};

export default Ai;
