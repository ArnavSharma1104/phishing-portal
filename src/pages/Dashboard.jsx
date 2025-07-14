import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail")?.trim().toLowerCase();

  useEffect(() => {
    fetch("https://phishing-backend-3.onrender.com/api/activity/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        action: "Visited Dashboard",
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ Log saved:", data))
      .catch((err) => console.error("❌ Log error:", err));
  }, [userEmail]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-yellow-600">📁 Dashboard</h1>
      <p className="text-lg text-gray-700 mb-6">Welcome, {userEmail}!</p>

      <div className="flex gap-4">
        {userEmail === "arnav@gmail.com" && (
          <button
            onClick={() => navigate("/admin")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            🔒 Go to Admin Panel
          </button>
        )}
        <button
          onClick={() => navigate("/email-sim")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          🧪 Try Email Simulator
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
