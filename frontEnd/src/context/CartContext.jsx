/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [customer, setCustomer] = useState(null)
  const [paymentType, setPaymentType] = useState('cash')

  const value = useMemo(
    () => ({
      items,
      customer,
      paymentType,
      setCustomer,
      setPaymentType,
      clearCart() {
        setItems([])
      },
      addItem(product, quantity = 1) {
        setItems((prev) => {
          const idx = prev.findIndex((it) => it.product.id === product.id)
          if (idx === -1) return [...prev, { product, quantity }]
          const next = [...prev]
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity }
          return next
        })
      },
      updateQuantity(productId, quantity) {
        setItems((prev) =>
          prev
            .map((it) =>
              it.product.id === productId ? { ...it, quantity: Math.max(1, quantity) } : it,
            )
            .filter((it) => it.quantity > 0),
        )
      },
      removeItem(productId) {
        setItems((prev) => prev.filter((it) => it.product.id !== productId))
      },
      get total() {
        return items.reduce((sum, it) => sum + Number(it.product.price ?? 0) * it.quantity, 0)
      },
    }),
    [customer, items, paymentType],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
