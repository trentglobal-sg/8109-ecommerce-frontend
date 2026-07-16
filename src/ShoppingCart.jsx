import { useCart } from "./CartStore"

export default function ShoppingCart() {

    const { cart, getCartTotal } = useCart();

    return <>
        <div className="container mt-4">
            <h2>Shopping Cart</h2>
            <ul className="list-group">
                {
                    cart.map(item => (<li key={item.id} className="list-group-item d-flex justify-content-between">
                        <div>
                            <h5>{item.name}</h5>
                            <p>Quantity: {item.quantity}</p>
                        </div>
                        <div>
                            <img src={item.imageUrl}/>
                        </div>
                        <div>
                            ${(item.price * item.quantity).toFixed(2)}
                        </div>
                    </li>
                    ))
                }
            </ul>
            <div>
                <h3>Total: ${getCartTotal().toFixed(2)}</h3>
            </div>
        </div>
    </>
}