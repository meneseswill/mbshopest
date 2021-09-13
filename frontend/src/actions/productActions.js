import axios from 'axios'
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
} from '../Constants/productConstants'

export const listProduct = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST })
    const { data: res } = await axios.get('/api/v1/products')

    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: res.data })
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data.error
          : error.message,
    })
  }
}

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST })
    const { data: res } = await axios.get(`/api/v1/products/${id}`)

    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: res.data })
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data.error
          : error.message,
    })
  }
}

export const createProduct = (product) => async (dispatch, getState) => {
  const formData = new FormData()

  formData.append('name', product.name)
  formData.append('price', product.price)
  formData.append('image', product.image)
  formData.append('brand', product.brand)
  formData.append('category', product.category)
  formData.append('countInStock', product.countInStock)
  formData.append('description', product.description)

  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data: res } = await axios.post(
      `/api/v1/products/`,
      formData,
      config
    )

    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: res.data })
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data.error
          : error.message,
    })
  }
}

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DELETE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/v1/products/${id}`, config)

    dispatch({ type: PRODUCT_DELETE_SUCCESS })
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data.error
          : error.message,
    })
  }
}

export const updateProduct = (product) => async (dispatch, getState) => {
  const formData1 = new FormData()

  formData1.append('name', product.name)
  formData1.append('price', product.price)
  if (typeof product.image === 'object') {
    formData1.append('image', product.image)
  }
  formData1.append('brand', product.brand)
  formData1.append('category', product.category)
  formData1.append('countInStock', product.countInStock)
  formData1.append('description', product.description)

  try {
    dispatch({ type: PRODUCT_UPDATE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data: res } = await axios.put(
      `/api/v1/products/${product._id}`,
      formData1,
      config
    )

    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: res.data })
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data.error
          : error.message,
    })
  }
}
