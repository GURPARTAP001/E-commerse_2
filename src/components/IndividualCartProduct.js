import React from 'react'
import {Icon} from 'react-icons-kit'
import {plus} from 'react-icons-kit/feather/plus'
import {minus} from 'react-icons-kit/feather/minus'
import {auth,fs} from '../Config'
import './IndividualCartProduct.css'
import { useNavigate } from 'react-router-dom';

export const IndividualCartProduct = ({cartProduct,cartProductIncrease,cartProductDecrease}) => {

    const handleCartProductIncrease=()=>{
        cartProductIncrease(cartProduct);
    }

    const handleCartProductDecrease=()=>{
        cartProductDecrease(cartProduct);
    }

    const handleCartProductDelete=()=>{
        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('Cart ' + user.uid).doc(cartProduct.ID).delete().then(()=>{
                    console.log('successfully deleted');
                })
            }
        })
    }
    const navigate = useNavigate();

    const handleProductClick = () => {
        navigate(`/product/${cartProduct.ID}`);
        // <ProductPage addToCart={addToCart}/>
      };

    
    
    return (
        <div className='product' >
            <div className='product-img' onClick={handleProductClick}>
                <img src={cartProduct.url} alt="product-img"/>
            </div>
            <div className='product-text title' onClick={handleProductClick}>{cartProduct.title}</div>
            <div className='product-text price' onClick={handleProductClick}><span>Price: </span>₹ {cartProduct.price}</div>
            <span>Quantity</span>
            <div className='product-text quantity-box'>
                <div className='action-btns minus' onClick={handleCartProductDecrease} >
                    <Icon icon={minus} size={20}/>
                </div>                
                <div>{cartProduct.qty}</div>               
                <div className='action-btns plus' onClick={handleCartProductIncrease}>
                    <Icon icon={plus} size={20}/>
                </div>
            </div>
            <div className='product-text cart-price'><span>Total: </span>₹ {cartProduct.TotalProductPrice}</div>
            <div className='btn btn-danger btn-md cart-btn' onClick={handleCartProductDelete} >DELETE</div>            
        </div>
    )
}

export default IndividualCartProduct
