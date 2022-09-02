import React, { Fragment, useEffect } from 'react'
import {CgMouse} from 'react-icons/cg'
import Product from './Product.js'
import './Home.css'
import MetaData from '../layout/MetaData.js'
import {getProduct} from '../../actions/productAction'
import {useSelector, useDispatch} from 'react-redux'




const Home = () => {

  const dispatch = useDispatch();
  const {loading, error, products, productsCount } = useSelector(
    (state) => state.products)

  useEffect(() =>{
    dispatch(getProduct())
  }, [dispatch])
  return (
  <Fragment>
    <MetaData title='Home page'/>
      <div className='banner'>
        <p>welcome to our flowershop</p>
        <h1>Find amazing flowers from this spot</h1>
        <a href='#container'>
            <button>
            Scroll <CgMouse />
            </button>    
        </a>
      </div>
      <h2 className='homeHeading'>Featured Products</h2>
      <div className='container' id='container'>
        {products && products .map((product) => <Product product={product} />)}
      </div>
    </Fragment>
  )
}

export default Home
