import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import AddProducts from './components/AddProducts';
import Cart from './components/Cart';
import Contact_us from './components/Contact_us';
import About from './components/About';
import ProductPage from './components/ProductPage';


function App() {
 
  

  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/add-products" element={<AddProducts/>}/>       
        <Route path="/cart" element={<Cart/>}/>       
        <Route path="/about" element={<About/>}/>       
        <Route path="/contact" element={<Contact_us/>}/>       
        <Route path="/product/:productId" element={<ProductPage />}/>       
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
