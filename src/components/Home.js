import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Products from './Products';
import { auth, fs } from '../Config';
import { useNavigate } from 'react-router-dom';
import './Home.css';


export const Home = (props) => {
  const navigate = useNavigate();

  // gettin current user uid
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

  // getting current user function
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
  // console.log(user);

  // state of products
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const [role, setRole] = useState(null);


  //getting the role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (uid) {
        const userDoc = await fs.collection('users').doc(uid).get();
        if (userDoc.exists) {
          setRole(userDoc.data().Role);
        }
      }
    };

    fetchUserRole();
  }, [uid]);



  // getting products function
  const getProducts = async () => {
    try {
      const products = await fs.collection('Products').get();
      const productsArray = [];
      for (var snap of products.docs) {
        var data = snap.data();
        data.ID = snap.id;
        productsArray.push({
          ...data,
        });
        if (productsArray.length === products.docs.length) {
          setProducts(productsArray);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  };

  // state of totalProducts
  const [totalProducts, setTotalProducts] = useState(0);
  // getting cart products
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
    setIsLoading(true); // Set loading to true before fetching data
    getProducts();
  }, []);

  let Product;
  const addToCart = (product) => {
    if (uid !== null) {
      // console.log(product);
      Product = product;
      Product['qty'] = 1;
      Product['TotalProductPrice'] = Product.qty * Product.price;
      fs.collection('Cart ' + uid)
        .doc(product.ID)
        .set(Product)
        .then(() => {
          console.log('successfully added to cart');
        });
    } else {
      navigate('/login');
    }
  };

  return (
    <>
    <div>
      <Navbar user={user} totalProducts={totalProducts} />
      <br></br>

      {isLoading ? (
        // Show loading spinner or animation while isLoading
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      ) : (
        <>
        <div className='product-gps'>
          {products.length > 0 && (
            <div className="container-fluid">
              <h1 className="text-center">Products</h1>
              <div className="products-box">
                <Products products={products} addToCart={addToCart} role={role} />
              </div>
            </div>
          )}
          {products.length < 1 && (
            <div className="container-fluid">No products available yet.</div>
          )}
          </div>
        </>
      )}
      </div>
    </>
  );
};

export default Home;
