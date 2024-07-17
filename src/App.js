import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import AddProducts from './components/AddProducts';
import Cart from './components/Cart';


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
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
