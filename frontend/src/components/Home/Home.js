import React, { Fragment, useEffect } from 'react'
import {CgMouse} from 'react-icons/cg'
import Product from './Product'
import './Home.css'
import MetaData from '../layout/MetaData.js'
//import {getProduct} from '../../actions/productAction'
import {getProduct} from '../../actions/productAction'
import {useSelector, useDispatch} from 'react-redux'
import Loader from '../layout/Loader/Loader'
import { useAlert } from 'react-alert'




const Home = () => {


  const alert = useAlert()
  const dispatch = useDispatch();
  const {loading, error, products, productsCount } = useSelector((state) => state.products)

  useEffect(() =>{

    if(error){
      return alert.error(error)
    }
    dispatch(getProduct());
  }, [dispatch, error, alert])

  return (
  <Fragment>
    {loading ? (
    <Loader/>
    ): (
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
        {products && products.map(product => (<Product product={product} key={product._id}/>))}
      </div>
    </Fragment>
    )}
  </Fragment>
  )
}

export default Home
