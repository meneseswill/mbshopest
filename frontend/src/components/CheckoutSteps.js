import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav>
      <Nav.Item>
        {step1 ? (
          <LinkContainer to='/login'>
            <Nav.Link>Ingreso</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Ingreso</Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step2 ? (
          <LinkContainer to='/shipping'>
            <Nav.Link>Envío</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Envío</Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step3 ? (
          <LinkContainer to='/payment'>
            <Nav.Link>Pago</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Pago</Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step4 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link>Ordenar</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Ordenar</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps
