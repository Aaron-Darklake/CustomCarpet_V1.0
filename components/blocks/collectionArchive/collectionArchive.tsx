'use client'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import classes from './CollectionArchive.module.scss';
import mockProducts from '../../../content/index/products.json'

// Replace these with your actual imports

import { Pagination } from '../Pagination';
import { Product } from '../../../components/types/product-type';
import Card from '../Card/card';
import { PageRange } from '../PageRange';
import { ArchiveBlockProps } from '../Blocks/ArchiveBlock/type';
import { useFilter } from '../../../providers/Filter';
import qs from 'qs';
import dataClient from '@/components/config/data-server-client';

// Mock data for products




type Result = {
  totalDocs: number
  docs: any[]
  page: number
  totalPages: number
  hasPrevPage: boolean
  hasNextPage: boolean
  nextPage: number
  prevPage: number
}
  
  export type Props = {
    className?: string
    relationTo?: 'products'
    populateBy?: 'collection' | 'selection'
    showPageRange?: boolean
    onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
    limit?: number
    populatedDocs?: ArchiveBlockProps['populatedDocs']
    populatedDocsTotal?: ArchiveBlockProps['populatedDocsTotal']
    categories?: ArchiveBlockProps['categories']
  }

export const CollectionArchive: React.FC<Props> = props => {
  const { categoryFilters, sort } = useFilter()

  const {
    className,
    relationTo,
    showPageRange,
    onResultChange,
    limit = 10,
    populatedDocs,
    populatedDocsTotal,
  } = props
  
  const [results, setResults] = useState<Result>()


  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasHydrated = useRef(false)
  const [page, setPage] = useState(1)
  const [products, setProducts]=useState([])

  useEffect(() => {
    setPage(1);
  }, [categoryFilters]);

  useEffect(() => {
    const fetchdata=async()=>{
      const {data: fetchedProducts} = await dataClient.models.Product.list()
      console.log("fetchedProducts:", fetchedProducts);
      setProducts(fetchedProducts)
      let filteredProducts = fetchedProducts;

    // Filter by categories
    if (categoryFilters && categoryFilters.length > 0) {
      console.log('filters', categoryFilters)
      filteredProducts = filteredProducts.filter(product =>
        product.categories.some(category => categoryFilters.includes(category)
        )
      );
    }

    // Apply sorting
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortDirection = sort.startsWith('-') ? 'desc' : 'asc';
    filteredProducts.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
      setResults({
        totalDocs: filteredProducts.length,
        docs: filteredProducts.slice(0, limit), // First page of products
        page: 1,
        totalPages: Math.ceil(filteredProducts.length / limit),
        hasPrevPage: false,
        hasNextPage: filteredProducts.length > limit,
        nextPage: 2,
        prevPage: null,
      });
    }
    fetchdata()
  },[])
 
  const scrollToRef = useCallback(() => {
    const { current } = scrollRef
    if (current) {
       current.scrollIntoView({
         behavior: 'smooth',
       })
    }
  }, [])

  useEffect(() => {
    if (!isLoading && typeof results?.page !== 'undefined') {
       scrollToRef()
    }
  }, [isLoading, scrollToRef, results])

  // Effect for fetching data based on filters and sort
  useEffect(() => {
    console.log("Initial State:", results);
    console.log("Props:", { categoryFilters, sort, limit, page });
    const timer = setTimeout(() => {
      if (hasHydrated.current) {
        setIsLoading(true);
      }
    }, 500);
  
    const searchQuery = qs.stringify({
      sort,
      where: {
        ...(categoryFilters && categoryFilters?.length > 0
          ? {
              categories: {
                in:
                  typeof categoryFilters === 'string'
                    ? [categoryFilters]
                    : categoryFilters.map((cat: string) => cat).join(','),
              },
            }
          : {}),
      },
      limit,
      page,
      depth: 1,
    }, { encode: false });
    console.log("Search Query:", searchQuery);

    const parsedQuery = qs.parse(searchQuery, { ignoreQueryPrefix: true });

    // Extract sort, limit, and page parameters with type assertion
  const queryPage = parseInt(parsedQuery.page as string) || 1;
  const queryLimit = parseInt(parsedQuery.limit as string) || 10;
  const querySortField = typeof parsedQuery.sort === 'string' ? parsedQuery.sort : 'createdAt';
  const querySortDirection = querySortField.startsWith('-') ? 'desc' : 'asc';
  const querySortedField = querySortField.replace('-', '');
  
    const makeRequest = async () => {
      try {
        // Simulating the fetch request with mock data
        // Filter and sort mockProducts based on searchQuery
        let filteredProducts = products;
  
        // Example filter by categories
        if (categoryFilters && categoryFilters.length > 0) {
          filteredProducts = products.filter(product =>
            product.categories.some(category => 
              typeof category === 'string' && categoryFilters.includes(category)
            )
          );
        } else if (categoryFilters && categoryFilters.length === 0){
          filteredProducts = []
        }
        
        
        console.log("Filtered Products:", filteredProducts);

         // Sorting
         filteredProducts.sort((a, b) => {
          const aValue = a[querySortedField as keyof typeof a];
          const bValue = b[querySortedField as keyof typeof b];
        
          // Handling undefined values in ascending order
          if (querySortDirection === 'asc') {
            if (aValue === undefined) return 1; // move undefined aValue to the end
            if (bValue === undefined) return -1; // move undefined bValue to the end
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
          } else { // Handling undefined values in descending order
            if (aValue === undefined) return -1; // move undefined aValue to the beginning
            if (bValue === undefined) return 1; // move undefined bValue to the beginning
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
          }
        });
        
        
        

  /// Pagination logic
  const startIndex = (queryPage - 1) * queryLimit;
  const selectedProducts = filteredProducts.slice(startIndex, startIndex + queryLimit);

        

  
       
        
  
        // Set results
        setResults({
          totalDocs: filteredProducts.length,
          docs: selectedProducts,
          page: page,
          totalPages: Math.ceil(filteredProducts.length / limit),
          hasPrevPage: page > 1,
          hasNextPage: page < Math.ceil(filteredProducts.length / limit),
          nextPage: page + 1,
          prevPage: page - 1,
        });

        console.log("Pagination Info:", {
          totalDocs: filteredProducts.length,
          page,
          totalPages: Math.ceil(filteredProducts.length / limit),
        });
  
        setIsLoading(false);
        if (typeof onResultChange === 'function') {
          onResultChange({
            totalDocs: filteredProducts.length,
            docs: selectedProducts,
            page: filteredProducts.length < limit ? 1 : page,
            totalPages: Math.ceil(filteredProducts.length / limit),
            hasPrevPage: page > 1,
            hasNextPage: page < Math.ceil(filteredProducts.length / limit),
            nextPage: page + 1,
            prevPage: page - 1,
          });
        }
      } catch (err) {
        console.warn(err);
        setIsLoading(false);
        setError(`Unable to load "${relationTo} archive" data at this time.`);
      }
    };
  
    makeRequest();
  
    return () => {
      clearTimeout(timer);
    };
  }, [page, categoryFilters, relationTo, onResultChange, sort, limit]);
  

  return (
    
    <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
      <div ref={scrollRef} className={classes.scrollRef} />
       <Fragment>
       {showPageRange !== false && (
       <div className={classes.pageRange}>
       <PageRange
         totalDocs={results?.totalDocs}
         currentPage={results?.page}
         collection={relationTo}
         limit={limit}
       />
     </div>
      )}

        <div className={classes.grid}>
          {results?.docs?.map((result, index) => {
            return <Card key={index} relationTo="products" doc={result} showCategories />
          })}
        </div>

      {results?.totalPages > 1 && (
          <Pagination
            className={classes.pagination}
            page={results?.page}
            totalPages={results?.totalPages}
            onClick={setPage}
          />
        )}
      </Fragment>
    </div>
  );
};

export default CollectionArchive;
 