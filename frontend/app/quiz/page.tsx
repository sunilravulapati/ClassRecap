"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function QuizPage() {
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    api.get("/quiz").then(res => setQuestions(res.data));
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-xl font-semibold">Quick Check</h2>

      {questions.map((q, i) => (
        <div key={i} className="mt-4">
          <p>{q.question}</p>
          <input className="border w-full p-2 mt-1" />
        </div>
      ))}
    </div>
  );
}
