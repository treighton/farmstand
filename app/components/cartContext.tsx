import { createContext, useContext, useReducer, ReactNode } from 'react';

enum ActionType {
    ADD = "ADD",
    REMOVE = "REMOVE",
}

export type Item = {
    id: string
    title: string
    price: number
}

export type Action = { type: string, payload?: Item }
export type Dispatch = (action: Action) => void
export type State = { items: Item[] | any[] }
export type CartProviderProps = {children: ReactNode}

const CartContext = createContext<{ state:State; dispatch:Dispatch } | undefined>(undefined)

const cartReducer = (state: State, action: Action) => {
    switch (action.type) {
        case ActionType.ADD: {
            return {
                items: [...state.items, action.payload]
            }
        }
        case ActionType.REMOVE: {
            const newState = state.items.filter(item => item.id !== action.payload?.id)
            return {
                items: [...newState]
            }
        }
        default: {
          throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

const CartProvider = ( { children }:CartProviderProps ) => {

    const [state, dispatch] = useReducer(cartReducer, {
        items: []
    })

    const value = {
        state,
        dispatch
    }
    
    return(
        <CartContext.Provider value={value} >
            {children}
        </CartContext.Provider>
    )
}

const useCart = () => {
    const context = useContext(CartContext)
    if (context === undefined) {
      throw new Error('useCount must be used within a CartProvider')
    }
    return context
}
 
export { CartProvider, useCart }