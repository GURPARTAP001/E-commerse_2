import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { auth, fs } from '../Config';
import './Contact_us.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Contact_us = () => {
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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fs.collection('Contact_Us').add({
        name,
        email,
        message,
      });

      setSuccessMsg('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
      setErrorMsg('');

      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    } catch (error) {
      setErrorMsg('Error sending message. Please try again later.');
    }
  };

  return (
    <div className="contact-us-container">
      <Navbar user={user} totalProducts={totalProducts} />
      <div className="contact-us-content">
        <h1>Contact Us</h1>
        <p>
          We are here to help! If you have any questions or need assistance,
          please don't hesitate to reach out to us.
        </p>
        <div className="contact-info">
          <div className="contact-item">
            <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
            <p>
              <a href="mailto:info@bazaar.com">info@bazaar.com</a>
            </p>
          </div>
          <div className="contact-item">
            <FontAwesomeIcon icon={faPhone} className="contact-icon" />
            <p>+1-800-555-1212</p>
          </div>
          <div className="contact-item">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
            <p>123 Main Street, Anytown, CA 12345</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            {/* <label htmlFor="name">Your Name:</label> */}
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)} placeholder='Your Name'
              required
            />
          </div>
          <div className="form-group">
            {/* <label htmlFor="email">Your Email:</label> */}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder='Your Email'
              required
            />
          </div>
          <div className="form-group">
            {/* <label htmlFor="message">Your Message:</label> */}
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)} placeholder='Your message'
              required
            />
          </div>

          {successMsg && <div className="success-msg">{successMsg}</div>}
          {errorMsg && <div className="error-msg">{errorMsg}</div>}

          <button type="submit" className="btn btn-primary">
            <FontAwesomeIcon icon={faPaperPlane} className="send-icon" />
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact_us;
