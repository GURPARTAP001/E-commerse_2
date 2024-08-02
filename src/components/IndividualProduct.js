import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Icon } from 'react-icons-kit';

import {closeCircled} from 'react-icons-kit/ionicons/closeCircled'
import { fs, auth } from '../Config';
import './IndividualProduct.css';


const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<span key={i} className="star filled">⭐</span>);
    } else {
      stars.push(<span key={i} className="star">✩</span>);
    }
  }
  return stars;
};


const truncateDescription = (description, wordLimit) => {
  const words = description.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return description;
};


const IndividualProduct = ({ individualProduct,addToCart,role }) => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleProductClick = () => {
    navigate(`/product/${individualProduct.ID}`);
  };


  const handleDeleteProduct = async (e) => {
    e.stopPropagation(); // Prevent the click event from bubbling up to the card
    try {
      await fs.collection('Products').doc(individualProduct.ID).delete();
      console.log('Product successfully deleted!');
      setSuccessMsg('Product deleted successfully!');
      setShowSuccessPopup(true);
      // Optionally, you can add a callback to refresh the product list
      setTimeout(() => {
        setShowSuccessPopup(false);
        window.location.reload(); // Refresh the page to update the product list
      }, 1000); // Adjust the timeout duration as needed
    } catch (error) {
      console.error('Error removing product: ', error);
    }
  };

  return (
    <>
    <div className='main-card'>
    {role === 'admin' && (
      <div className='close-btn' onClick={handleDeleteProduct}>
        <Icon icon={closeCircled} size={30} className="close-icon"/>
      </div>
    )}
    <div className='product card' onClick={handleProductClick}>
      
      <div className='product-img'>
        <img src={individualProduct.url} alt="product-img" />
      </div>
      <div className='product-text title'>{individualProduct.title}</div>
      <div className='product-text description'>
        {truncateDescription(individualProduct.description, 3)}
      </div>
      <div className='product-text price'>₹ {individualProduct.price}</div>
      <div className='product-text rating'>
        {renderStars(individualProduct.rating)}
      </div>
      <div className='btn btn-danger btn-md cart-btn' onClick={(e) => {
        e.stopPropagation(); // Prevent the click event from bubbling up to the card
        addToCart(individualProduct);
      }}>ADD TO CART</div>
    </div>
    {showSuccessPopup && <div className='success-popup'>{successMsg}</div>}
    </div>
    </>
  );
};

export default IndividualProduct;
