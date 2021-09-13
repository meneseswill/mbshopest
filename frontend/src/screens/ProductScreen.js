import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Rating from '../components/Rating'
import { Link } from 'react-router-dom'
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  ListGroupItem,
  Button,
  Form,
} from 'react-bootstrap'
import { listProductDetails } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

const ProductScreen = ({ match, history }) => {
  const [qty, setQty] = useState(1)

  const dispatch = useDispatch()
  const { loading, product, error } = useSelector(
    (state) => state.productDetails
  )

  useEffect(() => {
    dispatch(listProductDetails(match.params.id))
  }, [dispatch, match.params.id])

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`)
  }

  return (
    <>
      <Link to='/' className='btn btn-light my-3'>
        Volver
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={Number(product.rating)}
                  text={`${product.reviews} revisiones`}
                />
              </ListGroup.Item>
              <ListGroup.Item>Precio: ${product.price}</ListGroup.Item>
              <ListGroup.Item>{product.description}</ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroupItem>
                  <Row>
                    <Col> Precio : </Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroupItem>

                <ListGroupItem>
                  <Row>
                    <Col> Estado : </Col>
                    <Col>
                      {product.countInStock > 0
                        ? 'Disponible'
                        : 'No Disponible'}
                    </Col>
                  </Row>
                </ListGroupItem>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Cantidad</Col>
                      <Col>
                        <Form.Control
                          as='select'
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1}>{x + 1}</option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroupItem>
                  <Button
                    onClick={addToCartHandler}
                    className='btn btn-block'
                    disabled={product.countInStock === 0}
                  >
                    Agregar al Carrito
                  </Button>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  )
}

export default ProductScreen
