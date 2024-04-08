export interface Page {
    id: string;
    title: string;
    publishedOn?: string | null;
    hero: {
      type: 'none' | 'highImpact' | 'mediumImpact' | 'lowImpact' | 'customHero';
      richText: {
        [k: string]: unknown;
      }[];
      links?:
        | {
            link: {
              type?: ('reference' | 'custom') | null;
              newTab?: boolean | null;
              reference?: {
                relationTo: 'pages';
                value: string | Page;
              } | null;
              url?: string | null;
              label: string;
              icon?: string | Media | null;
              appearance?: ('default' | 'primary' | 'secondary') | null;
            };
            id?: string | null;
          }[]
        | null;
      media?: string | Media | null;
    };
    layout: (
      | {
          invertBackground?: boolean | null;
          richText: {
            [k: string]: unknown;
          }[];
          links?:
            | {
                link: {
                  type?: ('reference' | 'custom') | null;
                  newTab?: boolean | null;
                  reference?: {
                    relationTo: 'pages';
                    value: string | Page;
                  } | null;
                  url?: string | null;
                  label: string;
                  icon?: string | Media | null;
                  appearance?: ('primary' | 'secondary') | null;
                };
                id?: string | null;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'cta';
        }
      | {
          invertBackground?: boolean | null;
          columns?:
            | {
                size?: ('oneThird' | 'half' | 'twoThirds' | 'full') | null;
                richText: {
                  [k: string]: unknown;
                }[];
                enableLink?: boolean | null;
                link?: {
                  type?: ('reference' | 'custom') | null;
                  newTab?: boolean | null;
                  reference?: {
                    relationTo: 'pages';
                    value: string | Page;
                  } | null;
                  url?: string | null;
                  label: string;
                  icon?: string | Media | null;
                  appearance?: ('default' | 'primary' | 'secondary') | null;
                };
                id?: string | null;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'content';
        }
      | {
          invertBackground?: boolean | null;
          position?: ('default' | 'fullscreen') | null;
          media: string | Media;
          id?: string | null;
          blockName?: string | null;
          blockType: 'mediaBlock';
        }
      | {
          introContent: {
            [k: string]: unknown;
          }[];
          populateBy?: ('collection' | 'selection') | null;
          relationTo?: 'products' | null;
          categories?: (string | Category)[] | null;
          limit?: number | null;
          selectedDocs?:
            | {
                relationTo: 'products';
                value: string | Product;
              }[]
            | null;
          populatedDocs?:
            | {
                relationTo: 'products';
                value: string | Product;
              }[]
            | null;
          populatedDocsTotal?: number | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'archive';
        }
    )[];
    slug?: string | null;
    meta?: {
      title?: string | null;
      description?: string | null;
      image?: string | Media | null;
    };
    updatedAt: string;
    createdAt: string;
    _status?: ('draft' | 'published') | null;
  }

  export interface Settings {
    id: string;
    productsPage?: (string | null) | Page;
    updatedAt?: string | null;
    createdAt?: string | null;
  }

  export interface Media {
    id: string;
    alt: string;
    caption?:
      | {
          [k: string]: unknown;
        }[]
      | null;
    updatedAt: string;
    createdAt: string;
    url?: string | null;
    filename?: string | null;
    mimeType?: string | null;
    filesize?: number | null;
    width?: number | null;
    height?: number | null;
  }
  export interface Category {
    id: string;
    title: string;
    media?: string | Media | null;
    parent?: (string | null) | Category;
    breadcrumbs?:
      | {
          doc?: (string | null) | Category;
          url?: string | null;
          label?: string | null;
          id?: string | null;
        }[]
      | null;
    updatedAt: string;
    createdAt: string;
  }



export interface Product {
    id: string;
    title: string;
    publishedOn?: string | null;
    layout?:
      | (
          | {
              invertBackground?: boolean | null;
              richText: {
                [k: string]: unknown;
              }[];
              links?:
                | {
                    link: {
                      type?: ('reference' | 'custom') | null;
                      newTab?: boolean | null;
                      reference?: {
                        relationTo: 'pages';
                        value: string | Page;
                      } | null;
                      url?: string | null;
                      label: string;
                      icon?: string | Media | null;
                      appearance?: ('primary' | 'secondary') | null;
                    };
                    id?: string | null;
                  }[]
                | null;
              id?: string | null;
              blockName?: string | null;
              blockType: 'cta';
            }
          | {
              invertBackground?: boolean | null;
              columns?:
                | {
                    size?: ('oneThird' | 'half' | 'twoThirds' | 'full') | null;
                    richText: {
                      [k: string]: unknown;
                    }[];
                    enableLink?: boolean | null;
                    link?: {
                      type?: ('reference' | 'custom') | null;
                      newTab?: boolean | null;
                      reference?: {
                        relationTo: 'pages';
                        value: string | Page;
                      } | null;
                      url?: string | null;
                      label: string;
                      icon?: string | Media | null;
                      appearance?: ('default' | 'primary' | 'secondary') | null;
                    };
                    id?: string | null;
                  }[]
                | null;
              id?: string | null;
              blockName?: string | null;
              blockType: 'content';
            }
          | {
              invertBackground?: boolean | null;
              position?: ('default' | 'fullscreen') | null;
              media: string | Media;
              id?: string | null;
              blockName?: string | null;
              blockType: 'mediaBlock';
            }
          | {
              introContent: {
                [k: string]: unknown;
              }[];
              populateBy?: ('collection' | 'selection') | null;
              relationTo?: 'products' | null;
              categories?: (string | Category)[] | null;
              limit?: number | null;
              selectedDocs?:
                | {
                    relationTo: 'products';
                    value: string | Product;
                  }[]
                | null;
              populatedDocs?:
                | {
                    relationTo: 'products';
                    value: string | Product;
                  }[]
                | null;
              populatedDocsTotal?: number | null;
              id?: string | null;
              blockName?: string | null;
              blockType: 'archive';
            }
        )[]
      | null;
    stripeProductID?: string | null;
    priceJSON?: string | null;
    enablePaywall?: boolean | null;
    paywall?:
      | (
          | {
              invertBackground?: boolean | null;
              richText: {
                [k: string]: unknown;
              }[];
              links?:
                | {
                    link: {
                      type?: ('reference' | 'custom') | null;
                      newTab?: boolean | null;
                      reference?: {
                        relationTo: 'pages';
                        value: string | Page;
                      } | null;
                      url?: string | null;
                      label: string;
                      icon?: string | Media | null;
                      appearance?: ('primary' | 'secondary') | null;
                    };
                    id?: string | null;
                  }[]
                | null;
              id?: string | null;
              blockName?: string | null;
              blockType: 'cta';
            }
          | {
              invertBackground?: boolean | null;
              columns?:
                | {
                    size?: ('oneThird' | 'half' | 'twoThirds' | 'full') | null;
                    richText: {
                      [k: string]: unknown;
                    }[];
                    enableLink?: boolean | null;
                    link?: {
                      type?: ('reference' | 'custom') | null;
                      newTab?: boolean | null;
                      reference?: {
                        relationTo: 'pages';
                        value: string | Page;
                      } | null;
                      url?: string | null;
                      label: string;
                      icon?: string | Media | null;
                      appearance?: ('default' | 'primary' | 'secondary') | null;
                    };
                    id?: string | null;
                  }[]
                | null;
              id?: string | null;
              blockName?: string | null;
              blockType: 'content';
            }
          | {
              invertBackground?: boolean | null;
              position?: ('default' | 'fullscreen') | null;
              media: string | Media;
              id?: string | null;
              blockName?: string | null;
              blockType: 'mediaBlock';
            }
          | {
              introContent: {
                [k: string]: unknown;
              }[];
              populateBy?: ('collection' | 'selection') | null;
              relationTo?: 'products' | null;
              categories?: (string | Category)[] | null;
              limit?: number | null;
              selectedDocs?:
                | {
                    relationTo: 'products';
                    value: string | Product;
                  }[]
                | null;
              populatedDocs?:
                | {
                    relationTo: 'products';
                    value: string | Product;
                  }[]
                | null;
              populatedDocsTotal?: number | null;
              id?: string | null;
              blockName?: string | null;
              blockType: 'archive';
            }
        )[]
      | null;
    categories?: (string | Category)[] | null;
    relatedProducts?: (string | Product)[] | null;
    slug?: string | null;
    skipSync?: boolean | null;
    meta?: {
      title?: string | null;
      description?: string | null;
      image?: string | Media | null;
    };
    updatedAt: string;
    createdAt: string;
    _status?: ('draft' | 'published') | null;
  }

  export interface User {
    id: string;
    name?: string | null;
    roles?: ('admin' | 'customer')[] | null;
    purchases?: (string | Product)[] | null;
    stripeCustomerID?: string | null;
    cart?: {
      items?: CartItems;
    };
    skipSync?: boolean | null;
    updatedAt: string;
    createdAt: string;
    email: string;
    resetPasswordToken?: string | null;
    resetPasswordExpiration?: string | null;
    salt?: string | null;
    hash?: string | null;
    loginAttempts?: number | null;
    lockUntil?: string | null;
    password: string | null;
  }

  export type CartItems =
  | {
      product?: (string | null) | any;
      quantity?: number | null;
      id?: string | null;
    }[]
  ;

  export interface Cart {
    items?: CartItem[];
  }
  
  export interface CartItem {
    product?: (string | null) | Product; // Assuming this is the Product ID
    quantity?: number | null;
  }