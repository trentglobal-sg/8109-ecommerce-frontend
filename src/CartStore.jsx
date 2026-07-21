import axios from 'axios';
import { atom, useAtom } from 'jotai';
import { useJWT } from './UserStore';
import { useFlashMessage } from './FlashMessageStore';


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

const API_URL = import.meta.env.VITE_API_URL;

export const useCart = () => {
    const [cart, setCart] = useAtom(cartAtom);
    const { jwt } = useJWT();
    const { showFlashMessage} = useFlashMessage();

    const fetchCart = async () => {
        try {
            const response = await axios.get(API_URL + '/cart', {
                headers: {
                    Authorization: 'Bearer ' + jwt
                }
            });
            setCart(response.data);

        } catch (e) {
            showFlashMessage("Unable to load shopping cart", "danger");
            console.error(e.message);
        }
    }

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
            updateCart(cloned);
        } else {
            // find the existing cart item with the product id we are looking for
            const existingCartItem = cart[existingProductIndex];
            // increases it quantity by 1
            existingCartItem.quantity += 1;

            // create a clone and modify the clone
            const cloned = cart.with(existingProductIndex, existingCartItem);
            // replace the array in the atom
            setCart(cloned)
            updateCart(cloned);
        }


    }

    // item is a cartItem
    const removeFromCart = (item) => {
        // 1. find the index of the item we delete
        const indexToDelete = cart.findIndex(i => i.product_id === item.product_id);

        if (indexToDelete > -1) {
            // 2. clone the array
            // 3. modify the clone to delete the item by its index
            const cloned = cart.toSpliced(indexToDelete, 1);
            // 4. replace the clone into the atom
            setCart(cloned);
            updateCart(cloned);
        }
    }

    const modifyQuantity = (item, newQuantity) =>{

        if (newQuantity <= 0) {
            return;
        }

        // 1. find the index of the item we want to tweak the quantity for
        const indexToModify = cart.findIndex(i => i.product_id === item.product_id);

        // 2. clone the cart item
        const modifiedCartItem = {...cart[indexToModify]};

        // 3. modify the copy of the cart item
        modifiedCartItem.quantity = newQuantity;

        // 3. clone the cart array
        // 4. update the cloned cart array
        const clonedCart = cart.with(indexToModify, modifiedCartItem);

        // 5. replace the cart atom with the cloned
        setCart(clonedCart);
        updateCart(clonedCart);
    }

    /**
     * 
     * @param {[
     * {
     *   product_id: number,
     *   quantity: number,
     *   name: string,
     *   imageUrl: string,
     *   price: float
     * }
     * ]} updatedCart cart atom that has been updated
     */
    const updateCart = async (updatedCart) => {
        const cartItems = updatedCart.map(function(item){
            return {
                product_id: item.product_id,
                quantity: item.quantity
            }
        });

       try {
         await axios.put(
             API_URL + "/cart",
             {
                 cartItems
             },
             {
                 headers: {
                     Authorization: "Bearer " + jwt
                 }
             }
         );

       } catch (error) {
            showFlashMessage("Error updating shopping cart", danger);
            console.error(error.message);
       }
    }

    return {
        cart, getCartTotal, addToCart, removeFromCart, 
        modifyQuantity, fetchCart
    }

}
