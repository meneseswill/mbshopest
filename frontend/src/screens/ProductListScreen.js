import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Row, Col, Table, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { deleteProduct, listProduct } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { PRODUCT_CREATE_RESET } from '../Constants/productConstants'

function ProductListScreen({ history }) {
  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { products, loading, error, page, pages } = productList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productDelete = useSelector((state) => state.productDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete

  useEffect(() => {
    // dispatch({ type: PRODUCT_CREATE_RESET })

    if (!userInfo || userInfo.role !== 'admin') {
      history.push('/login')
    }

    // if (successDelete) {
    dispatch(listProduct())
    // }
  }, [userInfo, history, successDelete])

  const deleteHandler = (id) => {
    if (window.confirm('¿Está seguro?')) {
      dispatch(deleteProduct(id))
    }
  }

  return (
    <Row>
      <Col className="d-flex align-items-center">
        <h1>Lista de Productos</h1>
      </Col>
      <Col className="text-right">
        <LinkContainer to={`/admin/product/create`}>
          <Button  className='mb-3'>
              <i className="fas fa-plus"></i> CREAR PRODUCTO
          </Button>
        </LinkContainer>
      </Col>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>PRECIO</th>
                <th>CATEGORÍA</th>
                <th>MARCA</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Row>
  )
}

export default ProductListScreen
