'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  productId: string
  variantId?: string
  productName: string
  price: number // in cents
  quantity: number
  image?: string
  weight?: number // in pounds
  dimensions?: {
    length: number // in inches
    width: number  // in inches
    height: number // in inches
  }
  min_purchase_quantity?: number
  max_purchase_quantity?: number | null
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  totalPrice: number
  addItem: (item: CartItem) => Promise<void>
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => { success: boolean; message?: string }
  clearCart: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Error loading cart:', e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const addItem = async (newItem: CartItem) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        item => item.productId === newItem.productId && item.variantId === newItem.variantId
      )

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...currentItems]
        const existingItem = updatedItems[existingItemIndex]
        const newQuantity = existingItem.quantity + (newItem.quantity || 1)
        
        // Check max quantity limit
        const maxQty = existingItem.max_purchase_quantity || newItem.max_purchase_quantity
        if (maxQty && newQuantity > maxQty) {
          // Don't update, quantity would exceed limit
          // Could show a toast notification here
          return currentItems
        }
        
        updatedItems[existingItemIndex].quantity = newQuantity
        // Keep the original image if it exists
        if (!updatedItems[existingItemIndex].image && newItem.image) {
          updatedItems[existingItemIndex].image = newItem.image
        }
        return updatedItems
      } else {
        // Add new item with image
        return [...currentItems, newItem]
      }
    })

    // Open cart dropdown to show item was added
    setIsOpen(true)
    setTimeout(() => setIsOpen(false), 3000)
  }

  const removeItem = (productId: string, variantId?: string) => {
    setItems(currentItems =>
      currentItems.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      )
    )
  }

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    const item = items.find(i => i.productId === productId && i.variantId === variantId)
    
    if (!item) {
      return { success: false, message: 'Item not found in cart' }
    }
    
    // Handle min/max validation (0 defaults to 1)
    const minQty = item.min_purchase_quantity && item.min_purchase_quantity > 0 ? item.min_purchase_quantity : 1
    const maxQty = item.max_purchase_quantity || null
    
    if (quantity < minQty) {
      return { 
        success: false, 
        message: `Minimum quantity for this item is ${minQty}` 
      }
    }
    
    if (maxQty && quantity > maxQty) {
      if (maxQty === 1) {
        return { 
          success: false, 
          message: '🎯 Limited Edition: Only 1 per customer to ensure everyone gets a chance!' 
        }
      }
      return { 
        success: false, 
        message: `🎯 Maximum ${maxQty} per customer for this exclusive item` 
      }
    }
    
    if (quantity === 0) {
      removeItem(productId, variantId)
      return { success: true }
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    )
    
    return { success: true }
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem('cart')
  }

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isOpen,
      setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}