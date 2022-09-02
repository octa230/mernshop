
import {createStore, combineReducers, applyMiddleware} from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { productReducer } from './reducers/productReducer';


const reducer = combineReducers({
    products: productReducer
})

let initialState = {};
const middleware = [thunk];

const store = configureStore({
    reducer, 
    initialState,
})

export default store