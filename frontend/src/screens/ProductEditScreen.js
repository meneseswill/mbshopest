import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap'
import { listProductDetails, updateProduct } from '../actions/productActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  PRODUCT_DETAILS_RESET,
  PRODUCT_UPDATE_RESET,
} from '../Constants/productConstants'

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { product, loading, error } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    success: successUpdate,
    loading: loadingUpdate,
    error: errorUpdate,
  } = productUpdate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      history.push('/login')
    }

    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      dispatch({ type: PRODUCT_DETAILS_RESET })
      history.push('/admin/productlist')
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [dispatch, productId, product, history, successUpdate, userInfo])

  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(
      updateProduct({
        _id: product._id,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    )
  }

  const handlerChangeImage = (e) => {
    setImage(e.target.files[0])
  }

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Atrás
      </Link>
      <Container>
        <Row className='justify-content-md-center'>
          <Col sm={12} md={6}>
            <h1>Editar Producto</h1>
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
                    placeholder='Introduzca el nombre'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId='price'>
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Introduzca el precio'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId='image'>
                  <Image
                    style={{ width: 150 }}
                    src={
                      typeof image === 'object'
                        ? URL.createObjectURL(image)
                        : image
                    }
                    fluid
                    rounded
                  ></Image>
                  <Form.File
                    id='image-file'
                    label='Seleccione la imagen'
                    custom
                    onChange={handlerChangeImage}
                  ></Form.File>
                </Form.Group>
                <Form.Group controlId='brand'>
                  <Form.Label>Marca</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Introduzca la marca'
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId='countInStock'>
                  <Form.Label>Cantidad en existencia</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Introduzca la cantidad en existencia'
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId='category'>
                  <Form.Label>Categoría</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Introduzca la categoría'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId='description'>
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Introduzca la descripción'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></Form.Control>
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

export default ProductEditScreen
