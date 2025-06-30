import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  FileText, 
  Upload, 
  Calendar, 
  TrendingUp,
  Plus,
  Award
} from 'lucide-react'

interface Certificate {
  id: string
  title: string
  created_at: string
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertificates()
  }, [user])

  const fetchCertificates = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('id, title, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setCertificates(data || [])
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      name: 'Total Certificates',
      value: certificates.length,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      name: 'This Month',
      value: certificates.filter(cert => 
        new Date(cert.created_at).getMonth() === new Date().getMonth()
      ).length,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      name: 'Growth',
      value: '+12%',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your certificates and track your achievements
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Certificates */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Certificates
            </h2>
            <Link
              to="/certificates"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : certificates.length > 0 ? (
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {cert.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(cert.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No certificates yet
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload First Certificate
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>

          <div className="space-y-4">
            <Link
              to="/upload"
              className="flex items-center space-x-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
            >
              <div className="p-3 bg-blue-600 rounded-xl group-hover:bg-blue-700 transition-colors">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Upload Certificate
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Add a new certificate to your vault
                </p>
              </div>
            </Link>

            <Link
              to="/certificates"
              className="flex items-center space-x-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
            >
              <div className="p-3 bg-green-600 rounded-xl group-hover:bg-green-700 transition-colors">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  View Certificates
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Browse and manage your certificates
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}