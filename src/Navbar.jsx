import { useState } from "react"
import { Link, useLocation } from "wouter";
import { useJWT } from "./UserStore";

export default function Navbar() {

    // creae a new state variable for the componnet
    // useState(false) means the default for state is `false`
    const [showNavBar, setShowNavBar] = useState(false);
    const { jwt } = useJWT();

    // useLocation is a hook from wouter
    // when called, it will return an array of two items
    // index 0 - the current location (aka URL) of the browser
    // index 1 - a functtion to to change the current location of the browser
    const [location] = useLocation();
    console.log(location)

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
                    onClick={() => {
                        setShowNavBar(!showNavBar);
                    }}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${showNavBar ? "show" : ""}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className={`nav-link ${location === "/" ? "active" : ""}`} aria-current="page" href="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location === "/products" ? "active" : ""}`} href="/products">Products</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location === "/register" ? "active" : ""}`} href="/register">Register</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location === "/cart" ? "active" : ""}`} href="/cart">Cart</Link>
                        </li>
<<<<<<< HEAD
                        <li className="nav-item">
                            <Link className={`nav-link ${location === "/chat" ? "active" : ""}`} href="/chat">Chat</Link>
                        </li>
=======
                        {!jwt && <li className="nav-item">
                            <Link className={`nav-link ${location === "/login" ? "active" : ""}`} href="/login">Login</Link>
                        </li>}

                        {
                            jwt && <li className="nav-item">
                               <Link className={`nav-link ${location === "/profile" ? "active" : ""}`} href="/profile">Profile</Link>
                            </li>
                        }

                        {
                            jwt && <li className="nav-item">
                                <Link className='nav-link'>Logout</Link>
                            </li>
                        }

>>>>>>> 06-shopping-cart
                    </ul>
                </div>
            </div>
        </nav>
    </>)
}