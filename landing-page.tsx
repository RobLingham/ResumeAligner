import { Upload } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Optimize Your Resume for Any Job in Minutes
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Upload your resume and job description, get a tailored score, and receive actionable feedback.
      </p>
      <Link href="/upload" className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center">
        <Upload className="mr-2" />
        Upload Your Resume
      </Link>
      <div className="mt-12">
        <img
          src="/placeholder.svg?height=400&width=600"
          alt="Job matching illustration"
          className="max-w-full h-auto"
        />
      </div>
    </div>
  )
}