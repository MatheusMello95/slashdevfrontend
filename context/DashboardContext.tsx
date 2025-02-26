'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getUserWidgets, updateWidgetPositions, UserWidget, getWidgetData } from '@/lib/api'

interface WidgetDataState {
  [widgetId: number]: {
    data: any
    loading: boolean
    error: string | null
    lastUpdated: Date | null
  }
}

interface DashboardContextType {
  widgets: UserWidget[]
  widgetData: WidgetDataState
  loading: boolean
  error: string | null
  refreshWidgets: () => Promise<void>
  fetchWidgetData: (widgetId: number) => Promise<void>
  updateWidgetOrder: (orderedWidgets: UserWidget[]) => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [widgets, setWidgets] = useState<UserWidget[]>([])
  const [widgetData, setWidgetData] = useState<WidgetDataState>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshWidgets = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await getUserWidgets()
      if (response.success) {
        setWidgets(response.widgets)
      } else {
        setError('Failed to load widgets')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading dashboard')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchWidgetData = async (widgetId: number) => {
    // Update widget data loading state
    setWidgetData(prev => ({
      ...prev,
      [widgetId]: {
        data: prev[widgetId]?.data || null,
        loading: true,
        error: null,
        lastUpdated: prev[widgetId]?.lastUpdated || null
      }
    }))
    
    try {
      const response = await getWidgetData(widgetId)
      
      if (response.success) {
        setWidgetData(prev => ({
          ...prev,
          [widgetId]: {
            data: response.data,
            loading: false,
            error: null,
            lastUpdated: new Date()
          }
        }))
      } else {
        setWidgetData(prev => ({
          ...prev,
          [widgetId]: {
            data: prev[widgetId]?.data || null,
            loading: false,
            error: 'Failed to load widget data',
            lastUpdated: prev[widgetId]?.lastUpdated || null
          }
        }))
      }
    } catch (err: any) {
      console.error(`Error fetching widget ${widgetId} data:`, err)
      setWidgetData(prev => ({
        ...prev,
        [widgetId]: {
          data: prev[widgetId]?.data || null,
          loading: false,
          error: err.response?.data?.message || 'Error loading widget data',
          lastUpdated: prev[widgetId]?.lastUpdated || null
        }
      }))
    }
  }

  const updateWidgetOrder = async (orderedWidgets: UserWidget[]) => {
    // Optimistically update the UI
    setWidgets(orderedWidgets)
    
    // Prepare positions for API
    const positions = orderedWidgets.map((widget, index) => ({
      widget_id: widget.id,
      position: index
    }))
    
    try {
      await updateWidgetPositions(positions)
    } catch (err: any) {
      console.error('Error updating widget positions:', err)
      // If error, refresh widgets to get current state
      refreshWidgets()
    }
  }

  // Load widgets on mount
  useEffect(() => {
    refreshWidgets()
  }, [])

  // Load data for each widget
  useEffect(() => {
    if (widgets.length > 0 && !loading) {
      widgets.forEach(widget => {
        // Only fetch if we don't have data or data is older than 5 minutes
        const widgetState = widgetData[widget.id]
        const shouldFetch = !widgetState || 
          !widgetState.lastUpdated || 
          (new Date().getTime() - widgetState.lastUpdated.getTime() > 5 * 60 * 1000)
        
        if (shouldFetch && widget.is_visible) {
          fetchWidgetData(widget.id)
        }
      })
    }
  }, [widgets, loading])

  return (
    <DashboardContext.Provider value={{
      widgets,
      widgetData,
      loading,
      error,
      refreshWidgets,
      fetchWidgetData,
      updateWidgetOrder
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  
  return context
}