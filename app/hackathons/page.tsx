import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Code, Clock, Zap } from "lucide-react"

export default function HackathonsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6">
          <Code className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 sm:text-5xl sm:tracking-tight">
          Hackathons Coming Soon!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We're building something amazing for the developer community. 
          Get ready to join the hackathons that can land you a job not just rewards.
        </p>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Exciting Challenges</h3>
            <p className="text-gray-600 text-sm">Tackle real-world problems with innovative solutions</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Code className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Showcase Your Skills </h3>
            <p className="text-gray-600 text-sm">Build, learn, and compete to grab the attention of the industry directly.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Calendar className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600 text-sm">We'll announce the dates shortly. Stay tuned!</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
