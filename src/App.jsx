
import ProductCard from "./ProductCard"
import Navbar from "./Navbar";

// pages
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import ProductPage from "./ProductPage";

// imports for wouter
import { Route, Switch} from 'wouter'


export default function App() {

  

  return (<>

    <Navbar/>

    {/* <Switch> is the part of that screen that changes
    depending on the URL of the browserr */}
    <Switch>
      <Route path="/" component={HomePage}/>
      <Route path="/products" component={ProductPage}/>
      <Route path="/register" component={RegisterPage}/>
    </Switch>

    <footer className="bg-dark text-white text-center py-3">
      <div className="container">
        <p>&copy; 2023 E-Shop. All rights reserved.</p>
      </div>
    </footer>


  </>)
}