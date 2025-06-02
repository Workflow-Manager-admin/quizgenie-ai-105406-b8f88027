import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

export default function AdminPanel({ user }) {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [catForm, setCatForm] = useState({ name: "", description: "" });
  const [qForm, setQForm] = useState({
    category: "",
    text: "",
    options: ["", "", "", ""],
    correctOption: 0,
    explanation: "",
    aiPrompt: "",
  });
  const [message, setMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    apiRequest("/category")
      .then((res) => setCategories(res.categories))
      .catch(() => setCategories([]));

    apiRequest("/admin/questions")
      .then((res) => setQuestions(res.questions))
      .catch(() => setQuestions([]));
  }, []);

  const handleCatChange = (e) => {
    setCatForm((c) => ({ ...c, [e.target.name]: e.target.value }));
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/category", {
        method: "POST",
        body: JSON.stringify(catForm),
        headers: getAuthHeader(),
      });
      setMessage("Category created!");
      setCatForm({ name: "", description: "" });
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleQChange = (e) => {
    setQForm((q) => ({ ...q, [e.target.name]: e.target.value }));
  };
  const handleOptionChange = (i, v) => {
    setQForm((q) => {
      const options = [...q.options];
      options[i] = v;
      return { ...q, options };
    });
  };

  const handleQSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await apiRequest("/admin/questions", {
        method: "POST",
        body: JSON.stringify(qForm),
        headers: getAuthHeader(),
      });
      setMessage("Question added!");
      setQForm({
        category: "",
        text: "",
        options: ["", "", "", ""],
        correctOption: 0,
        explanation: "",
        aiPrompt: "",
      });
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleAI = async () => {
    setAiLoading(true);
    setMessage("");
    try {
      const aiRes = await apiRequest("/ai/generate-question", {
        method: "POST",
        body: JSON.stringify({ prompt: qForm.aiPrompt }),
      });
      // Expecting AI response to contain {text, options, correctOption, explanation}
      const aiQ =
        aiRes.result?.candidates?.[0]?.content?.parts?.[0]?.text &&
        JSON.parse(aiRes.result.candidates[0].content.parts[0].text);

      if (!aiQ) throw new Error("Invalid AI output format.");

      setQForm((q) => ({
        ...q,
        ...aiQ,
        aiPrompt: q.aiPrompt,
      }));
      setMessage("AI generated question filled into the form. Please review before submitting.");
    } catch (err) {
      setMessage("AI Error: " + (err.message || err));
    }
    setAiLoading(false);
  };

  function getAuthHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: "Bearer " + token } : {};
  }

  return (
    <div className="container admin-panel">
      <h2>Admin Panel</h2>
      <div style={{ marginBottom: 24 }}>
        <b>Add Category</b>
        <form className="admin-form" onSubmit={handleCatSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Category name"
            value={catForm.name}
            onChange={handleCatChange}
            className="input"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={catForm.description}
            onChange={handleCatChange}
            className="input"
          />
          <button className="btn" type="submit">Create Category</button>
        </form>
      </div>
      <div>
        <b>Add Question</b>
        <form className="admin-form" onSubmit={handleQSubmit}>
          <select
            name="category"
            value={qForm.category}
            onChange={handleQChange}
            className="input"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option value={cat._id} key={cat._id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            name="text"
            placeholder="Question text"
            value={qForm.text}
            onChange={handleQChange}
            className="input"
            required
          />
          {[0, 1, 2, 3].map((i) => (
            <input
              key={i}
              type="text"
              name={`option${i}`}
              placeholder={`Option ${i + 1}`}
              value={qForm.options[i]}
              onChange={(e) => handleOptionChange(i, e.target.value)}
              className="input"
              required
            />
          ))}
          <input
            type="number"
            name="correctOption"
            placeholder="Correct option index (0-3)"
            min={0}
            max={3}
            value={qForm.correctOption}
            onChange={handleQChange}
            className="input"
            required
          />
          <input
            type="text"
            name="explanation"
            placeholder="Explanation"
            value={qForm.explanation}
            onChange={handleQChange}
            className="input"
          />
          <div>
            <input
              type="text"
              name="aiPrompt"
              placeholder="Ask AI: prompt (e.g. 'Create a geography question about rivers')"
              value={qForm.aiPrompt}
              onChange={handleQChange}
              style={{ width: "70%" }}
              className="input"
            />
            <button className="btn btn-accent" type="button" onClick={handleAI} disabled={aiLoading}>
              {aiLoading ? "Generating..." : "AI ✨"}
            </button>
          </div>
          <button className="btn btn-large" type="submit" style={{ marginTop: 12 }}>
            Submit Question
          </button>
        </form>
      </div>
      <div style={{ marginTop: 32 }}>
        <b>Existing Questions</b>
        <ul>
          {questions.map((q) => (
            <li key={q._id}>
              <b>Cat:</b> {q.category?.name} — <b>Q:</b> {q.text}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: 20, color: "#ff9800" }}>{message}</div>
    </div>
  );
}
