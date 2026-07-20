
import ProductCard from "./ProductCard"
import Navbar from "./Navbar";

// pages
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import ProductPage from "./ProductPage";
import ShoppingCart from "./ShoppingCart";
import LoginPage from "./LoginPage";
import ProfilePage from "./ProfilePage";

// imports for wouter
import { Route, Switch} from 'wouter'
import FlashMessageDisplay from "./FlashMessageDisplay";

import "./App.css";

export default function App() {

  return (<>

   <FlashMessageDisplay/>

    <Navbar/>

    {/* <Switch> is the part of that screen that changes
    depending on the URL of the browserr */}
    <Switch>
      <Route path="/" component={HomePage}/>
      <Route path="/products" component={ProductPage}/>
      <Route path="/register" component={RegisterPage}/>
      <Route path="/cart" component={ShoppingCart}/>
      <Route path="/login" component={LoginPage}/>
      <Route path="/profile" component={ProfilePage}/>
    </Switch>

    <footer className="bg-dark text-white text-center py-3">
      <div className="container">
        <p>&copy; 2023 E-Shop. All rights reserved.</p>
      </div>
    </footer>


  </>)
}