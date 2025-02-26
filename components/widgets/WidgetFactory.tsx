'use client'

import { UserWidget } from '@/lib/api'
import { CovidWidget } from './CovidWidget'
import { CryptoWidget } from './CryptoWidget'
import { WorldBankWidget } from './WorldBankWidget'

interface WidgetFactoryProps {
  widget: UserWidget
}

export const WidgetFactory = ({ widget }: WidgetFactoryProps) => {
  // Return different widget components based on api_source
  switch (widget.api_source) {
    case 'disease':
      return <CovidWidget widget={widget} />
    
    case 'crypto':
      return <CryptoWidget widget={widget} />
    
    case 'worldbank':
      return <WorldBankWidget widget={widget} />
    
    default:
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
            {widget.name}
          </h3>
          <p className="text-red-500">
            Unknown widget type: {widget.api_source}
          </p>
        </div>
      )
  }
}