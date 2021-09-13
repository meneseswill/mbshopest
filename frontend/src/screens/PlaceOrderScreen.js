import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../Constants/orderConstants'
import CheckoutSteps from '../components/CheckoutSteps'

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)

  if (!cart.shippingAddress.address) {
    history.push('/shipping')
  } else if (!cart.paymentMethod) {
    history.push('/payment')
  }

  // Calcular precios y totales
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  cart.subtotal = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )

  cart.shippingPrice = addDecimals(Number(cart.subtotal * 0.1))
  cart.taxPrice = addDecimals(Number(cart.subtotal * 0.15))
  cart.totalPrice = (
    Number(cart.subtotal) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`)
      dispatch({ type: ORDER_CREATE_RESET })
    }
  }, [dispatch, history, success, order])

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
      })
    )
  }
  return (
    <>
      <Row>
        <Col md={8}>
          <CheckoutSteps step1 step2 step3 step4 />
          {error && <Message variant='danger'>error</Message>}
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>ENVÍO</h2>
              <p>
                <strong>Dirección: </strong>
                {cart.shippingAddress.address},{cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>MÉTODO DE PAGO</h2>
              <strong>Método: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>ITEMS ORDENADOS</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Su carrito está vacío</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
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
                  <Col>${cart.subtotal}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Envío</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Impuesto</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Ordenar
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
