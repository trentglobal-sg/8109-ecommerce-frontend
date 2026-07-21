import ProductCard from "./ProductCard"
import { useCart } from "./CartStore"
import { useFlashMessage} from "./FlashMessageStore";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductPage() {

    const { addToCart} = useCart();
    const { showMessage } = useFlashMessage();
    const [products, setProducts] = useState([]);

    // call the effect function once after the component renders for the first time
    useEffect(()=>{
        const fetchProducts = async() => {
            const response = await axios.get(API_URL + '/products');
            setProducts(response.data);
        }
        fetchProducts();
    }, []);

    return <>
        <div className="container my-5">
            <h1>Our Products</h1>
            <div className="row">
            {
    products.map(function (p) {
        return (
            <div key={p.id} className="col-md-3 mb-4">
                <ProductCard
                    imageUrl={p.imageUrl}
                    name={p.name}
                    price={p.price}
                    onAddToCart={()=>{
                        addToCart(p);
                        // showMessage("Product added to shopping cart successfully", "success");
                        showMessage(<div>
                            <p>Product added to shopping cart successfully</p>
                            <Link href="/cart" className="btn btn-primary btn-sm">Go to Cart</Link>
                        </div>, "success");
                    }}
                />
                        </div>
                    )
                })
            }
            </div>


        </div>
    </>
}