"use client"

import { useState } from 'react'
import { Upload, Link } from 'lucide-react'

export default function UploadInputPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setResumeFile(file)
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle form submission (e.g., send data to backend)
    console.log({ resumeFile, resumeText, jobDescription })
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Upload Your Resume</h2>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop your resume here, or click to select a file
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: PDF, TXT
          </p>
        </div>
        {resumeFile && (
          <p className="mt-2 text-sm text-green-600">
            File uploaded: {resumeFile.name}
          </p>
        )}
        <div className="mt-4">
          <label htmlFor="resumeText" className="block text-sm font-medium text-gray-700 mb-2">
            Or paste your resume content:
          </label>
          <textarea
            id="resumeText"
            rows={5}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Paste your resume content here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Enter Job Description</h2>
        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Paste the job description or enter a URL link:
          </label>
          <textarea
            id="jobDescription"
            rows={10}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Paste the job description or enter a URL..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Analyze
          </button>
        </div>
      </div>
    </div>
  )
}