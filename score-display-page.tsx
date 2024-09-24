"use client"

import { useState } from 'react'
import { CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'

export default function ScoreDisplayPage() {
  const [showQuestions, setShowQuestions] = useState(false)
  const score = 85 // This would be dynamically set based on the analysis

  const getScoreColor = (score: number) => {
    if (score <= 50) return 'text-red-600'
    if (score <= 79) return 'text-yellow-500'
    return 'text-green-500'
  }

  const strengths = [
    "Strong experience in web development",
    "Proficiency in React and Next.js",
    "Excellent problem-solving skills",
  ]

  const improvements = [
    "Add more details about database management experience",
    "Include examples of working in Agile environments",
    "Highlight any DevOps or CI/CD experience",
  ]

  const interviewQuestions = [
    "Can you describe a challenging project you worked on and how you overcame obstacles?",
    "How do you stay updated with the latest web development trends and technologies?",
    "What's your approach to optimizing website performance?",
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <svg className="w-32 h-32">
              <circle
                className="text-gray-300"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
              <circle
                className={getScoreColor(score)}
                strokeWidth="5"
                strokeDasharray={360}
                strokeDashoffset={(100 - score) / 100 * 360}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
            </svg>
            <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2">Your Alignment Score</h2>
        <p className="text-gray-600 text-center">
          {score <= 50 && "Your resume needs significant improvements to align with this job description."}
          {score > 50 && score <= 79 && "Your resume aligns moderately well with the job description, but there's room for improvement."}
          {score > 79 && "Great job! Your resume aligns very well with the job description."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <CheckCircle className="text-green-500 mr-2" />
            Strengths Identified
          </h3>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <AlertTriangle className="text-yellow-500 mr-2" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {improvements.map((improvement, index) => (
              <li key={index} className="flex items-start">
                <AlertTriangle className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Interview Preparation Questions</h3>
        <button
          onClick={() => setShowQuestions(!showQuestions)}
          className="flex items-center justify-between w-full py-2 px-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          <span>View Questions</span>
          {showQuestions ? <ChevronUp /> : <ChevronDown />}
        </button>
        {showQuestions && (
          <ul className="mt-4 space-y-4">
            {interviewQuestions.map((question, index) => (
              <li key={index} className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium">{question}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 text-center">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Answer Questions to Improve Your Score
        </button>
      </div>
    </div>
  )
}