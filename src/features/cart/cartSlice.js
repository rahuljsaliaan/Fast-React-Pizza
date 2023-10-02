import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      // action.payload = pizzaID
      // state.cart = state.cart.filter((item) => item.pizzaID !== action.payload);

      // using splice method
      const indexToRemove = state.cart.findIndex(
        (item) => item.pizzaID === action.payload,
      );
      if (indexToRemove !== -1) state.cart.splice(indexToRemove, 1);
    },
    increaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaID === action.payload);

      // The reason why updating the single item updates the array is because the find method returns a reference to the object. So mutating the object will reflect inside the cart array as well
      item.quantity++;
      item.totalPrice = item.unitPrice * item.quantity;
    },
    decreaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaID === action.payload);
      item.quantity--;
      item.totalPrice = item.unitPrice * item.quantity;
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export const getCart = (state) => state.cart.cart;

export const getTotalCartQuantity = (state) =>
  state.cart.cart.length
    ? state.cart.cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

export const getTotalCartPrice = (state) =>
  state.cart.cart.length
    ? state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0)
    : 0;

export const getCurrentQuantityByID = (id) => (state) =>
  state.cart.cart.find((item) => item.pizzaID === id)?.quantity ?? 0;

export default cartSlice.reducer;
