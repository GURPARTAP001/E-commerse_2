import React from 'react';
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

export const IndividualProduct = ({ individualProduct, addToCart }) => {
  const handleAddToCart = () => {
    addToCart(individualProduct);
  };

  return (
    <div className='product card'>
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
      <div className='btn btn-danger btn-md cart-btn' onClick={handleAddToCart}>ADD TO CART</div>
    </div>
  );
};

export default IndividualProduct;






