'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { FiX, FiPlus, FiAlertCircle } from 'react-icons/fi'
import { getAvailableWidgets, addWidgetToUser, Widget } from '@/lib/api'
import { useDashboard } from '@/context/DashboardContext'

interface AddWidgetModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddWidgetModal = ({ isOpen, onClose }: AddWidgetModalProps) => {
  const { refreshWidgets } = useDashboard()
  const [availableWidgets, setAvailableWidgets] = useState<Widget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingWidgetId, setAddingWidgetId] = useState<number | null>(null)
  
  // Fetch available widgets when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableWidgets()
    }
  }, [isOpen])
  
  const fetchAvailableWidgets = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await getAvailableWidgets()
      if (response.success) {
        setAvailableWidgets(response.widgets)
      } else {
        setError('Failed to load available widgets')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading widgets')
      console.error('Error fetching available widgets:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleAddWidget = async (widgetId: number) => {
    setAddingWidgetId(widgetId)
    
    try {
      await addWidgetToUser(widgetId)
      await refreshWidgets()
      onClose()
    } catch (err: any) {
      console.error('Error adding widget:', err)
      setError(err.response?.data?.message || 'Failed to add widget')
    } finally {
      setAddingWidgetId(null)
    }
  }
  
  // Group widgets by API source
  const groupedWidgets = availableWidgets.reduce((acc, widget) => {
    const source = widget.api_source
    if (!acc[source]) {
      acc[source] = []
    }
    acc[source].push(widget)
    return acc
  }, {} as Record<string, Widget[]>)
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-gray-900 dark:text-white"
                  >
                    Add Widget to Dashboard
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={onClose}
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md flex items-center">
                    <FiAlertCircle className="mr-2" size={18} />
                    {error}
                  </div>
                )}
                
                {loading ? (
                  <div className="py-8 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedWidgets).map(([source, widgets]) => (
                      <div key={source} className="space-y-3">
                        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 capitalize">
                          {source.replace(/([A-Z])/g, ' $1').trim()} Widgets
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {widgets.map(widget => (
                            <div 
                              key={widget.id}
                              className="border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                                    {widget.name}
                                  </h5>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {widget.description || 'No description available'}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleAddWidget(widget.id)}
                                  disabled={addingWidgetId === widget.id}
                                  className="ml-4 p-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/50 disabled:opacity-50"
                                >
                                  {addingWidgetId === widget.id ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent" />
                                  ) : (
                                    <FiPlus size={18} />
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}