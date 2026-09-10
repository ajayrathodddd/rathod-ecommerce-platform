
import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_CLEAR_ITEMS,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
} from "../constants/cartConstants";

import axios from "axios";


// ======================================================
// ADD PRODUCT TO CART
// ======================================================

export const addToCart = (id, qty) => async (dispatch, getState) => {

    try {

        const { data } = await axios.get(
            `https://rathod-ecommerce-platform.onrender.com/api/product/${id}/`
        );

        dispatch({
            type: CART_ADD_ITEM,
            payload: {
                product: data._id,
                name: data.name,
                image: data.image,
                price: Number(data.price),
                countInStock: data.countInStock,
                qty: Number(qty),
            },
        });

        localStorage.setItem(
            "cartItems",
            JSON.stringify(getState().cart.cartItems)
        );

    } catch (error) {

        console.error("Error adding product to cart:", error);

        throw error;
    }
};


// ======================================================
// REMOVE PRODUCT FROM CART
// ======================================================

export const removeFromCart = (id) => (dispatch, getState) => {

    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id,
    });

    localStorage.setItem(
        "cartItems",
        JSON.stringify(getState().cart.cartItems)
    );
};


// ======================================================
// CLEAR CART
// ======================================================

export const clearCart = () => (dispatch) => {

    dispatch({
        type: CART_CLEAR_ITEMS,
    });

    localStorage.removeItem("cartItems");
};


// ======================================================
// SAVE SHIPPING ADDRESS
// ======================================================

export const saveShippingAddress = (data) => (dispatch) => {

    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data,
    });

    localStorage.setItem(
        "shippingAddress",
        JSON.stringify(data)
    );
};


// ======================================================
// SAVE PAYMENT METHOD
// ======================================================

export const savePaymentMethod = (data) => (dispatch) => {

    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    });

    localStorage.setItem(
        "paymentMethod",
        JSON.stringify(data)
    );
};

