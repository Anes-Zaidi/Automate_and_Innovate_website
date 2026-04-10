import React from 'react'
import { LucideAlertCircle } from 'lucide-react'

interface FieldProps {
  label: string
  error?: string
  children: React.ReactNode
  required?: boolean
  className?: string
}

export function Field({
  label,
  error,
  children,
  required,
  className = '',
}: FieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider">
          {label}
          {required && <span className="text-orange-500 ml-1">*</span>}
        </label>
      </div>
      
      <div className="relative group">
        {children}
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none transition-opacity duration-200 opacity-100">
            <LucideAlertCircle size={16} />
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="w-1 h-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  )
}

export const getInputClass = (hasError?: boolean, variant: 'default' | 'orange' = 'default') => {
  const baseClasses = "w-full px-4 py-3 bg-[#111316] border rounded-lg text-white placeholder-gray-600 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:border-white/20"
  
  const stateClasses = hasError
    ? "border-red-500/50 focus:border-red-400 bg-red-500/5 ring-1 ring-red-500/20"
    : variant === 'orange'
      ? "border-white/10 focus:border-orange-500/60"
      : "border-white/10 focus:border-white/20"

  return `${baseClasses} ${stateClasses}`
}
