import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap'
import { createProduct } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { PRODUCT_CREATE_RESET } from '../Constants/productConstants'

const ProductEditScreen = ({ history }) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')

  const dispatch = useDispatch()

  const productCreate = useSelector((state) => state.productCreate)
  const { loading, success, error } = productCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (
      !userInfo ||
      (userInfo.role !== 'admin' && userInfo.role !== 'publisher')
    ) {
      console.log('entra')
      history.push('/login')
    }

    if (success) {
      dispatch({ type: PRODUCT_CREATE_RESET })
      history.push('/admin/productlist')
    }
  }, [success, history, dispatch, userInfo])

  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(
      createProduct({
        name,
        price,
        image,
        brand,
        countInStock,
        category,
        description,
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
            <h1>Crear Producto</h1>
            {loading && <Loader />}
            {error && <Message variant='danger'>{error}</Message>}
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
                    image === ''
                      ? '/images/no-image.jpg'
                      : URL.createObjectURL(image)
                  }
                  fluid
                  rounded
                ></Image>
                <Form.File
                  id='image-file'
                  accept='image/*'
                  label='Seleccione la imagen'
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
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default ProductEditScreen
