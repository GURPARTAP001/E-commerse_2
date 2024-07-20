import React from 'react';
import Masonry from 'react-masonry-css';
import IndividualProduct from './IndividualProduct';
import './Products.css';

export const Products = ({ products, addToCart }) => {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {products.map((individualProduct) => (
        <IndividualProduct
          key={individualProduct.ID}
          individualProduct={individualProduct}
          addToCart={addToCart}
        />
      ))}
    </Masonry>
  );
};

export default Products;
