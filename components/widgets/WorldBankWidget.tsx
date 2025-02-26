'use client'

import { UserWidget } from '@/lib/api'
import { BaseWidget } from './BaseWidget'
import { useDashboard } from '@/context/DashboardContext'
import { useState } from 'react'
import { updateUserWidget } from '@/lib/api'
import { FiAlertCircle } from 'react-icons/fi'

interface WorldBankWidgetProps {
  widget: UserWidget
}

export const WorldBankWidget = ({ widget }: WorldBankWidgetProps) => {
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
    if (widget.endpoint === 'indicators' || widget.endpoint === 'country') {
      return (
        <div className="space-y-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Country Code
            </label>
            <input
              id="country"
              type="text"
              value={settings.country || 'US'}
              onChange={(e) => setSettings({ ...settings, country: e.target.value })}
              className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="US, GB, DE, etc."
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Use ISO 2-letter country code (US, GB, DE, etc.)
            </p>
          </div>
          
          {widget.endpoint === 'indicators' && (
            <div>
              <label htmlFor="indicator" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Indicator Code
              </label>
              <input
                id="indicator"
                type="text"
                value={settings.indicator || 'NY.GDP.MKTP.CD'}
                onChange={(e) => setSettings({ ...settings, indicator: e.target.value })}
                className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="NY.GDP.MKTP.CD"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                World Bank indicator code (e.g., NY.GDP.MKTP.CD for GDP)
              </p>
            </div>
          )}
          
          {widget.endpoint === 'indicators' && (
            <div>
              <label htmlFor="years" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Years of Data
              </label>
              <input
                id="years"
                type="number"
                min="1"
                max="20"
                value={settings.years || 5}
                onChange={(e) => setSettings({ ...settings, years: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}
          
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
    
    if (widget.endpoint === 'country') {
      const countryData = widgetState.data?.[1]?.[0] || {}
      
      return (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {countryData.name}
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-400">Region</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {countryData.region?.value || 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-400">Income Level</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {countryData.incomeLevel?.value || 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-400">Capital City</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {countryData.capitalCity || 'N/A'}
            </p>
          </div>
          
          {widgetState.lastUpdated && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {widgetState.lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
      )
    }
    
    if (widget.endpoint === 'indicators') {
      // Structure varies by indicator, so we'll use a generic display
      const indicatorData = widgetState.data?.[1] || []
      const indicatorName = indicatorData[0]?.indicator?.value || 'Data'
      
      return (
        <div className="space-y-3">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white">
            {indicatorName}
          </h3>
          
          <div className="space-y-2">
            {indicatorData.map((item:any, index:number) => (
              <div 
                key={index} 
                className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
              >
                <span className="text-gray-700 dark:text-gray-300">{item.date}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.value ? item.value.toLocaleString() : 'N/A'}
                </span>
              </div>
            ))}
          </div>
          
          {widgetState.lastUpdated && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {widgetState.lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
      )
    }
    
    // Default response
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