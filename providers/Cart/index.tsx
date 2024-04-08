'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'


import { useAuth } from '../Auth'
import { CartItem, cartReducer } from './reducer'
import dataClient from '@/components/config/data-server-client'
import { fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth'
import dataClientPrivate from '@/components/config/data-server-client-private'

export type CartContext = {
  cart
  addItemToCart: (item: CartItem) => void
  deleteItemFromCart: (product) => void
  updateShippingCosts: (shippingCosts: number) => void
  cartIsEmpty: boolean | undefined
  clearCart: () => void
  isProductInCart: (product) => boolean
  cartTotal: {
    formatted: string
    raw: number
  }
  subtotal: {
    formatted: string;
    raw: number;
  };
  additionalCosts: {
    taxes?: number;
    shipping: number;
  };
  hasInitializedCart: boolean
}

const Context = createContext({} as CartContext)

export const useCart = () => useContext(Context)

const arrayHasItems = array => Array.isArray(array) && array.length > 0

// Step 1: Check local storage for a cart
// Step 2: If there is a cart, fetch the products and hydrate the cart
// Step 3: Authenticate the user
// Step 4: If the user is authenticated, merge the user's cart with the local cart
// Step 4B: Sync the cart to Payload and clear local storage
// Step 5: If the user is logged out, sync the cart to local storage only

export const CartProvider = props => {
  // const { setTimedNotification } = useNotifications();
  const { children } = props
  const { user, userAttributes, status: authStatus } = useAuth()

  const [cart, dispatchCart] = useReducer(cartReducer, {
    items: [],
  })

  const [total, setTotal] = useState<{
    formatted: string
    raw: number
  }>({
    formatted: '0.00',
    raw: 0,
  })

  // Add additional state for subtotal and additional costs
const [subtotal, setSubtotal] = useState<{
  formatted: string,
  raw: number
}>({
  formatted: '0.00',
  raw: 0
});

const [additionalCosts, setAdditionalCosts] = useState<{
  taxes?: number,
  shipping: number
}>({
  taxes: 0, // Example tax amount (can be dynamic)
  shipping: 0 // Example shipping cost (can be dynamic)
});

  const hasInitialized = useRef(false)
  const [hasInitializedCart, setHasInitialized] = useState(false)

  

  // Check local storage for a cart
  // If there is a cart, fetch the products and hydrate the cart
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true

      const syncCartFromLocalStorage = async () => {
        const localCart = localStorage.getItem('cart')

        const parsedCart = JSON.parse(localCart || '{}')

        if (parsedCart?.items && parsedCart?.items?.length > 0) {
          const initialCart = await Promise.all(
            parsedCart.items.map(async ({ product, quantity }) => {
              try {
                const { data: productData } = await dataClient.models.Product.get({ id: product});
                return { product: productData, quantity };
              } catch (error) {
                console.error('Error fetching product data:', error);
                return null;
              }
            }),
          )

          dispatchCart({
            type: 'SET_CART',
            payload: {
              items: initialCart,
            },
          })
        } else {
          dispatchCart({
            type: 'SET_CART',
            payload: {
              items: [],
            },
          })
        }
      }

      syncCartFromLocalStorage()
    }
  }, [])

  // authenticate the user and if logged in, merge the user's cart with local state
  // only do this after we have initialized the cart to ensure we don't lose any items
  useEffect( () => {
    if (!hasInitialized.current) return

    if (authStatus === 'loggedIn') {
      // merge the user's cart with the local state upon logging in
      const fetchCart = async () => {
        const userAttributes = await fetchUserAttributes();
        if(!userAttributes?.['custom:cartId']){
          const {data: newCart} = await dataClientPrivate.models.Cart.create(null);
          console.log('New Cart created:', newCart)

              const {data: attributes} = await updateUserAttributes({
                userAttributes: {
                  'custom:cartId': newCart.id,
                }
              });
             console.log('user attributes:', attributes)
            }
        const {data: fetchresult} = await dataClientPrivate.models.Cart.get({id: userAttributes?.['custom:cartId']})
        const {data: fetchresultItems} = await fetchresult.items()

      
    
      dispatchCart({
        type: 'MERGE_CART',
        payload: fetchresultItems,
      })
    }

   fetchCart()
  }
  if (authStatus === 'loggedOut') {
    // clear the cart from local state after logging out
    dispatchCart({
      type: 'CLEAR_CART',
    })
  }

  }, [user, authStatus])

  // every time the cart changes, determine whether to save to local storage or Payload based on authentication status
  // upon logging in, merge and sync the existing local cart to Payload
  useEffect(() => {
    // wait until we have attempted authentication (the user is either an object or `null`)
    if (!hasInitialized.current || user === undefined) return

    // ensure that cart items are fully populated, filter out any items that are not
    // this will prevent discontinued products from appearing in the cart
    console.log('before flattendCart', cart)
    const flattenedCart = {
      ...cart,
      items: cart?.items
        ?.map(item => {
          if (!item?.product || typeof item?.product !== 'string') {
            return {
              ...item,
              // flatten relationship to product
              product: item?.product?.id,
              quantity: typeof item?.quantity === 'number' ? item?.quantity : 0,
            }
          }

          return {
            ...item,
            // flatten relationship to product
            product: item?.product,
            quantity: typeof item?.quantity === 'number' ? item?.quantity : 0,
          }
        })
        .filter(Boolean) as CartItem[],
    }

    if (user && authStatus === 'loggedIn') {
      try {
        const syncCartToPayload = async () => {
          const userAttributes = await fetchUserAttributes();
          const {data: cartData, errors: err} = await dataClientPrivate.models.Cart.get({id: userAttributes?.['custom:cartId']})
          const {data: cartDataItems} = await cartData.items()
          const cartItemsPromises = flattenedCart.items.map(async item => {
            
            const dbItem = cartDataItems.find(cartDbitem =>  cartDbitem.product === (typeof  item.product === 'string' ?  item.product :  item.product?.id));
            if (dbItem) {
              // Update existing item
              if (dbItem.quantity !== item.quantity) {
              const{data: updatedItem} =  await dataClientPrivate.models.CartItem.update({
                  id: JSON.parse(JSON.stringify(dbItem.id)),
                  quantity: JSON.parse(JSON.stringify(item.quantity)),
                });
                console.log('updatedItem', updatedItem)
              }
            } else {
          const{data: newItem} = await dataClientPrivate.models.CartItem.create({
            product: JSON.parse(JSON.stringify(item.product)),
            quantity: JSON.parse(JSON.stringify(item.quantity)),
            cart: JSON.parse(JSON.stringify(cartData)),
            // Include other necessary fields for CartItem
          });
          console.log('newItem', newItem)
        }
        });


          // Removing items not present in flattened cart
          const itemsToRemove = cartDataItems.filter(dbItem =>
            !flattenedCart.items.some(flattenedItem => flattenedItem.product === dbItem.product)
          );

          const removePromises = itemsToRemove.map(dbItem =>
            dataClientPrivate.models.CartItem.delete({ id: dbItem.id })
          );

          // Execute all promises
          await Promise.all([...cartItemsPromises, ...removePromises]);



        localStorage.setItem('cart', '[]')
        // Assuming you have the cartId in the user object


     
       
        }

        syncCartToPayload()
      } catch (e) {
        console.error('Error while syncing cart to Payload.') // eslint-disable-line no-console
      }
    } else {
      localStorage.setItem('cart', JSON.stringify(flattenedCart))
    }

    setHasInitialized(true)
  }, [user, cart])

  const isProductInCart = useCallback(
    (incomingProduct): boolean => {
      let isInCart = false
      const { items: itemsInCart } = cart || {}
      if (Array.isArray(itemsInCart) && itemsInCart.length > 0) {
        isInCart = Boolean(
          itemsInCart.find(({ product }) =>
            typeof product === 'string'
              ? product === incomingProduct
              : product?.id === incomingProduct,
          ), // eslint-disable-line function-paren-newline
        )
      }
      return isInCart
    },
    [cart],
  )

  // this method can be used to add new items AND update existing ones
  const addItemToCart = useCallback(incomingItem => {
    dispatchCart({
      type: 'ADD_ITEM',
      payload: incomingItem,
    })
  }, [])

  const deleteItemFromCart = useCallback((incomingProduct) => {
    dispatchCart({
      type: 'DELETE_ITEM',
      payload: incomingProduct,
    })
  }, [])

  const clearCart = useCallback(() => {
    dispatchCart({
      type: 'CLEAR_CART',
    })
  }, [])

  useEffect(() => {
    if (!hasInitialized.current) return;

    const parsePriceData = (dataString) => {
      const dataObj:any = {};
      const keyValuePairs = dataString.split(', ').map(pair => pair.split('='));
      keyValuePairs.forEach(([key, value]) => {
        dataObj[key] = parseFloat(value);
      });
      return dataObj;
    };
  
    const fetchProductData = async () => {
      return Promise.all(cart?.items.map(async (item) => {
        if (typeof item.product === 'string') {
          const { data: productData } = await dataClient.models.Product.get({ id: item.product});
          return { ...item, productData };
        }
        return item;
      }));
    };
  
    fetchProductData().then((updatedCartItems) => {
      const newSubtotal = updatedCartItems.reduce((acc, item) => {
        const productData = item.productData || item.product;
        const priceJSON = typeof productData === 'object' ? productData.priceJSON : null;
        if (priceJSON) {
          const data = parsePriceData(priceJSON);
          const quantity = typeof item?.quantity === 'number' ? item?.quantity : 0;
          const priceValue = data.unit_amount * quantity;
          return acc + priceValue;
        }
        return acc;
      }, 0);
  
      //const totalTaxes = newSubtotal * 0.19; // Example 19% tax
      console.log('newSubtotal', newSubtotal)
      console.log('additionalCosts.shipping', additionalCosts.shipping)
  
      const newTotal = newSubtotal +  additionalCosts.shipping;
  
      console.log('newTotal', newTotal)
      setSubtotal({
        formatted: (newSubtotal / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }),
        raw: newSubtotal
      });
  
      setTotal({
        formatted: (newTotal / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }),
        raw: newTotal
      });
  
      setAdditionalCosts({
        shipping: additionalCosts.shipping
      });
    });
  }, [cart, hasInitialized.current, additionalCosts.shipping]);
  
  
  const updateShippingCosts = useCallback((shippingCost: number) => {
    setAdditionalCosts(prevCosts => ({
      ...prevCosts,
      shipping: shippingCost
    }));
  }, []);

  return (
    <Context.Provider
      value={{
        cart,
        addItemToCart,
        deleteItemFromCart,
        updateShippingCosts,
        cartIsEmpty: hasInitializedCart && !arrayHasItems(cart?.items),
        clearCart,
        isProductInCart,
        cartTotal: total,
        hasInitializedCart,
        subtotal,
        additionalCosts,
      }}
    >
      {children && children}
    </Context.Provider>
  )
}
