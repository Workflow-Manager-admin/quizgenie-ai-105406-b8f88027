import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

export default function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    apiRequest("/user/results")
      .then((res) => setResults(res.results || []))
      .catch(() => setResults([]));
  }, []);

  return (
    <div className="container">
      <h2>My Quiz Results</h2>
      <ul>
        {results.map((r) => (
          <li key={r._id} style={{ margin: "10px 0" }}>
            <b>{r.category?.name || "Category"}</b>: {r.score} / {(r.answers || []).length} &nbsp;
            [{new Date(r.completedAt).toLocaleString()}]
          </li>
        ))}
      </ul>
      {!results.length && <div>No results yet.</div>}
    </div>
  );
}
