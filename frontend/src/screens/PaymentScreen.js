import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Button, Col, Form, Row } from 'react-bootstrap'
import { savePaymentMethod } from '../actions/userActions'
import CheckoutSteps from '../components/CheckoutSteps'

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress, paymentMethod: paymentMethodGlobalStore } = cart

  const dispatch = useDispatch()

  if (!shippingAddress.address) {
    history.push('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState(
    paymentMethodGlobalStore ? paymentMethodGlobalStore : 'PayPal'
  )

  const submitHandler = (e) => {
    e.preventDefault()

    // Dispatch
    dispatch(savePaymentMethod(paymentMethod))
    history.push('/placeorder')
  }
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col sm={12} md={6}>
          <h1>Método de pago</h1>
          <CheckoutSteps step1 step2 step3 />
          <Form onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label as='legend'>Seleccione método</Form.Label>
              <Col>
                <Form.Check
                  type='radio'
                  label='PayPal o tarjeta de crédito'
                  id='PayPal'
                  name='paymentMethod'
                  value='PayPal'
                  checked={paymentMethod === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                ></Form.Check>

                {/* <Form.Check
                  type='radio'
                  label='Stripe'
                  id='Stripe'
                  name='paymentMethod'
                  value='Stripe'
                  checked={paymentMethod === 'Stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                ></Form.Check> */}
              </Col>
            </Form.Group>
            <Button type='submit' variant='primary'>
              Continuar
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default PaymentScreen
