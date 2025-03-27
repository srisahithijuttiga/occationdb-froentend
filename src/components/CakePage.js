import React from "react";

const CakePage = ({ person }) => {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#fff5f5",
      fontFamily: "Segoe UI, sans-serif"
    }}>
      <div style={{
        background: "#fff",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        textAlign: "center"
      }}>
        <h1>🎂 Happy Birthday, {person?.name}!</h1>
        <p>{person?.greeting}</p>
        <p>(Full animated cake goes here later)</p>
      </div>
    </div>
  );
};

export default CakePage;
