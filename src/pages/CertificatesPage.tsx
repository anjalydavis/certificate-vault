import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  FileText, 
  Calendar, 
  Download, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Plus
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

interface Certificate {
  id: string
  title: string
  description: string | null
  file_url: string
  file_name: string
  file_size: number
  created_at: string
  updated_at: string
}

export const CertificatesPage: React.FC = () => {
  const { user } = useAuth()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  useEffect(() => {
    fetchCertificates()
  }, [user])

  const fetchCertificates = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCertificates(data || [])
    } catch (error) {
      console.error('Error fetching certificates:', error)
      toast.error('Failed to load certificates')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (cert: Certificate) => {
    setEditingId(cert.id)
    setEditTitle(cert.title)
    setEditDescription(cert.description || '')
  }

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from('certificates')
        .update({
          title: editTitle,
          description: editDescription,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error

      setCertificates(prev => prev.map(cert => 
        cert.id === id 
          ? { ...cert, title: editTitle, description: editDescription }
          : cert
      ))
      
      setEditingId(null)
      toast.success('Certificate updated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update certificate')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
  }

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return

    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      // Delete from storage
      const fileName = fileUrl.split('/').pop()
      if (fileName) {
        await supabase.storage
          .from('certificates')
          .remove([`certificates/${user?.id}/${fileName}`])
      }

      setCertificates(prev => prev.filter(cert => cert.id !== id))
      toast.success('Certificate deleted successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete certificate')
    }
  }

  const filteredCertificates = certificates.filter(cert =>
    cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cert.description && cert.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const groupedCertificates = filteredCertificates.reduce((groups, cert) => {
    const date = new Date(cert.created_at)
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    
    if (!groups[monthYear]) {
      groups[monthYear] = []
    }
    groups[monthYear].push(cert)
    
    return groups
  }, {} as Record<string, Certificate[]>)

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Certificates
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} in your vault
          </p>
        </div>
        <Link
          to="/upload"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Certificate
        </Link>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search certificates..."
            className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Certificates */}
      {Object.keys(groupedCertificates).length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No certificates found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Upload your first certificate to get started'}
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Certificate
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedCertificates).map(([monthYear, certs]) => (
            <div key={monthYear}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                {monthYear}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certs.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200"
                  >
                    {editingId === cert.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSave(cert.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEdit(cert)}
                              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(cert.id, cert.file_url)}
                              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {cert.title}
                        </h3>
                        
                        {cert.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {cert.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                          <span>{new Date(cert.created_at).toLocaleDateString()}</span>
                          <span>{(cert.file_size / 1024 / 1024).toFixed(1)} MB</span>
                        </div>

                        <a
                          href={cert.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          View Certificate
                        </a>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}