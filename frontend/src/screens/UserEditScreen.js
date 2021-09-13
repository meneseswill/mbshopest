import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Col, Container, Row, Form, Button } from 'react-bootstrap'
import { getUserDetails, updateUser } from '../actions/userActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { USER_UPDATE_RESET } from '../Constants/userConstants'

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('user')

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { user, loading, error } = userDetails

  const userUpdate = useSelector((state) => state.userUpdate)
  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = userUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET })
      history.push('/admin/userlist')
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(`users/${userId}`))
      } else {
        setName(user.name)
        setEmail(user.email)
        setRole(user.role)
      }
    }
  }, [dispatch, userId, user, successUpdate, history])

  const submitHandler = (e) => {
    e.preventDefault()

    // dispatch
    dispatch(
      updateUser({
        _id: userId,
        name,
        email,
        role,
      })
    )
  }

  return (
    <>
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        Atrás
      </Link>
      <Container>
        <Row className='justify-content-md-center'>
          <Col sm={12} md={6}>
            <h1>Editar usuario</h1>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger'>{error}</Message>
            ) : (
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Introduzca su nombre'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Introduzca su correo'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='role'>
                  <Form.Label>Rol</Form.Label>
                  <Form.Control
                    as='select'
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value='admin'>Administrador</option>
                    <option value='publisher'>Editor</option>
                    <option value='user'>Usuario</option>
                  </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                  Actualizar
                </Button>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default UserEditScreen
