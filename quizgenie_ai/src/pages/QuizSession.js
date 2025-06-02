import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function QuizSession() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    apiRequest(`/quiz/start/${categoryId}`)
      .then((res) => setQuestions(res.questions))
      .catch(() => setQuestions([]));
  }, [categoryId]);

  const handleAnswer = (answerIdx) => {
    setAnswers([...answers, { question: questions[idx]._id, answer: answerIdx }]);
    if (idx + 1 < questions.length) setIdx(idx + 1);
    else setShowResult(true);
  };

  const handleSubmit = async () => {
    try {
      const res = await apiRequest("/quiz/submit", {
        method: "POST",
        body: JSON.stringify({ categoryId, answers }),
      });
      setScore(res.score);
    } catch (err) {
      setScore(-1);
    }
  };

  useEffect(() => {
    if (showResult) handleSubmit();
  // eslint-disable-next-line
  }, [showResult]);

  if (!questions.length) return <div className="container">Loading questions...</div>;

  if (showResult)
    return (
      <div className="container">
        <h2>
          Quiz Complete! {score !== null ? `Your Score: ${score} / ${questions.length}` : "Submitting..."}
        </h2>
        <button className="btn" onClick={() => navigate("/results")}>View My Results</button>
      </div>
    );

  const q = questions[idx];
  return (
    <div className="container">
      <div className="quiz-question">
        <h2>Question {idx + 1} / {questions.length}</h2>
        <div className="quiz-q">{q.text}</div>
        <ul className="quiz-options">
          {q.options.map((op, i) => (
            <li key={i}>
              <button className="btn" onClick={() => handleAnswer(i)}>{op}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
