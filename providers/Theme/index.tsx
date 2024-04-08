'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'


import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { Theme, ThemeContextType, themeIsValid } from './types'
import canUseDOM from '@/components/utils/canUseDOM'

const initialContext: ThemeContextType = {
  theme: defaultTheme,
  setTheme: () => defaultTheme,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(
    canUseDOM ? (document.documentElement.getAttribute('theme') as Theme) : undefined,
  )



  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (themeToSet === null) {
      localStorage.removeItem(themeLocalStorageKey)
      const implicitPreference = getImplicitPreference()
      document.documentElement.setAttribute('theme', implicitPreference || '')
      if (implicitPreference) setThemeState(implicitPreference)
    } else {
      setThemeState(themeToSet)
      localStorage.setItem(themeLocalStorageKey, themeToSet)
      document.documentElement.setAttribute('theme', themeToSet)
    }
    
    const root = document.querySelector(':root');
    if (root instanceof HTMLElement) {
      root.dataset.theme = themeToSet;
    }

    localStorage.setItem('theme', themeToSet);
    setThemeState(themeToSet)

    // Cleanup function
    return () => {
     if (root instanceof HTMLElement) {
        root.dataset.theme = themeToSet;
      }
    };
  }, [theme]);

 

  useEffect(() => {
    let themeToSet: Theme = defaultTheme
    const preference = localStorage.getItem(themeLocalStorageKey)
    console.log('preference', preference)
    if (themeIsValid(preference)) {
      themeToSet = preference
    } else {
      const implicitPreference = getImplicitPreference()

      if (implicitPreference) {
        themeToSet = implicitPreference
      }
    }

    document.documentElement.setAttribute('theme', defaultTheme)
    const root = document.querySelector(':root');
    if (root instanceof HTMLElement) {
      root.dataset.theme = themeToSet;
    }
    setThemeState(defaultTheme)
  }, [])

  useEffect(() => {
    localStorage.setItem('theme',theme)
    console.log('theme', theme)
  },[theme])

console.log('theme', theme)


  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext)