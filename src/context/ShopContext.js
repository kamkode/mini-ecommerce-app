import React, { createContext, useReducer, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
const initialState = {
  cartItems: [],
  wishlistItems: [],
  cartTotal: 0,
};

// Create context
export const ShopContext = createContext();

// Shop reducer
const shopReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.cartItems.findIndex(
        item => item.id === action.payload.id
      );

      let updatedItems;

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = state.cartItems.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        });
      } else {
        // Add new item
        updatedItems = [
          ...state.cartItems,
          {
            ...action.payload,
            quantity: 1,
          },
        ];
      }

      const newTotal = calculateTotal(updatedItems);

      return {
        ...state,
        cartItems: updatedItems,
        cartTotal: newTotal,
      };
    }

    case 'REMOVE_FROM_CART': {
      const updatedItems = state.cartItems.filter(
        item => item.id !== action.payload.id
      );
      const newTotal = calculateTotal(updatedItems);

      return {
        ...state,
        cartItems: updatedItems,
        cartTotal: newTotal,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const updatedItems = state.cartItems.filter(item => item.id !== id);
        const newTotal = calculateTotal(updatedItems);
        
        return {
          ...state,
          cartItems: updatedItems,
          cartTotal: newTotal,
        };
      }
      
      const updatedItems = state.cartItems.map(item => {
        if (item.id === id) {
          return {
            ...item,
            quantity,
          };
        }
        return item;
      });
      
      const newTotal = calculateTotal(updatedItems);
      
      return {
        ...state,
        cartItems: updatedItems,
        cartTotal: newTotal,
      };
    }

    case 'ADD_TO_WISHLIST': {
      // Check if item is already in wishlist
      const existingItem = state.wishlistItems.find(
        item => item.id === action.payload.id
      );
      
      // If already in wishlist, don't add it again
      if (existingItem) {
        return state;
      }
      
      return {
        ...state,
        wishlistItems: [...state.wishlistItems, action.payload],
      };
    }

    case 'REMOVE_FROM_WISHLIST': {
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter(
          item => item.id !== action.payload.id
        ),
      };
    }

    case 'LOAD_SHOP_DATA':
      return {
        ...state,
        cartItems: action.payload.cartItems || [],
        wishlistItems: action.payload.wishlistItems || [],
        cartTotal: action.payload.cartTotal || 0,
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
        cartTotal: 0,
      };

    default:
      return state;
  }
};

// Helper function to calculate total
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Provider component
export const ShopProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  // Load data from AsyncStorage on initial render
  useEffect(() => {
    const loadShopData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('shopData');
        if (savedData) {
          dispatch({
            type: 'LOAD_SHOP_DATA',
            payload: JSON.parse(savedData),
          });
        }
      } catch (error) {
        console.error('Failed to load shop data from storage', error);
      }
    };

    loadShopData();
  }, []);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveShopData = async () => {
      try {
        await AsyncStorage.setItem('shopData', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save shop data to storage', error);
      }
    };

    saveShopData();
  }, [state]);

  // Add item to cart
  const addToCart = (product) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: product,
    });
  };

  // Remove item from cart
  const removeFromCart = (product) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: product,
    });
  };

  // Update item quantity
  const updateQuantity = (id, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, quantity },
    });
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Add item to wishlist
  const addToWishlist = (product) => {
    dispatch({
      type: 'ADD_TO_WISHLIST',
      payload: product,
    });
  };

  // Remove item from wishlist
  const removeFromWishlist = (product) => {
    dispatch({
      type: 'REMOVE_FROM_WISHLIST',
      payload: product,
    });
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return state.wishlistItems.some(item => item.id === productId);
  };

  return (
    <ShopContext.Provider
      value={{
        cart: state.cartItems,
        wishlist: state.wishlistItems,
        total: state.cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}>
      {children}
    </ShopContext.Provider>
  );
};

// Custom hook to use shop context
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
