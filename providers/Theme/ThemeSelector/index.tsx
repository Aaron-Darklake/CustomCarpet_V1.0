'use client'

import React from 'react'


import { useTheme } from '..'
import { getImplicitPreference } from '../shared'
import { Theme, themeLocalStorageKey } from './types'

import classes from './index.module.scss'
import { Chevron } from '@/components/blocks/Chevron'
import Icon from '@/components/utils/icon.util'
import { SunIcon } from '@radix-ui/react-icons'

export const ThemeSelector: React.FC = () => {
  const selectRef = React.useRef<HTMLSelectElement>(null)
  const { setTheme, theme } = useTheme()
  const [show, setShow] = React.useState(false)

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
      if (selectRef.current) selectRef.current.value = 'auto'
    } else {
      setTheme(themeToSet)
    }
  }

  const toggleTheme = () => {
    const theme = localStorage.getItem(themeLocalStorageKey)
    switch (theme) {
      case 'light':
        setTheme('dark');
        break;
      case 'dark':
        setTheme('light');
        break;
     
    }
  };

  const buttonIcon = (currentTheme: string) => {
    const theme = localStorage.getItem(themeLocalStorageKey)
    if (theme == "light") {
      return (
       <Icon icon={['fas','moon']}/>
      );
    } else if (theme == "dark") {
      return (
        <SunIcon/>
      );
    }
  };

  React.useEffect(() => {
    const preference = localStorage.getItem(themeLocalStorageKey)
    if (selectRef.current) {
      selectRef.current.value = preference ?? 'auto'
      setShow(true)
    }
  }, [])

  return (
    <>
    <button key="themeToggle" className={classes.button} onClick={toggleTheme} data-theme={theme}>
    {buttonIcon(theme)}
  </button>
  </>
  )
}
