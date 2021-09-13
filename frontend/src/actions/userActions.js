import axios from 'axios'
import {
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from '../Constants/cartConstants'
import { ORDER_LIST_MY_RESET } from '../Constants/orderConstants'
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_DETAILS_FAIL,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_REQUEST,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PASSWORD_REQUEST,
  USER_UPDATE_PASSWORD_SUCCESS,
  USER_UPDATE_PASSWORD_FAIL,
  USER_DETAILS_RESET,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
} from '../Constants/userConstants'

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    })

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    }

    const { data } = await axios.post(
      '/api/v1/auth/login',
      { email, password },
      config
    )

    const configWithAuthorization = {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }

    const { data: me } = await axios.get(
      '/api/v1/auth/me',
      configWithAuthorization
    )

    const userInfo = {
      token: data.token,
      name: me.data.name,
      email: me.data.email,
      role: me.data.role,
    }

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: userInfo,
    })

    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data.error
          : error.message,
    })
  }
}

export const logout = () => async (dispatch) => {
  localStorage.removeItem('userInfo')
  localStorage.removeItem('cartItems')
  localStorage.removeItem('shippingAddress')
  localStorage.removeItem('paymentMethod')
  dispatch({
    type: USER_LOGOUT,
  })
  dispatch({
    type: USER_DETAILS_RESET,
  })

  dispatch({
    type: ORDER_LIST_MY_RESET,
  })

  dispatch({
    type: USER_LIST_RESET,
  })
}

export const getUserDetails = (path) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data: me } = await axios.get(`/api/v1/auth/${path}`, config)

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: me.data,
    })
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data.error
          : error.message,
    })
  }
}

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data: me } = await axios.put(
      '/api/v1/auth/updatedetails',
      user,
      config
    )

    const userDetails = {
      token: userInfo.token,
      name: me.data.name,
      email: me.data.email,
      role: me.data.role,
    }

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: userDetails,
    })

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: userDetails,
    })

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: userDetails,
    })

    localStorage.setItem('userInfo', JSON.stringify(userDetails))
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data.error
          : error.message,
    })
  }
}

export const updateUserPassword = (currentPassword, newPassword) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: USER_UPDATE_PASSWORD_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data: accessToken } = await axios.put(
      '/api/v1/auth/updatepassword',
      { currentPassword, newPassword },
      config
    )

    const { data: me } = await axios.get('/api/v1/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    })

    const userDetails = {
      token: accessToken.token,
      name: me.data.name,
      email: me.data.email,
      role: me.data.role,
    }

    dispatch({
      type: USER_UPDATE_PASSWORD_SUCCESS,
      payload: userDetails,
    })

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: userDetails,
    })

    localStorage.setItem('userInfo', JSON.stringify(userDetails))
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PASSWORD_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data.error
          : error.message,
    })
  }
}

export const saveShippingAddress = (data) => async (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  })

  localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => async (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  })

  localStorage.setItem('paymentMethod', JSON.stringify(data))
}

export const listUser = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data: res } = await axios.get('/api/v1/auth/users', config)

    dispatch({
      type: USER_LIST_SUCCESS,
      payload: res.data,
    })
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data.error
          : error.message,
    })
  }
}

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/v1/auth/users/${id}`, config)

    dispatch({
      type: USER_DELETE_SUCCESS,
    })
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data.error
          : error.message,
    })
  }
}

export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data: res } = await axios.put(
      `/api/v1/auth/users/${user._id}`,
      user,
      config
    )

    dispatch({
      type: USER_UPDATE_SUCCESS,
    })

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: res.data
    })
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data.error
          : error.message,
    })
  }
}
