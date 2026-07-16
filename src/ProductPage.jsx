import ProductCard from "./ProductCard"
import { useCart } from "./CartStore"

export default function ProductPage() {

    const { addToCart} = useCart();

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