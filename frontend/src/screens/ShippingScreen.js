import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { saveShippingAddress } from '../actions/userActions'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  const [address, setAddress] = useState(shippingAddress.address)
  const [city, setCity] = useState(shippingAddress.city)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [country, setCountry] = useState(shippingAddress.country)

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()

    // dipatch
    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country,
      })
    )

    history.push('/payment')
  }

  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col sm={12} md={6}>
          <CheckoutSteps step1 step2/>
          <h1>Envío</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='address'>
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type='text'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder='Introduzca la dirección'
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='city'>
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                type='text'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder='Introduzca la ciudad'
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='postalCode'>
              <Form.Label>Código postal</Form.Label>
              <Form.Control
                type='text'
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder='Introduzca el código postal'
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='country'>
              <Form.Label>País</Form.Label>
              <Form.Control
                type='text'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder='Introduzca el país'
                required
              ></Form.Control>
            </Form.Group>
            <Button type='submit'>Continuar</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default ShippingScreen
