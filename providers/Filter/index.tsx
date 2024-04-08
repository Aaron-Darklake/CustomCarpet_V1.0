'use client'

import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'

interface IContextType {
  categoryFilters: string[]
  setCategoryFilters: React.Dispatch<SetStateAction<string[]>>
  sort: string
  setSort: React.Dispatch<SetStateAction<string>>
}

export const INITIAL_FILTER_DATA = {
  categoryFilters: [],
  setCategoryFilters: () => [],
  sort: '',
  setSort: () => '',
}

const FilterContext = createContext<IContextType>(INITIAL_FILTER_DATA)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
   const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [sort, setSort] = useState<string>('-createdAt')

  useEffect(() => {
    // Initialize state from localStorage if available
    const storedFilters = localStorage.getItem('categoryFilters');
    if (storedFilters) {
      setCategoryFilters(JSON.parse(storedFilters));
    }

    const storedSort = localStorage.getItem('sort');
    if (storedSort) {
      setSort(storedSort);
    }
  }, []);

  useEffect(() => {
    // Sync categoryFilters to localStorage
    localStorage.setItem('categoryFilters', JSON.stringify(categoryFilters));
  }, [categoryFilters]);

  useEffect(() => {
    // Sync sort to localStorage
    localStorage.setItem('sort', sort);
  }, [sort]);

  

  return (
    <FilterContext.Provider
      value={{
        categoryFilters,
        setCategoryFilters,
        sort,
        setSort,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => useContext(FilterContext)