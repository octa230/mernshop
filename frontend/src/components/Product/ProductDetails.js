import React, { Fragment, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Carousel from 'react-material-ui-carousel'
import './ProductDetails.css'
import {useSelector, useDispatch} from 'react-redux'
import { getProductDetails } from '../../actions/productAction'



const ProductDetails = () => {


  const dispatch = useDispatch() 
  const params = useParams(id)
  const id = params; 
  //const product = Product


   const {product, loading, error} = useSelector(
    (state) => state.productDetails
  );

  useEffect(()=> {
      
    dispatch(getProductDetails(params.id))
  }, []);


  return (
      <div className='ProductDetails'>
        <div>
          <Carousel>
            {product.images && 
            product.images.map((item, i) =>(
              <img 
              className='CarouselImage'
              key={item.url}
              src={item.url}
              alt={`${i} Slide`}
              />
            ))}
          </Carousel>
        </div>
      </div>
  )
}

export default ProductDetails

