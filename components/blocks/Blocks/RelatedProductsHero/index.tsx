'use client'
import React, { useEffect, useRef, useState } from 'react'




import classes from './index.module.scss'
import { Product } from '../../../types/product-type'
import { Gutter } from '../../gutter/gutter'
import Card from '../../Card/card'
import { Slide, SliderButton, SliderContext, SliderProgress, SliderProvider, SliderTrack, useSlider } from '@faceless-ui/slider'
import Icon from '@/components/utils/icon.util'
import { useScrollInfo } from '@faceless-ui/scroll-info'
import { set } from 'react-hook-form'
import Link from 'next/link'
import { useFilter } from '@/providers/Filter'

export type RelatedProductsProps = {
  blockType: 'relatedProducts'
  blockName: string
  introContent?: any
  docs?: (string | any)[]
  relationTo: 'products'
  categories?
}



export const RelatedProductsHero: React.FC<RelatedProductsProps> = props => {
  const { docs, relationTo, categories } = props;
  const [index, setIndex] = useState(0);
  const [showPrevButton, setShowPrevButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(docs.length > 3);
  const { scrollRatio, slides, slidesToShow, sliderTrackRef } = useSlider();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const{categoryFilters, setCategoryFilters, setSort}= useFilter()

  // Show or hide Prev/Next buttons based on current slide index
 

  useEffect(() => {
    console.log('docs', docs)
    if(docs.length > 0){
    const showPrevButton = currentSlideIndex > 0;
    const showNextButton = docs && docs.length > 3;
    setShowPrevButton(showPrevButton);
    setShowNextButton(showNextButton);}
  }, [currentSlideIndex, docs]);

  const handleSlideChange = (incomingIndex) => {
    setCurrentSlideIndex(incomingIndex);
  };

  const handleScroll=(e)=>{
    const scrollRatio = e.target.scrollLeft / (e.target.scrollWidth - e.target.clientWidth) * 100
    if(scrollRatio > 0){
      setShowPrevButton(true)
    } else if(scrollRatio <= 0){
      setShowPrevButton(false)
    }
    if(scrollRatio < 93.6){
      setShowNextButton(true)
    } else if(scrollRatio >= 93.6){
      setShowNextButton(false)
    }
  }

  const handleAll = () =>{
    const allCategoryIds = categories?.map(category => category.id);
    setCategoryFilters(allCategoryIds)
    setSort('-createdAt')
  }
  

  return (
    <div className={classes.relatedProducts}>
      <Gutter className={classes.relatedProducts_gutter}>
        <div className={classes.title_wrapper}>
        <h3 className={classes.title}>Related Products</h3>
        <Link href="/products" className={classes.link} onClick={handleAll}>Show All</Link>
        </div>
        <SliderProvider slidesToShow={3} onSlide={handleSlideChange} >
          {showPrevButton && (
            <SliderButton direction="prev" className={classes.slider_button_prev}>
              <Icon icon={['fas', 'chevron-left']} />
            </SliderButton>
          )}

          <SliderTrack className={classes.slider_track} onScroll={handleScroll}>
          {docs?.map((doc, index) => (
              typeof doc === 'object' && 
              <Slide index={index} key={doc.id} className={classes.slide}>
                <Card relationTo={relationTo} doc={doc} showCategories />
              </Slide>
            ))}
          <SliderProgress/>
          </SliderTrack>
          {showNextButton && (
            <SliderButton direction="next" className={classes.slider_button_next}>
              <Icon icon={['fas', 'chevron-right']} />
            </SliderButton>
          )}
        </SliderProvider>
      </Gutter>
    </div>
  );
};