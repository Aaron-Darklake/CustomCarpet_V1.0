'use client'
import React, { useEffect, useMemo } from 'react'
import Link from 'next/link'

import CategoryCard from './CategoryCard'

import classes from './index.module.scss'
import { Category } from '../../../components/types/product-type';
import { useFilter } from '../../../providers/Filter';




const Categories = ({ categories }: { categories: Category[] }) => {
  const{categoryFilters, setCategoryFilters, setSort}= useFilter()
  
console.log('categories:', categories)

  useEffect(() => {
    // Only update the state if it's different from the current state
    setCategoryFilters([])
    setSort('-createdAt')
    localStorage.removeItem('categoryFilters')
    localStorage.removeItem('sort')
  }, []);

  const handleAll = () =>{
    const allCategoryIds = categories.map(category => category.id);
    setCategoryFilters(allCategoryIds)
    setSort('-createdAt')
  }

  
  

  return (
    <section className={classes.section}>
      <div className={classes.container}>
      <div className={classes.titleWrapper}>
        <h3>Shop by Categories</h3>
        <Link href="/products" className={classes.link} onClick={handleAll}>Show All</Link>
      </div>

      <div className={classes.list}>
        {categories.map(category => {
          return <CategoryCard key={category.id} category={category} />
        })}
      </div>
      </div>
    </section>
  )
}

export default Categories