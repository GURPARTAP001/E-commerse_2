import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { auth, fs } from '../Config';
import './About.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faUsers, faStore, faGlobe } from '@fortawesome/free-solid-svg-icons'; 

const About = () => {

    function GetCurrentUser(){
                const [user, setUser]=useState(null);
                useEffect(()=>{
                    auth.onAuthStateChanged(user=>{
                        if(user){
                            fs.collection('users').doc(user.uid).get().then(snapshot=>{
                                setUser(snapshot.data().FullName);
                            })
                        }
                        else{
                            setUser(null);
                        }
                    })
                },[])
                return user;
            }
  const user = GetCurrentUser(); 
  // State for totalProducts, customerBase, brands, and countries
  const [totalProducts, setTotalProducts] = useState(0);
  const [customerBase, setCustomerBase] = useState(0);
  const [brands, setBrands] = useState(0);
  const [countries, setCountries] = useState(0);

  // Function to fetch data from Firebase
  const fetchData = async () => {
    try {
      // Fetch total products from 'Products' collection
      const productsSnapshot = await fs.collection('Products').get();
      setTotalProducts(productsSnapshot.docs.length);

      // Fetch customer base (you'll need to define how you store this data)
      // Example: Assuming you have a 'Customers' collection
      const customersSnapshot = await fs.collection('users').get();
      setCustomerBase(customersSnapshot.docs.length);

      // Fetch number of brands (you'll need to define how you store this data)
      // Example: Assuming you have a 'Brands' collection
      const brandsSnapshot = await fs.collection('Products').get();
      setBrands(brandsSnapshot.docs.length);

      // Fetch number of countries (you'll need to define how you store this data)
      // Example: Assuming you have a 'Countries' collection
      const countriesSnapshot = await fs.collection('Countries').get();
      setCountries(countriesSnapshot.docs.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // State for totalProducts from cart
  const [cartProducts, setCartProducts] = useState(0);

  // Fetch totalProducts from cart using useEffect
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection('Cart ' + user.uid).onSnapshot((snapshot) => {
          const qty = snapshot.docs.length;
          setCartProducts(qty);
        });
      }
    });
  }, []);

  return (
    <div className="about-container">
      <Navbar user={user} totalProducts={cartProducts} /> 
      <div className="about-content">
        <h1>About Us</h1>
        <p>
        Welcome to Bazaar, your one-stop destination for a diverse range of products. At Bazaar, we are dedicated to providing an exceptional shopping experience, combining quality, convenience, and affordability.

        Our mission is to bring the best products to your doorstep, ensuring that you find exactly what you need, whether it's the latest fashion trends, electronics, home essentials, or unique gifts. We are passionate about curating a wide selection of items to cater to all your needs and preferences.

        </p>

        <div className="stats-section">
          <div className="stat-card">
            <FontAwesomeIcon className="abt-icon" icon={faShoppingCart} />
            <h3>{totalProducts}</h3>
            <p>Products</p>
          </div>
          <div className="stat-card">
            
            <FontAwesomeIcon className="abt-icon" icon={faUsers} />
            <h3>{customerBase}</h3>
            <p>Customers</p>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon className="abt-icon" icon={faStore} />
            <h3>{brands}</h3>
            <p>Brands</p>
          </div>
          <div className="stat-card">
            
            <FontAwesomeIcon className="abt-icon" icon={faGlobe} />
            <h3>{countries}</h3>
            <p>Countries</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
