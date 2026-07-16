import { atom, useAtom } from 'jotai';

const initialCart = [
    // {
    //     "id": 1,
    //     "product_id": 1,
    //     "quantity": 10,
    //     "name": "Organic Green Tea",
    //     "price": 12.99,
    //     "imageUrl": "https://picsum.photos/id/225/300/200",
    //     "description": "Expensive organic green tea"
    // },
    // {
    //     "id": 2,
    //     "product_id": 2,
    //     "quantity": 9,
    //     "name": "Organic red Tea",
    //     "price": 15.99,
    //     "imageUrl": "https://picsum.photos/id/2/300/200",
    //     "description": "Expensive red green tea"
    // }
]

const cartAtom = atom(initialCart);

export const useCart = () => {
    const [cart, setCart] = useAtom(cartAtom);

    const getCartTotal = () => {
        let total = 0;
        for (let c of cart) {
            total += c.quantity * c.price;
        }
        return total;
    }

    // Recieves one parameter, which is the product that we want to add
    // Expected shape of the product
    // - id : the ID of the product
    // - name: name of the product
    // - price: price of the product
    // - imageUrl: imageUrl of the product
    // - description: the description of the product
    const addToCart = (product) => {

        // if the product is already in the shopping cart, increase it quantity by 1
        const existingProductIndex = cart.findIndex(cartItem => cartItem.product_id === product.id);

        // if the product is not in the shopping cart, then the index returned is -1
        if (existingProductIndex == -1) {
            const newCartItem = {
                "id": Math.floor(Math.random() * 10000 + 1),
                "product_id": product.id,
                "quantity": 1,
                "name": product.name,
                "price": product.price,
                "imageUrl": product.imageUrl
            }

            // 1. clone
            // 2. modify the clone
            // 3. replace the clone in the atom
            const cloned = [...cart, newCartItem];
            setCart(cloned);
        } else {
            // find the existing cart item with the product id we are looking for
            const existingCartItem = cart[existingProductIndex];
            // increases it quantity by 1
            existingCartItem.quantity += 1;

            // create a clone and modify the clone
            const cloned = cart.with(existingProductIndex, existingCartItem);
            // replace the array in the atom
            setCart(cloned)
        }


    }

    return {
        cart, getCartTotal, addToCart
    }

}
