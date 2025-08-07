

import React from "react";

const GAS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyAoqLYNox-d-ry9SJHOBT_VIxHGHsnu60vaodPzRU/dev";

const TimelogWidget = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(120deg,#2dd4bf 0%,#60a5fa 60%,#a78bfa 100%)" }}>
      <iframe
        src={GAS_WEBAPP_URL}
        title="Timelog Google Apps Script Web App"
        width="100%"
        height="100%"
        style={{ border: "none", minHeight: "90vh", minWidth: "90vw", borderRadius: 16, boxShadow: "0 8px 40px #38bdf877" }}
        allowFullScreen
      />
    </div>
  );
};

export default TimelogWidget;
