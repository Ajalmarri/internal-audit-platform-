import React from 'react'
import { Badge } from './badge'
import { Loader2, CheckCircle, AlertCircle, Save } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'unsaved'

interface SaveModeIndicatorProps {
  status: SaveStatus
  lastSaved?: string
  className?: string
  showLastSaved?: boolean
}

export function SaveModeIndicator({ 
  status, 
  lastSaved, 
  className,
  showLastSaved = true 
}: SaveModeIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Loader2,
          text: 'Saving...',
          variant: 'secondary' as const,
          className: 'animate-pulse'
        }
      case 'saved':
        return {
          icon: CheckCircle,
          text: 'Saved',
          variant: 'default' as const,
          className: 'text-green-600'
        }
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Save Failed',
          variant: 'destructive' as const,
          className: 'text-red-600'
        }
      case 'unsaved':
        return {
          icon: Save,
          text: 'Unsaved Changes',
          variant: 'outline' as const,
          className: 'text-orange-600'
        }
      default:
        return {
          icon: Save,
          text: 'Ready',
          variant: 'outline' as const,
          className: 'text-muted-foreground'
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge variant={config.variant} className={cn('flex items-center gap-1', config.className)}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
      
      {showLastSaved && lastSaved && status === 'saved' && (
        <span className="text-xs text-muted-foreground">
          Last saved: {new Date(lastSaved).toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}

// Hook for managing save state
export function useSaveMode() {
  const [status, setStatus] = React.useState<SaveStatus>('idle')
  const [lastSaved, setLastSaved] = React.useState<string | undefined>()

  const save = React.useCallback(async (saveFunction: () => Promise<any>) => {
    setStatus('saving')
    try {
      await saveFunction()
      setStatus('saved')
      setLastSaved(new Date().toISOString())
      
      // Reset to idle after a delay
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      setStatus('error')
      console.error('Save failed:', error)
      
      // Reset to unsaved after a delay
      setTimeout(() => setStatus('unsaved'), 5000)
    }
  }, [])

  const markUnsaved = React.useCallback(() => {
    if (status !== 'saving') {
      setStatus('unsaved')
    }
  }, [status])

  const reset = React.useCallback(() => {
    setStatus('idle')
    setLastSaved(undefined)
  }, [])

  return {
    status,
    lastSaved,
    save,
    markUnsaved,
    reset
  }
}

























