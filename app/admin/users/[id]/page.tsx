import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { User as UserIcon, Mail, Calendar, Briefcase, Globe, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';

// Define the ApplicationStatus type based on the Prisma schema
type ApplicationStatus = 'SUBMITTED' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED';

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  // Fetch the user with related data
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      startups: {
        select: {
          id: true,
          name: true,
          stage: true,
          industry: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      applications: {
        select: {
          id: true,
          status: true,
          job: {
            select: {
              id: true,
              title: true,
              startup: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          appliedAt: true,
        },
        orderBy: { appliedAt: 'desc' },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* User header */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and activity</p>
          </div>
          <Link
            href={`/admin/users/${user.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit User
          </Link>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                Full name
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <a href={`mailto:${user.email}`} className="text-indigo-600 hover:text-indigo-900">
                  {user.email}
                </a>
                {user.emailVerified && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                )}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                Member since
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </dd>
            </div>
            {(user.website || user.linkedin || user.github) && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Social Profiles</dt>
                <dd className="mt-1 text-sm text-gray-900 space-x-4">
                  {user.website && (
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
                      <Globe className="h-4 w-4 mr-1" /> Website
                    </a>
                  )}
                  {user.linkedin && (
                    <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
                      <Linkedin className="h-4 w-4 mr-1" /> LinkedIn
                    </a>
                  )}
                  {user.github && (
                    <a href={user.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
                      <Github className="h-4 w-4 mr-1" /> GitHub
                    </a>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Startups section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Startups</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Startups created by this user</p>
        </div>
        {user.startups.length > 0 ? (
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {user.startups.map((startup) => (
                <li key={startup.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-indigo-600 truncate">
                        <Link href={`/admin/startups/${startup.id}`}>
                          {startup.name}
                        </Link>
                      </h4>
                      <p className="text-sm text-gray-500">
                        {startup.industry} • {startup.stage}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="text-xs text-gray-500">
                        Created on {new Date(startup.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="px-4 py-5 sm:px-6">
            <p className="text-sm text-gray-500">No startups found</p>
          </div>
        )}
      </div>

      {/* Applications section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Job Applications</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Jobs applied to by this user</p>
        </div>
        {user.applications.length > 0 ? (
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {user.applications.map((application) => (
                <li key={application.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-indigo-600">
                        <Link href={`/admin/jobs/${application.job.id}`}>
                          {application.job.title}
                        </Link>
                      </h4>
                      <p className="text-sm text-gray-500">
                        at {application.job.startup.name}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        application.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                        application.status === 'REVIEWED' ? 'bg-yellow-100 text-yellow-800' :
                        application.status === 'SHORTLISTED' ? 'bg-purple-100 text-purple-800' :
                        application.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {application.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied on {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="px-4 py-5 sm:px-6">
            <p className="text-sm text-gray-500">No job applications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
