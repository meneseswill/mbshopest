import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET } from '../Constants/orderConstants'

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id

  const [sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }

    const addPaypalScript = async () => {
      const { data: clientId } = await axios.get('/api/v1/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }

      document.body.appendChild(script)
    }

    if (!order || successPay || orderId !== order._id) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPaypalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [userInfo, dispatch, orderId, history, order, successPay])

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)

    // dispatch
    dispatch(payOrder(orderId, paymentResult))
  }
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>error</Message>
  ) : (
    <>
      <Row>
        <Col md={8}>
          <h4>ORDEN {order._id}</h4>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>ENVÍO</h2>
              <p>
                <strong>Nombre:</strong>
                {order.user.name}
              </p>
              <p>
                <strong>Correo:</strong>
                {order.user.email}
              </p>
              <p>
                <strong>Dirección:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode}{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Entregada el {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Sin entregar</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Método de pago</h2>
              <p>
                <strong>Método: </strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Pagada el {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Sin pagar</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>ITEMS ORDENADOS</h2>
              {order.orderItems.length === 0 ? (
                <Message>Su carrito está vacío</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            fluid
                            rounded
                            alt={item.name}
                          ></Image>
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>RESUMEN DEL PEDIDO</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.subtotal}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Envío</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Impuesto</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
