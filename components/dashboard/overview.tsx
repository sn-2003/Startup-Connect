"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api-client"
import type { StartupWithRelations, JobWithStartup, ApplicationWithJobDetails, ResumeWithRelations } from "@/lib/types"
import {
  Building2,
  Briefcase,
  FileText,
  Users,
  TrendingUp,
  MapPin,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  ArrowRight,
  Target,
  Zap,
  Activity,
  Award,
  Rocket,
} from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation';

interface OverviewProps {
  onTabChange: (tab: string) => void
}

export default function Overview({ onTabChange }: OverviewProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [startups, setStartups] = useState<StartupWithRelations[]>([])
  const [jobs, setJobs] = useState<JobWithStartup[]>([])
  const [applications, setApplications] = useState<ApplicationWithJobDetails[]>([])
  const [resume, setResume] = useState<ResumeWithRelations | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOverviewData = async () => {
      if (!user) return

      try {
        const [startupsRes, jobsRes, applicationsRes, resumeRes, profileRes] = await Promise.all([
          apiClient.getMyStartups(),
          apiClient.getJobs(),
          apiClient.getMyApplications(),
          apiClient.getMyResume(),
          apiClient.getUserProfile(),
        ])

        if (startupsRes.success && startupsRes.data) {
          setStartups(startupsRes.data)
        }

        if (jobsRes.success && jobsRes.data) {
          setJobs(jobsRes.data.slice(0, 5))
        }

        if (applicationsRes.success && applicationsRes.data) {
          setApplications(applicationsRes.data)
        }

        if (resumeRes.success && resumeRes.data) {
          setResume(resumeRes.data)
        }
        if (profileRes.success && profileRes.data) {
          setProfile(profileRes.data)
        }
      } catch (error) {
        console.error("Error loading overview data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadOverviewData()
    const interval = setInterval(
      () => {
        loadOverviewData()
      },
      2 * 60 * 1000,
    )
    return () => clearInterval(interval)
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800"
      case "REVIEWED":
        return "bg-yellow-100 text-yellow-800"
      case "SHORTLISTED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const profileScore = (() => {
    let score = 0
    if (resume && resume.pdfUrl) score += 40
    if (profile?.linkedin) score += 15
    if (profile?.github) score += 15
    if (profile?.website) score += 10
    if (profile?.name && profile?.email) score += 10
    if (applications.length > 0 || startups.length > 0) score += 10
    return Math.round(score)
  })()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-800 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold mb-2">
                Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},{" "}
                {user?.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-blue-100 text-lg mb-4">Ready to accelerate your startup journey today?</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                  <Target className="h-4 w-4" />
                  <span>Profile {profileScore}% complete</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                  <Activity className="h-4 w-4" />
                  <span>{applications.length} applications this month</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => router.push("/jobs")}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Browse Jobs
              </Button>
              <Button
                onClick={() => router.push("/my-startups")}
                variant="outline"
                className="bg-transparent border-white/30 text-white hover:bg-white/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Startup
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "My Startups",
            value: startups.length,
            icon: Building2,
            color: "text-purple-600",
            bg: "bg-purple-50",
            change: `${startups.length === 1 ? 'startup registered' : 'startups registered'}`,
          },
          {
            label: "Applications",
            value: applications.length,
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50",
            change: "job applications submitted",
          },
          {
            label: "Resume Status",
            value: resume && resume.pdfUrl ? 'Complete' : 'Incomplete',
            icon: Users,
            color: "text-green-600",
            bg: "bg-green-50",
            change: resume && resume.pdfUrl ? 'Resume is ready' : 'Complete your resume',
          },
          {
            label: "Profile Score",
            value: `${profileScore}%`,
            icon: TrendingUp,
            color: "text-orange-600",
            bg: "bg-orange-50",
            change: "profile completion",
          },
          {
            label: "Coins Earned",
            value: coinBalance.toLocaleString(),
            icon: Coins,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
            change: "total coins earned",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Quick Actions
              </CardTitle>
              <CardDescription>Get things done faster</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Browse Jobs",
                    icon: Briefcase,
                    action: () => router.push("/jobs"),
                    color: "bg-blue-50 hover:bg-blue-100 text-blue-700",
                  },
                  {
                    label: "Update Resume",
                    icon: FileText,
                    action: () => router.push("/resume"),
                    color: "bg-green-50 hover:bg-green-100 text-green-700",
                  },
                  {
                    label: "Find Investors",
                    icon: Users,
                    action: () => router.push("/investors"),
                    color: "bg-purple-50 hover:bg-purple-100 text-purple-700",
                  },
                  {
                    label: "Learn",
                    icon: Award,
                    action: () => router.push("/resources"),
                    color: "bg-orange-50 hover:bg-orange-100 text-orange-700",
                  },
                ].map((action, index) => (
                  <Button
                    key={action.label}
                    variant="ghost"
                    onClick={action.action}
                    className={`h-20 flex flex-col items-center justify-center space-y-2 ${action.color} transition-all duration-200`}
                  >
                    <action.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Track your application progress</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => router.push("/my-applications")}>
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No applications yet</h3>
                  <p className="text-slate-600 mb-4">Start applying to jobs to see them here</p>
                  <Button onClick={() => router.push("/jobs")}>Browse Jobs</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 3).map((application, index) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{application.job?.title || "Job Title"}</h4>
                        <p className="text-sm text-slate-600">{application.job?.startup?.name || "Company"}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusColor(application.status)} variant="secondary">
                            {application.status.toLowerCase()}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {new Date(application.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500">
                          {application.status === "SUBMITTED" && <Clock className="h-4 w-4 text-blue-500" />}
                          {application.status === "REVIEWED" && <Eye className="h-4 w-4 text-yellow-500" />}
                          {application.status === "SHORTLISTED" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {applications.length > 3 && (
                    <Button variant="ghost" className="w-full" onClick={() => router.push("/my-applications")}>
                      View all {applications.length} applications
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-500" />
                Profile Strength
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-900">{profileScore}%</span>
                  <Badge variant={profileScore >= 80 ? "default" : "secondary"}>
                    {profileScore >= 80 ? "Strong" : "Needs Work"}
                  </Badge>
                </div>
                <Progress value={profileScore} className="h-2" />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Resume uploaded</span>
                    {resume?.pdfUrl ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">LinkedIn connected</span>
                    {profile?.linkedin ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Active applications</span>
                    {applications.length > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                    )}
                  </div>
                </div>
                <Button onClick={() => router.push("/profile")} className="w-full mt-4" size="sm">
                  Complete Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trending Jobs */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Hot Jobs
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => router.push("/jobs")}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.slice(0, 3).map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer"
                    onClick={() => router.push("/jobs")}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-slate-900 text-sm line-clamp-1">{job.title}</h4>
                      <Badge variant="outline" className="text-xs ml-2">
                        {job.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{job.startup?.name || job.startupName}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>
                          {typeof job.applications === "number" ? job.applications : job.applications?.length || 0}{" "}
                          applicants
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Startups */}
          {startups.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Rocket className="h-5 w-5 mr-2 text-purple-500" />
                    My Startups
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => router.push("/my-startups")}>
                    Manage
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {startups.slice(0, 2).map((startup, index) => (
                    <div key={startup.id} className="p-3 rounded-lg border border-slate-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 text-sm">{startup.name}</h4>
                          <p className="text-xs text-slate-600">{startup.industry}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {startup.stage}
                        </Badge>
                        <span className="text-xs text-slate-500">{startup.jobs?.length || 0} jobs</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}