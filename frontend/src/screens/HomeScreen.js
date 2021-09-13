import React , {useEffect}  from 'react'
import {useDispatch , useSelector}  from 'react-redux'
import Product from '../components/Product'
import { Row , Col} from 'react-bootstrap'
import {listProduct} from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

const HomeScreen = () => {
    const dispatch = useDispatch()

    const {loading, products , error} = useSelector((state) => state.productList)
    
    useEffect(()=> {
        dispatch(listProduct())
        
    }, [dispatch])

    // console.log(products);
    return <>
        <h1>Ultimos Productos</h1>
        {loading ? (<Loader/>) : error ? <Message variant='danger'>{error}</Message> : (
        <Row>
            {products.map( (product) =>{
                return (
                    <Col key={product._id} sm ={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                )
            })}
        </Row> 
        )}
        
    </>
}   

export default HomeScreen 