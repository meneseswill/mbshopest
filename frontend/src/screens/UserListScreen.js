import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listUser, deleteUser } from '../actions/userActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch()

  const userList = useSelector((state) => state.userList)
  const { loading, error, users } = userList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDelete = useSelector((state) => state.userDelete)
  const {
    success: successDelete,
    loading: loadginDelete,
    error: errorDelete,
  } = userDelete

  useEffect(() => {
    if (userInfo && userInfo.role === 'admin') {
      dispatch(listUser())
    } else {
      history.push('/')
    }
  }, [dispatch, history, userInfo, successDelete])

  const deleteHandler = (id) => {
    if (window.confirm('¿Estás seguro')) {
      dispatch(deleteUser(id))
    }
  }

  return (
    <>
      <h1>Usuarios</h1>
      {loadginDelete && <Loader />}
      {errorDelete && <Message varian='danger'>{errorDelete}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table stripped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.role === 'admin'
                    ? 'Administrador'
                    : user.role === 'publisher'
                    ? 'Editor'
                    : 'Usuario'}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button
                      variant='light'
                      className='btn-sm'
                      disabled={user.email === userInfo.email}
                    >
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>

                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(user._id)}
                    disabled={user.email === userInfo.email}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UserListScreen
