import ProductCard from "./ProductCard"
import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function HomePage() {

    const [products, setProducts] = useState([])

    // useEffect: an effect is something outside of the DOM
    // takes two arguments
    // argument 1: effect function (in other words, it's the effect)
    // argument 2: what triggers the effect - an array of variables or states
    //  if empty array, the effect will happen after first render of the component
    // it is similiar to DOMContentLoaded
    useEffect(function(){

        // because we cannot use async function for the effect, to use await
        // in the effect, we must declare an async function and then call it 
        async function fetchData() {
            // when we refer to static URL (i.e image, CSS file, JS file, JSON file)
            // it will always default to the public folder
            const response = await axios.get(API_URL + "/products/latest");
           setProducts(response.data);
        }
        fetchData();
        
    }, [])
    


    const productJSX = [];
    for (let p of products) {
        productJSX.push(<div className="col-md-3 mb-4" key={p.id}>
            <ProductCard name={p.name}
                imageUrl={p.imageUrl}
                price={p.price}
            />
        </div>)
    }

    return <>
        <div className="container">
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

                  {productJSX}

                </div>
            </main>
        </div>
    </>
}