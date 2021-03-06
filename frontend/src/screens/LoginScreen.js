import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Container, Row, Form, Button } from 'react-bootstrap'
import { login } from '../actions/userActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Link } from 'react-router-dom'

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : ''

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()

    // Dispatch login
    dispatch(login(email, password))
  }
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col sm={12} md={6}>
          <h1>Ingresar</h1>
          {error && <Message variant='danger'>{error}</Message>}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Instroduzca su email'
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Instroduzca su contraseña'
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Ingresar
            </Button>
          </Form>
          <Row className='py-3'>
            <Col>
              ¿Eres un nuevo cliente?{' '}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : '/register'}
              >
                Registrar
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginScreen
