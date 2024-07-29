import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fs, auth } from '../Config'; // Import your Firebase config
import './ProductPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';

const ProductPage = () => {

    const navigate = useNavigate();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('description');

    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };

    function GetUserUid() {
        const [uid, setUid] = useState(null);
        useEffect(() => {
          auth.onAuthStateChanged((user) => {
            if (user) {
              setUid(user.uid);
            }
          });
        }, []);
        return uid;
    }
    
    const uid = GetUserUid();

    function GetCurrentUser() {
        const [user, setUser] = useState(null);
        useEffect(() => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    fs.collection('users')
                        .doc(user.uid)
                        .get()
                        .then((snapshot) => {
                            setUser(snapshot.data().FullName);
                        });
                } else {
                    setUser(null);
                }
            });
        }, []);
        return user;
    }

    const user = GetCurrentUser();

    // State for totalProducts
    const [totalProducts, setTotalProducts] = useState(0);

    // Getting cart products
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                fs.collection('Cart ' + user.uid).onSnapshot((snapshot) => {
                    const qty = snapshot.docs.length;
                    setTotalProducts(qty);
                });
            }
        });
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productDoc = await fs.collection('Products').doc(productId).get();
                if (productDoc.exists) {
                    setProduct(productDoc.data());
                } else {
                    console.log('No such product!');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const { url, title, description, price, rating, reviews, offers } = product;

    const addToCart = async (product) => {
        if (uid !== null) {
            const cartRef = fs.collection('Cart ' + uid).doc(productId);
            const doc = await cartRef.get();
            if (doc.exists) {
                console.log('Product already in cart');
            } else {
                let Product = product;
                Product['qty'] = 1;
                Product['TotalProductPrice'] = Product.qty * Product.price;
                cartRef.set(Product).then(() => {
                    console.log('Successfully added to cart');
                });
            }
        } else {
            navigate('/login');
        }
    };

   

    return (
        <div>
            <Navbar user={user} totalProducts={totalProducts} />
            <div className="product-page-container">
                <div className="product-image">
                    <img src={url} alt={title} />
                </div>
                <div className="product-details">
                    <h1>{title}</h1>
                    <p className="product-price">₹ {price}</p>
                    <div className="product-rating">
                        {Array.from({ length: rating }, (_, index) => (
                            <FontAwesomeIcon key={index} icon={faStar} className="star filled" />
                        ))}
                        {Array.from({ length: 5 - rating }, (_, index) => (
                            <FontAwesomeIcon key={index} icon={faStar} className="star" />
                        ))}
                    </div>
                    <button className="add-to-cart-btn" onClick={(e) => {
                        e.stopPropagation(); // Prevent the click event from bubbling up to the card
                        addToCart(product);
                    }}>
                        <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                    </button>
                </div>
                <div className="product-extra-details">
                    <div className="tabs">
                        <button className={`tab ${activeTab === 'description' ? 'active' : ''}`} onClick={() => handleTabClick('description')}>Description</button>
                        <button className={`tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => handleTabClick('reviews')}>Reviews</button>
                        <button className={`tab ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => handleTabClick('offers')}>Offers</button>
                    </div>
                    <div className="tab-content">
                        <div className={`tab-pane ${activeTab === 'description' ? 'active' : ''}`}>
                            <p>{description}</p>
                        </div>
                        <div className={`tab-pane ${activeTab === 'reviews' ? 'active' : ''}`}>
                            <ul>
                                {/* {reviews.map((review, index) => (
                                    <li key={index}>{review}</li>
                                ))} */}
                            </ul>
                        </div>
                        <div className={`tab-pane ${activeTab === 'offers' ? 'active' : ''}`}>
                            <ul>
                                {/* {offers.map((offer, index) => (
                                    <li key={index}>{offer}</li>
                                ))} */}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
