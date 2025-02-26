'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardProvider, useDashboard } from '@/context/DashboardContext'
import { WidgetFactory } from '@/components/widgets/WidgetFactory'
import { AddWidgetModal } from '@/components/AddWidgetModal'
import { FiPlus, FiRefreshCw, FiGrid } from 'react-icons/fi'

// DashboardContent component to use the dashboard context
const DashboardContent = () => {
  const { widgets, loading, error, refreshWidgets } = useDashboard()
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshWidgets()
    setIsRefreshing(false)
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Dashboard</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <FiRefreshCw className={isRefreshing ? 'animate-spin' : ''} size={16} />
            <span>Refresh</span>
          </button>
          
          <button
            onClick={() => setIsAddWidgetModalOpen(true)}
            className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
          >
            <FiPlus size={16} />
            <span>Add Widget</span>
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      ) : widgets.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <FiGrid size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Your dashboard is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Start customizing your dashboard by adding widgets to display data from COVID-19, cryptocurrency, and World Bank APIs.
          </p>
          <button
            onClick={() => setIsAddWidgetModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <FiPlus size={16} className="mr-2" />
            Add Your First Widget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {widgets
            .filter(widget => widget.is_visible)
            .sort((a, b) => a.position - b.position)
            .map(widget => (
              <WidgetFactory key={widget.id} widget={widget} />
            ))}
        </div>
      )}
      
      <AddWidgetModal 
        isOpen={isAddWidgetModalOpen} 
        onClose={() => setIsAddWidgetModalOpen(false)} 
      />
    </>
  )
}

// Main Dashboard page component with context provider
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          
          <main className="flex-1 container mx-auto px-4 py-8">
            <DashboardContent />
          </main>
        </div>
      </DashboardProvider>
    </ProtectedRoute>
  )
}