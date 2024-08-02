import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Images/logo1.png';
import { Icon } from 'react-icons-kit';
import { shoppingCart } from 'react-icons-kit/feather/shoppingCart';
import { user as userIcon } from 'react-icons-kit/feather/user';
import { home } from 'react-icons-kit/feather/home';
import { info } from 'react-icons-kit/feather/info';
import { phone } from 'react-icons-kit/feather/phone';
import { sun } from 'react-icons-kit/feather/sun';
import { moon } from 'react-icons-kit/feather/moon';
import {logout} from 'react-icons-kit/iconic/logout';
import { plus } from 'react-icons-kit/ikons/plus';
import {ic_add_shopping_cart_twotone} from 'react-icons-kit/md/ic_add_shopping_cart_twotone'
import { auth,fs } from '../Config';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, totalProducts }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [role, setRole] = useState(null);

  

// gettin current user uid
function GetUserUid() {
  const [uid, setUid] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((User) => {
      if (User) {
        setUid(User.uid);
      }
    });
  }, []);
  return uid;
}

const uid = GetUserUid();



  useEffect(() => {
    if (user) {
      console.log('User ID:', uid); // Debugging statement
      fs.collection('users').doc(uid).get().then(snapshot => {
        const userData = snapshot.data();
        if (userData) {
          setRole(userData.Role);
        } else {
          console.error('No user data found for user ID:', uid); // Debugging statement
        }
      }).catch(error => {
        console.error('Error fetching user data:', error);
      });
    } else {
      console.log('No user is logged in'); // Debugging statement
    }
  }, [user]);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  


  return (
    <div className={`navbar ${darkMode ? 'dark-mode' : 'light-mode'} ${menuActive ? 'active' : ''}`}>
      <Link to='/' style={{textDecoration: 'none'}}>
        <div className='intro'>
      
        <div className='logo'>
          <img src={logo} alt='logo' />
        </div>
        <div> <h1>Bazaar</h1></div>
      </div>
      </Link>
      <div className='hamburger' onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={`rightside ${menuActive ? 'active' : ''}`}>
        <div className="hamburger" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div>
          <Link className='navlink' to='/'>
            <Icon icon={home} size={20} />
            HOME
          </Link>
        </div>
        <div>
          <Link className='navlink' to='/about'>
            <Icon icon={info} size={20} />
            ABOUT
          </Link>
        </div>
        <div>
          <Link className='navlink' to='/contact'>
            <Icon icon={phone} size={20} />
            CONTACT US
          </Link>
        </div>

        { role === 'admin' && (
          <div>
            <Link className='navlink' to='/add-products'>
              <Icon icon={ic_add_shopping_cart_twotone} size={25} />
              ADD PRODUCT
            </Link>
          </div>
        )}

        {console.log(role)}
        
        {!user && (
          <>
            <div>
              <Link className='navlink' to='/signup'>
                <Icon icon={userIcon} size={20} />
                SIGN UP
              </Link>
            </div>
            <div>
              <Link className='navlink' to='/login'>
                <Icon icon={userIcon} size={20} />
                LOGIN
              </Link>
            </div>
          </>
        )}
        {user && (
          <>
          <div className='cart-menu-btn'>
              <Link className='navlink' to='/cart'>
                <Icon icon={shoppingCart} size={20} />
                <span>cart</span>
                <span className='cart-indicator'>{totalProducts}</span>
              </Link>
            </div>
            <div className='user-info'>
              <Icon icon={userIcon} size={20} />
              <span>{user}</span>
            </div>
            
            <div className='logout' onClick={handleLogout}>
            <Icon icon={logout} size={20} /> 
            <span>Logout</span>
            </div>
          </>
        )}
        <div className='toggle-mode'>
          <button onClick={toggleDarkMode}>
            <Icon icon={darkMode ? sun : moon} size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;


