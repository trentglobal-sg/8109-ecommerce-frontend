import ProductCard from "./ProductCard"
import { useState } from "react"

export default function App() {

  // creae a new state variable for the componnet
  // useState(false) means the default for state is `false`
  const [showNavBar, setShowNavBar] = useState(false);

  return (<>
    {/* Navbar */}
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="#">E-Shop</a>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={()=>{
            setShowNavBar(!showNavBar);
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${showNavBar ? "show": ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Products</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <header className="bg-primary text-white text-center py-5">
      <div className="container">
        <h1 className="display-4">Welcome to E-Shop</h1>
        <p className="lead">Discover amazing products at unbeatable prices!</p>
        <a href="#" className="btn btn-light btn-lg">Shop Now</a>
      </div>
    </header>

    <main className="container my-5">
      <h2 className="text-center mb-4">Featured Products</h2>
      <div className="row">
        <div className="col-md-3 mb-4">
          <ProductCard name="Laptop" 
            imageUrl="https://picsum.photos/id/8/300/200"
            price={2000}
          />
        </div>
        <div className="col-md-3 mb-4">
          <ProductCard name="Screwdriver"
            imageUrl="https://picsum.photos/id/20/300/200"
            price={18.99}
          />
        </div>
        <div className="col-md-3 mb-4">
          <ProductCard 
            name="ACME Anvil"
            imageUrl="https://picsum.photos/id/21/300/200"
            price={199.99}
          />
        </div>
        <div className="col-md-3 mb-4">
          <ProductCard 
            name="Soundproof Headphones"
            imageUrl="https://picsum.photos/id/22/300/200"
            price={230.0}
          />
        </div>
      </div>
    </main>

    <footer className="bg-dark text-white text-center py-3">
      <div className="container">
        <p>&copy; 2023 E-Shop. All rights reserved.</p>
      </div>
    </footer>


  </>)
}