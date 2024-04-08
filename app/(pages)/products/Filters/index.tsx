'use client'

import React, { useEffect, useRef, useState } from 'react'

import classes from './index.module.scss'
import { Category } from '../../../../components/types/product-type'
import { Checkbox } from '../../../../components/blocks/checkbox/checkbox'
import { RadioButton } from '../../../../components/blocks/radioButton/radio'
import { useFilter } from '../../../../providers/Filter'
import Icon from '@/components/utils/icon.util'
import {ChevronDownIcon} from '@heroicons/react/24/outline'

const Filters = ({ categories }: { categories: Category[] }) => {
  const { categoryFilters, sort, setCategoryFilters, setSort } = useFilter()
  const [showCategories, setShowCategories] = useState(false);
  const [showSorting, setShowSorting] = useState(false);

  

  console.log("categories:",categoryFilters)
  console.log("sort:", sort)
  console.log('fetchedCategories', categories)
  
  const toggleCategoriesDropdown = () => setShowCategories(!showCategories);
  const toggleSortingDropdown = () => setShowSorting(!showSorting);


  useEffect(() => {
    // Set the initial checkbox states based on the local storage
    const storedFilters = localStorage.getItem('categoryFilters');
    console.log('storedfilters', storedFilters)
    if (storedFilters.length > 0) {
      const filters = JSON.parse(storedFilters);
      setCategoryFilters(filters);
    } else if (storedFilters.length === 0 || !storedFilters){
        const allCategoryIds = categories.map(category => category.id);
        setCategoryFilters(allCategoryIds)
        setSort('-createdAt')
    }
  }, []);

  const cardRef = useRef<HTMLButtonElement>(null);

  /*useEffect(() => {
    const card = cardRef.current;
    console.log('card', card)
    const handleMouseMove = (e: MouseEvent) => {
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const angle = Math.atan2(-x, y);
        card.style.setProperty("--rotation", `${angle}rad`);
        console.log('angle', angle)
      }
    };

    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);
  */

  const handleCategories = (categoryId: string) => {
    if (categoryFilters.includes(categoryId)) {
      const updatedCategories = categoryFilters.filter(id => id !== categoryId)

      setCategoryFilters(updatedCategories)
    } else {
      setCategoryFilters([...categoryFilters, categoryId])
    }
  }

  const handleSort = (value: string) => setSort(value)

  const sortValues = [{label:'Latest',value:'-createdAt'}, {label:'Oldest',value:'createdAt'}]

  return (
    <div className={classes.filters}>
      <div className={classes.filterWrapper}>
      <div className={classes.categoryWrapper}>
        <button type='button'  ref={cardRef} onClick={toggleCategoriesDropdown} className={classes.title}>
          
          <div className={`${classes.title_div} ${showCategories ? classes.title_div_rotate: ''}`}>
            <p>Product Categories </p>
            <ChevronDownIcon />
          </div>
        </button>
        <div className={`${classes.categories} ${showCategories ? classes.categories_show: ''}`}>
        {categories.map(category => {
    return (
      <Checkbox
        key={category.id}
        label={category.title}
        value={category.id}
        isSelected={categoryFilters.includes(category.id)}
        onClickHandler={() => handleCategories(category.id)}
      />
    );
  })}
        </div>
        </div>
        <div className={classes.hr} />
        <div className={classes.sortWrapper}>
        <button type='button' onClick={toggleSortingDropdown} className={classes.title}>
          <div className={`${classes.title_div} ${showSorting ? classes.title_div_rotate: ''}`}>
            <p>Sort By </p>
            <ChevronDownIcon />
          </div>
          </button>
        <div className={`${classes.categories} ${showSorting ? classes.categories_show: ''}`}>
        {sortValues.map(sortItem => {
    return (
      <RadioButton
      key={sortItem.label}
      label={sortItem.label}
      value={sortItem.value}
      isSelected={sort === sortItem?.value}
      onRadioChange={handleSort}
      groupName="sort"
    />
    );
  })}
        </div>
        </div>
      </div>
    </div>
  )
}

export default Filters