import ProductCard from "./ProductCard"
import { useCart } from "./CartStore"
import { useFlashMessage} from "./FlashMessageStore";
import { Link } from "wouter";

export default function ProductPage() {

    const { addToCart} = useCart();
    const { showMessage } = useFlashMessage();

    const products = [
        {
            "id": 1,
            "name": "Sleek Smartwatch",
            "price": 199.99,
            "imageUrl": "https://picsum.photos/id/20/300/200"
        },
        {
            "id": 2,
            "name": "GoPro Camera",
            "price": 299.99,
            "imageUrl": "https://picsum.photos/id/21/300/200"
        },
        {
            "id": 3,
            "name": "Mini Laptop",
            "price": 299.99,
            "imageUrl": "https://picsum.photos/id/22/300/200"
        },
        {
            "id": 3,
            "name": "Portable Projector",
            "price": 399.99,
            "imageUrl": "https://picsum.photos/id/23/300/200"
        }
    ]


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