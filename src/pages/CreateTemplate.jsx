import React, { useState, useEffect } from "react";

function CreateTemplate() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [templates, setTemplates] = useState([]); // For displaying saved templates

  // Fetch existing templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("https://phishing-backend-3.onrender.com/api/templates");
        const data = await res.json();
        setTemplates(data.templates || []); // <-- Important: your backend wraps it in `templates`
      } catch (err) {
        console.error("❌ Error fetching templates:", err);
      }
    };

    fetchTemplates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://phishing-backend-3.onrender.com/api/templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, subject, body }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Template Created!");
      setTitle("");
      setSubject("");
      setBody("");
      setTemplates([...templates, data.template]); // Optional: add new to list
    } else {
      alert("❌ Error: " + data.error);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">✍️ Create Phishing Email Template</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Template Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Email Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Email Body (you can include a fake login link here)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-2 border rounded h-40"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Template
        </button>
      </form>

      {/* Show saved templates */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-2">📂 Saved Templates</h3>
        <ul className="space-y-2">
          {templates.map((tpl) => (
            <li key={tpl._id} className="p-3 border rounded bg-white text-black">
              <p><strong>📌 Title:</strong> {tpl.title || "(Untitled)"}</p>
              <p><strong>📨 Subject:</strong> {tpl.subject}</p>
              <p className="text-sm text-gray-500">
                🕒 {new Date(tpl.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CreateTemplate;
