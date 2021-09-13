import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import {Link} from 'react-router-dom'

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 text-center'>
      <Link to={`/product/${product._id}`}>
        <Card.Img variant='top' src={product.image} />
      </Link>
      <Card.Body>
      <Link to={`/product/${product._id}`}>
        <Card.Title>
          <strong>{product.name}</strong>
        </Card.Title>
      </Link>
      </Card.Body>
      <Card.Text as='div'>
        <Rating
          value={Number(product.rating)}
          text={`${Number(product.reviews)} revisiones`}
        />
      </Card.Text>
      <Card.Text as='h3'>${product.price}</Card.Text>
    </Card>
  )
}

export default Product
