import React, { Fragment } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'


import { CartPage } from './CartPage'

import classes from './index.module.scss'
import { Page, Settings } from '../../../components/types/product-type'
import { Gutter } from '../../../components/blocks/gutter/gutter'
import { Blocks } from '../../../components/sections/Blocks'
import { generateMeta } from '../../../components/utils/generateMeta'

// Force this page to be dynamic so that Next.js does not cache it
// See the note in '../[slug]/page.tsx' about this
export const dynamic = 'force-dynamic'

export default async function Cart() {
  let page: Page
page = {
  id: "65b11f7cb49cec3a4eb2de92",
  title: "Cart",
  publishedOn: "2024-01-24T14:32:28.805+00:00",
  hero: {
    type: "none",
    richText: [
      {
        type: "p",
        children: [
          {
            text: ""
          }
        ]
      }
    ],
    links: [],
    media: null
  },
  layout: [
    {
    richText: [
      {
        type: "h4",
        children: [
          {
            text: "Continue Shopping"
          }
        ]
      }
    ],
    links:[
        {
          link: {
            type: 'reference',
            reference: {
              value: {
                id: "65b11f7bb49cec3a4eb2de6c",
                title: "Products",
                publishedOn: "2024-01-24T14:32:27.287+00:00",
                "hero": {
                  type: "none",
                  richText: [
                    {
                      type: "h3",
                      children: [
                        {
                          text: "Products"
                        }
                      ]
                    }
                  ],
                  links: [],
                  media: null
                },
                layout: [
                  {
                    introContent: [
                      {
                        type: "p",
                        children: [
                          {
                            text: ""
                          }
                        ]
                      }
                    ],
                    populateBy: "collection",
                    relationTo: "products",
                    categories: [],
                    limit: 9,
                    id: "65b11f7be0a5bf17b62167a5",
                    blockName: "Archive Block",
                    blockType: "archive"
                  }
                ],
                slug: "products",
                meta: {
                  title: "Shop all products",
                  description: "Shop everything from goods and services to digital assets and gated content",
                  
                },
                createdAt: "2024-01-24T14:32:27.290+00:00",
                updatedAt: "2024-01-24T16:00:30.386+00:00",
                _status: "published",
              },
              relationTo: 'pages'
            },
            label: 'Continue Shopping',
            appearance: 'primary',
          },
          id: '65b11f7ce0a5bf17b62167ba'
        },
      ],
    id: '65b11f7ce0a5bf17b62167b8',
    blockName: 'CTA',
    blockType: 'cta',
  },
  ],
  slug: "cart",
  meta: {
    title: "Cart",
    description: "Your cart will sync to your user profile so you can continue shopping from any device.",
    
  },
  createdAt: "2024-01-24T14:32:27.290+00:00",
  updatedAt: "2024-01-24T16:00:30.386+00:00",
  _status: "published",
}

  

  if (!page) {
    return notFound()
  }

  let settings: Settings | null = null

  settings = {
    id: '',
  productsPage: {
    id: "65b11f7bb49cec3a4eb2de6c",
    title: "Products",
    publishedOn: "2024-01-24T14:32:27.287+00:00",
    "hero": {
      type: "none",
      richText: [
        {
          type: "h3",
          children: [
            {
              text: "Products"
            }
          ]
        }
      ],
      links: [],
      media: null
    },
    layout: [
      {
        introContent: [
          {
            type: "p",
            children: [
              {
                text: ""
              }
            ]
          }
        ],
        populateBy: "collection",
        relationTo: "products",
        categories: [],
        limit: 9,
        id: "65b11f7be0a5bf17b62167a5",
        blockName: "Archive Block",
        blockType: "archive"
      }
    ],
    slug: "products",
    meta: {
      title: "Shop all products",
      description: "Shop everything from goods and services to digital assets and gated content",
      
    },
    createdAt: "2024-01-24T14:32:27.290+00:00",
    updatedAt: "2024-01-24T16:00:30.386+00:00",
    _status: "published",
  }
  }

  return (
    <div className={classes.container}>
      <Gutter  className={classes.gutter}>
        <CartPage settings={settings} page={page} />
      </Gutter>
      <Blocks blocks={page.layout}  />
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  let page: Page
page = {
  id: "65b11f7cb49cec3a4eb2de92",
  title: "Cart",
  publishedOn: "2024-01-24T14:32:28.805+00:00",
  hero: {
    type: "none",
    richText: [
      {
        type: "p",
        children: [
          {
            text: ""
          }
        ]
      }
    ],
    links: [],
    media: null
  },
  layout: [
    {
    richText: [
      {
        type: "p",
        children: [
          {
            text: ""
          }
        ]
      }
    ],
    links:[
        {
          link: {
            type: 'reference',
            reference: {
              value: '65b11f7bb49cec3a4eb2de6c',
              relationTo: 'pages'
            },
            url:'',
            label: 'Continue Shopping',
            appearance: 'primary',
          },
          id: '65b11f7ce0a5bf17b62167ba'
        },
      ],
    id: '65b11f7ce0a5bf17b62167b8',
    blockName: 'CTA',
    blockType: 'cta',
  },
  ],
  slug: "cart",
  meta: {
    title: "Cart",
    description: "Your cart will sync to your user profile so you can continue shopping from any device.",
    
  },
  createdAt: "2024-01-24T14:32:27.290+00:00",
  updatedAt: "2024-01-24T16:00:30.386+00:00",
  _status: "published",
}

  return generateMeta({ doc: page })
}