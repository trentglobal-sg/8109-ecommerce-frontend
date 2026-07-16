
import ProductCard from "./ProductCard"
import Navbar from "./Navbar";

// pages
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import ProductPage from "./ProductPage";

// imports for wouter
import { Route, Switch} from 'wouter'

// import the FlashMessage hook
import { useFlashMessage } from "./FlashMessageStore";


export default function App() {

  const {flashMessage} = useFlashMessage();

  return (<>

    <div className={`alert alert-${flashMessage.type}`}>
      {flashMessage.message}
    </div>

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