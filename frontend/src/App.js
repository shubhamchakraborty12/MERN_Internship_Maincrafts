// import logo from './logo.svg';
import axios from "axios";
import Card from "./components/Card";
import './App.css';
import { useState, useEffect } from "react";

function App() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((res) => {
      setProducts(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);
  return (
    <div className="container">
      <h1>Products</h1>

      {products.map((product) => (
        <Card key={product._id} name={product.name} price={product.price} />
      ))}
    </div>
  );
}

export default App;
