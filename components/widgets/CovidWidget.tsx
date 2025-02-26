'use client'

import { UserWidget } from '@/lib/api'
import { BaseWidget } from './BaseWidget'
import { useDashboard } from '@/context/DashboardContext'
import { useState } from 'react'
import { updateUserWidget } from '@/lib/api'
import { FiAlertCircle } from 'react-icons/fi'

interface CovidWidgetProps {
  widget: UserWidget
}

export const CovidWidget = ({ widget }: CovidWidgetProps) => {
  const { widgetData, fetchWidgetData } = useDashboard()
  const [isEditing, setIsEditing] = useState(false)
  const [settings, setSettings] = useState(widget.settings || {})
  const [isSaving, setIsSaving] = useState(false)
  
  const widgetState = widgetData[widget.id] || {
    data: null,
    loading: true,
    error: null,
    lastUpdated: null
  }
  
  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      await updateUserWidget(widget.id, { settings })
      setIsEditing(false)
      fetchWidgetData(widget.id)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsSaving(false)
    }
  }
  
  const renderSettings = () => {
    if (widget.endpoint === 'country') {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Country
            </label>
            <input
              id="country"
              type="text"
              value={settings.country || ''}
              onChange={(e) => setSettings({ ...settings, country: e.target.value })}
              className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="USA, UK, Canada, etc."
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )
    }
    
    if (widget.endpoint === 'historical') {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="days" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Days of History
            </label>
            <input
              id="days"
              type="number"
              min="1"
              max="365"
              value={settings.days || 30}
              onChange={(e) => setSettings({ ...settings, days: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )
    }
    
    return (
      <p className="text-gray-600 dark:text-gray-400">No configurable settings for this widget.</p>
    )
  }
  
  const renderWidgetContent = () => {
    if (isEditing) {
      return renderSettings()
    }
    
    if (widgetState.loading) {
      return (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
        </div>
      )
    }
    
    if (widgetState.error) {
      return (
        <div className="text-red-500 flex items-center">
          <FiAlertCircle className="mr-2" />
          {widgetState.error}
        </div>
      )
    }
    
    if (!widgetState.data) {
      return (
        <p className="text-gray-600 dark:text-gray-400">No data available</p>
      )
    }
    
    // Render widget based on endpoint
    if (widget.endpoint === 'global') {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-400">Cases</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {widgetState.data.cases?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-400">Deaths</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {widgetState.data.deaths?.toLocaleString() || 0}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-400">Recovered</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {widgetState.data.recovered?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {widgetState.data.active?.toLocaleString() || 0}
              </p>
            </div>
          </div>
          {widgetState.lastUpdated && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {widgetState.lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
      )
    }
    
    if (widget.endpoint === 'country') {
      return (
        <div className="space-y-3">
          <div className="flex items-center mb-3">
            {widgetState.data.countryInfo?.flag && (
              <img 
                src={widgetState.data.countryInfo.flag} 
                alt={`${widgetState.data.country} flag`} 
                className="w-8 h-6 mr-2 border border-gray-200 dark:border-gray-700"
              />
            )}
            <h3 className="text-lg font-semibold">{widgetState.data.country}</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-400">Cases</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {widgetState.data.cases?.toLocaleString() || 0}
              </p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-400">Deaths</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {widgetState.data.deaths?.toLocaleString() || 0}
              </p>
            </div>
          </div>
          
          {widgetState.lastUpdated && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {widgetState.lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
      )
    }
    
    // Default response for other endpoints or undefined data
    return (
      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
        <pre className="text-xs whitespace-pre-wrap">
          {JSON.stringify(widgetState.data, null, 2)}
        </pre>
      </div>
    )
  }
  
  return (
    <BaseWidget 
      widget={widget} 
      onEditSettings={() => setIsEditing(true)}
    >
      {renderWidgetContent()}
    </BaseWidget>
  )
}