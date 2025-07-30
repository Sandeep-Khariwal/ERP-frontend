import React from "react";

const CurvedLine = () => {
  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <svg
        viewBox="0 0 400 30"
        preserveAspectRatio="none"
        style={{ height: "30px", width: "100%" }}
      >
        <path
          d="M0,15 C100,0 300,30 400,15"
          stroke="#0B0B2E"
          strokeWidth="5"
          fill="none"
        />
};

export default CurvedLine;
