import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function Quizzes() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiRequest("/category")
      .then((res) => setCategories(res.categories))
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="container">
      <h2>Quiz Categories</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat._id} style={{ margin: "16px 0" }}>
            <b>{cat.name}</b>
            <div>{cat.description}</div>
            <Link className="btn" to={`/quiz/${cat._id}`} style={{ marginTop: 6 }}>
              Start Quiz
            </Link>
          </li>
        ))}
      </ul>
      {!categories.length && <div>No categories available.</div>}
    </div>
  );
}
