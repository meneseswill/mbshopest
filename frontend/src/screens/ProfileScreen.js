import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Form, Button, Row, Tabs, Tab, Table } from 'react-bootstrap'
import {
  getUserDetails,
  updateUserPassword,
  updateUserProfile,
} from '../actions/userActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listMyOrders } from '../actions/orderActions'

const ProfileScreen = ({ history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { user, loading, error } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const {
    error: errorUpdateProfile,
    success: successUpdateProfile,
  } = userUpdateProfile

  const userUpdatePassword = useSelector((state) => state.userUpdatePassword)
  const {
    error: errorUpdatePassword,
    success: successUpdatePassword,
  } = userUpdatePassword

  const orderListMy = useSelector((state) => state.orderListMy)
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      dispatch(listMyOrders())
      if (!user.name) {
        dispatch(getUserDetails('me'))
      } else {
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [history, userInfo, dispatch, user])

  const submitHandlerDetails = (e) => {
    e.preventDefault()

    // Dispacth
    dispatch(
      updateUserProfile({
        id: user._id,
        name,
        email,
      })
    )
  }

  const submitHandlerPassword = (e) => {
    e.preventDefault()

    // Dispatch
    if (newPassword !== confirmNewPassword) {
      setMessage('La nueva contraseña y la confirmación no coinciden')
    } else {
      dispatch(updateUserPassword(password, newPassword))
    }
  }

  return (
    <Row>
      <Col md={4}>
        <h1>Perfil de usuario</h1>
        {error && <Message variant='danger'>{error}</Message>}
        {errorUpdateProfile && (
          <Message variant='danger'>{errorUpdateProfile}</Message>
        )}
        {errorUpdatePassword && (
          <Message variant='danger'>{errorUpdatePassword}</Message>
        )}
        {successUpdateProfile && (
          <Message variant='success'>Perfil actualizado</Message>
        )}
        {successUpdatePassword && (
          <Message variant='success'>Contraseña actualizada</Message>
        )}
        {message && <Message variant='danger'>{message}</Message>}
        {loading && <Loader />}
        <Tabs defaultActiveKey='info' id='uncontrolled-tab-example'>
          <Tab eventKey='info' title='Információn'>
            <br />
            <p>Actualice su información de perfil</p>
            <Form onSubmit={submitHandlerDetails}>
              <Form.Group controlId='name'>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Introduzca su nombre'
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Introduzca su correo'
                ></Form.Control>
              </Form.Group>

              <Button type='submit' variant='primary'>
                Actualizar
              </Button>
            </Form>
          </Tab>
          <Tab eventKey='password' title='Contraseña'>
            <br />
            <p>Cambie su contraseña de ingreso</p>
            <Form onSubmit={submitHandlerPassword}>
              <Form.Group controlId='password'>
                <Form.Label>Contraseña actual</Form.Label>
                <Form.Control
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='newPassword'>
                <Form.Label>Nueva contraseña</Form.Label>
                <Form.Control
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='confirmNewPassword'>
                <Form.Label>Confirme nueva contraseña</Form.Label>
                <Form.Control
                  type='password'
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button type='submit' variant='primary'>
                Actualizar
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </Col>
      <Col md={8}>
        <h1>Mís órdenes</h1>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant='danger'>{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>FECHA</th>
                <th>TOTAL</th>
                <th>PAGADA</th>
                <th>ENTREGDA</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <Link to={`/order/${order._id}`}>{order._id}</Link>
                  </td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='light'>
                        Detalles
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  )
}

export default ProfileScreen
