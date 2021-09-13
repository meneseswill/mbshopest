import axios from 'axios'
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../Constants/cartConstants'

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data: res } = await axios.get(`/api/v1/products/${id}`)

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: res.data._id,
      name: res.data.name,
      image: res.data.image,
      price: res.data.price,
      countInStock: res.data.countInStock,
      qty,
    },
  })

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  })

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}
