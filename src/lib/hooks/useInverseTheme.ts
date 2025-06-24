import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function useInverseTheme() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return default during SSR to avoid hydration mismatch
    return 'dark'
  }

  const currentTheme = theme === 'system' ? systemTheme : theme
  return currentTheme === 'dark' ? 'light' : 'dark'
} 