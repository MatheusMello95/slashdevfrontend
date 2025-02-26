'use client'

import { useState } from 'react'
import { UserWidget } from '@/lib/api'
import { FiRefreshCw, FiSettings, FiX } from 'react-icons/fi'
import { useDashboard } from '@/context/DashboardContext'
import { removeUserWidget } from '@/lib/api'

interface BaseWidgetProps {
  widget: UserWidget
  children: React.ReactNode
  onEditSettings?: () => void
}

export const BaseWidget = ({ widget, children, onEditSettings }: BaseWidgetProps) => {
  const { fetchWidgetData } = useDashboard()
  const [isRemoving, setIsRemoving] = useState(false)
  
  const handleRefresh = () => {
    fetchWidgetData(widget.id)
  }
  
  const handleRemove = async () => {
    if (window.confirm(`Are you sure you want to remove the "${widget.name}" widget?`)) {
      setIsRemoving(true)
      try {
        await removeUserWidget(widget.id)
        // Refresh widgets from parent component
        window.location.reload()
      } catch (error) {
        console.error('Error removing widget:', error)
        setIsRemoving(false)
      }
    }
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
        <h3 className="font-medium text-gray-700 dark:text-gray-300">
          {widget.name}
        </h3>
        
        <div className="flex space-x-1">
          <button 
            onClick={handleRefresh}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Refresh widget"
          >
            <FiRefreshCw size={16} />
          </button>
          
          {onEditSettings && (
            <button 
              onClick={onEditSettings}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Edit widget settings"
            >
              <FiSettings size={16} />
            </button>
          )}
          
          <button 
            onClick={handleRemove}
            disabled={isRemoving}
            className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            title="Remove widget"
          >
            <FiX size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}