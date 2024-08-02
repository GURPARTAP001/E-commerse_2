// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { fs, auth } from '../Config'; // Import your Firebase config
// import './ProductPage.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faStar, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
// import Navbar from './Navbar';

// const ProductPage = () => {

//     const navigate = useNavigate();
//     const { productId } = useParams();
//     const [product, setProduct] = useState(null);
//     const [activeTab, setActiveTab] = useState('description');

//     const handleTabClick = (tab) => {
//       setActiveTab(tab);
//     };







//     function GetUserUid() {
//         const [uid, setUid] = useState(null);
//         useEffect(() => {
//           auth.onAuthStateChanged((user) => {
//             if (user) {
//               setUid(user.uid);
//             }
//           });
//         }, []);
//         return uid;
//     }

//     const uid = GetUserUid();

//     function GetCurrentUser() {
//         const [user, setUser] = useState(null);
//         useEffect(() => {
//             auth.onAuthStateChanged((user) => {
//                 if (user) {
//                     fs.collection('users')
//                         .doc(user.uid)
//                         .get()
//                         .then((snapshot) => {
//                             setUser(snapshot.data().FullName);
//                         });
//                 } else {
//                     setUser(null);
//                 }
//             });
//         }, []);
//         return user;
//     }

//     const user = GetCurrentUser();

//     // State for totalProducts
//     const [totalProducts, setTotalProducts] = useState(0);

//     // Getting cart products
//     useEffect(() => {
//         auth.onAuthStateChanged((user) => {
//             if (user) {
//                 fs.collection('Cart ' + user.uid).onSnapshot((snapshot) => {
//                     const qty = snapshot.docs.length;
//                     setTotalProducts(qty);
//                 });
//             }
//         });
//     }, []);







//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 const productDoc = await fs.collection('Products').doc(productId).get();
//                 if (productDoc.exists) {
//                     setProduct(productDoc.data());
//                 } else {
//                     console.log('No such product!');
//                 }
//             } catch (error) {
//                 console.error('Error fetching product:', error);
//             }
//         };

//         fetchProduct();
//     }, [productId]);

//     if (!product) {
//         return <div>Loading...</div>;
//     }

//     const { url, title, description, price, rating, reviews, offers } = product;

//     const addToCart = async (product) => {
//         if (uid !== null) {
//             const cartRef = fs.collection('Cart ' + uid).doc(productId);
//             const doc = await cartRef.get();
//             if (doc.exists) {
//                 console.log('Product already in cart');
//             } else {
//                 let Product = product;
//                 Product['qty'] = 1;
//                 Product['TotalProductPrice'] = Product.qty * Product.price;
//                 cartRef.set(Product).then(() => {
//                     console.log('Successfully added to cart');
//                 });
//             }
//         } else {
//             navigate('/login');
//         }
//     };



//     return (
//         <div>
//             <Navbar user={user} totalProducts={totalProducts} />
//             <div className="product-page-container">

//                 <div className='product-page-top'>
//                 <div className="product-image">
//                     <img src={url} alt={title} />
//                 </div>
//                 <div className="product-details">
//                     <h1>{title}</h1>
//                     <p className="product-price">₹ {price}</p>
//                     <div className="product-rating">
//                         {Array.from({ length: rating }, (_, index) => (
//                             <FontAwesomeIcon key={index} icon={faStar} className="star filled" />
//                         ))}
//                         {Array.from({ length: 5 - rating }, (_, index) => (
//                             <FontAwesomeIcon key={index} icon={faStar} className="star" />
//                         ))}
//                     </div>
//                     <button className="add-to-cart-btn" onClick={(e) => {
//                         e.stopPropagation(); // Prevent the click event from bubbling up to the card
//                         addToCart(product);
//                     }}>
//                         <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
//                     </button>
//                 </div>
//                 </div>


//                   <div>
//                 <div className="product-extra-details">
//                     <div className="tabs">
//                         <button className={`tab ${activeTab === 'description' ? 'active' : ''}`} onClick={() => handleTabClick('description')}>Description</button>
//                         <button className={`tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => handleTabClick('reviews')}>Reviews</button>
//                         <button className={`tab ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => handleTabClick('offers')}>Offers</button>
//                     </div>
//                     <div className="tab-content">
//                         <div className={`tab-pane ${activeTab === 'description' ? 'active' : ''}`}>
//                             <p>{description}</p>
//                         </div>
//                         <div className={`tab-pane ${activeTab === 'reviews' ? 'active' : ''}`}>
//                             <ul>
//                                 {/* {reviews.map((review, index) => (
//                                     <li key={index}>{review}</li>
//                                 ))} */}
//                             </ul>
//                         </div>
//                         <div className={`tab-pane ${activeTab === 'offers' ? 'active' : ''}`}>
//                             <ul>
//                                 {/* {offers.map((offer, index) => (
//                                     <li key={index}>{offer}</li>
//                                 ))} */}
//                             </ul>
//                         </div>
//                     </div>
//                 </div>
//                 </div>


//             </div>
//         </div>
//     );
// };

// export default ProductPage;













import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fs, auth } from '../Config'; // Import your Firebase config
import './ProductPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';
import { Icon } from 'react-icons-kit';
import {user_circle as userIcon} from 'react-icons-kit/ikons/user_circle'


const ProductPage = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [reviews, setReviews] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [user, setUser] = useState(null);



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

        const fetchReviews = async () => {
            try {
                const reviewsSnapshot = await fs.collection('Products').doc(productId).collection('Reviews').get();
                const reviewsArray = reviewsSnapshot.docs.map(doc => doc.data());
                setReviews(reviewsArray);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchProduct();
        fetchReviews();
    }, [productId]);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                fs.collection('users').doc(user.uid).get().then(snapshot => {
                    setUser(snapshot.data().FullName);
                });
            } else {
                setUser(null);
            }
        });
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleAddToCart = async (product) => {
        const uid = auth.currentUser ? auth.currentUser.uid : null;
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

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser ? auth.currentUser.uid : null;
        if (uid !== null) {
            const review = {
                user: user,
                rating: rating,
                text: reviewText,
                timestamp: new Date()
            };
            try {
                await fs.collection('Products').doc(productId).collection('Reviews').add(review);
                console.log('Review added:', review); // Debugging statement
                setReviews([...reviews, review]);
                setShowModal(false);
                setReviewText('');
                setRating(0);
            } catch (error) {
                console.error('Error adding review:', error);
            }
        } else {
            navigate('/login');
        }
    };


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

      const date_convert=(timestamp)=>{
        const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${day} ${month} ${year}`;        
      }


    if (!product) {
        return <div>Loading...</div>;
    }

    const { url, title, description, price, rating: productRating, offers } = product;

    return (
        <div>
            <Navbar user={user} totalProducts={totalProducts} />
            <div className="product-page-container">
                <div className='product-page-top'>
                    <div className="product-image">
                        <img src={url} alt={title} />
                    </div>
                    <div className="product-details">
                        <h1>{title}</h1>
                        <h2>{description}</h2>
                        <p className="product-price">₹ {price}</p>
                        <div className="product-rating">
                            {Array.from({ length: productRating }, (_, index) => (
                                <FontAwesomeIcon key={index} icon={faStar} className="star filled" />
                            ))}
                            {Array.from({ length: 5 - productRating }, (_, index) => (
                                <FontAwesomeIcon key={index} icon={faStar} className="star" />
                            ))}
                        </div>
                        <button className="add-to-cart-btn" onClick={(e) => {
                            e.stopPropagation(); // Prevent the click event from bubbling up to the card
                            handleAddToCart(product);
                        }}>
                            <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                        </button>
                    </div>
                </div>
                <div className="product-extra-details">
                    <div className="tabs">
                        <button className={`tab ${activeTab === 'description' ? 'active' : ''}`} onClick={() => handleTabClick('description')}>Product Details</button>
                        <button className={`tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => handleTabClick('reviews')}>Reviews</button>
                        <button className={`tab ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => handleTabClick('offers')}>Offers</button>
                    </div>
                    <div className="tab-content">
                        <div className={`tab-pane ${activeTab === 'description' ? 'active' : ''}`}>
                            <p>{description}</p>
                        </div>
                        <div className={`tab-pane ${activeTab === 'reviews' ? 'active' : ''}`}>
                            <ul>
                                {reviews.map((review, index) => (
                                    <li key={index} className="review-card">
                                        <div className="user-icon">
                                            {/* <img src="path/to/user-icon.png" alt="User Icon" /> */}
                                            <Icon icon={userIcon} size={30} />
                                            <div className="review-header">
                                                <strong>{review.user}</strong>
                                                
                                            </div>
                                        </div>
                                        <div className="review-content">
                                        <span className="rating"> {renderStars(review.rating)}</span>
                                            <p className="review-text">{review.text}</p>
                                        </div>
                                        <div><p className="review-date">{date_convert(review.timestamp)}</p></div>
                                        {console.log(date_convert(review.timestamp))}
                                    </li>

                                ))}
                            </ul>
                            <button onClick={() => setShowModal(true)} >Submit Review</button>
                            {console.log(showModal)}
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

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Submit Review</h2>
                        <form onSubmit={handleReviewSubmit}>
                            <div>
                                <label>Rating:</label>
                                <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" required />
                            </div>
                            <div>
                                <label>Review:</label>
                                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} required></textarea>
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductPage;
