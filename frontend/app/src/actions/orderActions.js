
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_RESET,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_RESET,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_RESET,
} from "../constants/orderConstants";

import axios from "axios";
import { CART_CLEAR_ITEMS } from "../constants/cartConstants";

const API_URL = "https://rathod-ecommerce-platform.onrender.com";


// ======================================================
// CREATE ORDER
// ======================================================

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_CREATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    if (!userInfo || !userInfo.token) {
      throw new Error(
        "Please login again. Authentication token is missing."
      );
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    console.log("Sending order to backend:");
    console.log(order);

    const { data } = await axios.post(
      `${API_URL}/api/orders/add/`,
      order,
      config
    );

    console.log("Order created successfully:");
    console.log(data);

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });

    dispatch({
      type: CART_CLEAR_ITEMS,
    });

    localStorage.removeItem("cartItems");

  } catch (error) {

    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    console.error(
      "Backend response:",
      error.response?.data
    );

    let errorMessage =
      "Unable to create order.";

    if (error.response?.data) {

      if (typeof error.response.data === "string") {

        errorMessage =
          error.response.data;

      } else if (
        error.response.data.detail
      ) {

        errorMessage =
          error.response.data.detail;

      } else {

        errorMessage =
          JSON.stringify(
            error.response.data
          );
      }

    } else if (error.message) {

      errorMessage =
        error.message;
    }

    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: errorMessage,
    });
  }
};


// ======================================================
// GET ORDER DETAILS
// ======================================================

export const getOrderDetails =
  (id) => async (dispatch, getState) => {

    try {

      dispatch({
        type: ORDER_DETAILS_REQUEST,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      if (!userInfo || !userInfo.token) {

        throw new Error(
          "Please login again. Authentication token is missing."
        );
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_URL}/api/orders/${id}/`,
        config
      );

      dispatch({
        type: ORDER_DETAILS_SUCCESS,
        payload: data,
      });

    } catch (error) {

      console.error(
        "GET ORDER DETAILS ERROR:",
        error
      );

      dispatch({
        type: ORDER_DETAILS_FAIL,
        payload:
          error.response?.data?.detail ||
          error.message ||
          "Unable to get order details.",
      });
    }
  };


// ======================================================
// DELIVER ORDER
// ======================================================

export const deliverOrder =
  (order) => async (dispatch, getState) => {

    try {

      dispatch({
        type: ORDER_DELIVER_REQUEST,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      if (!userInfo || !userInfo.token) {

        throw new Error(
          "Please login again. Authentication token is missing."
        );
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/orders/${order._id}/deliver/`,
        {},
        config
      );

      dispatch({
        type: ORDER_DELIVER_SUCCESS,
        payload: data,
      });

    } catch (error) {

      console.error(
        "DELIVER ORDER ERROR:",
        error
      );

      dispatch({
        type: ORDER_DELIVER_FAIL,
        payload:
          error.response?.data?.detail ||
          error.message ||
          "Unable to deliver order.",
      });
    }
  };


// ======================================================
// LIST ALL ORDERS
// ======================================================

export const listOrders =
  () => async (dispatch, getState) => {

    try {

      dispatch({
        type: ORDER_LIST_REQUEST,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      if (!userInfo || !userInfo.token) {

        throw new Error(
          "Please login again. Authentication token is missing."
        );
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_URL}/api/orders/`,
        config
      );

      dispatch({
        type: ORDER_LIST_SUCCESS,
        payload: data,
      });

    } catch (error) {

      console.error(
        "LIST ORDERS ERROR:",
        error
      );

      dispatch({
        type: ORDER_LIST_FAIL,
        payload:
          error.response?.data?.detail ||
          error.message ||
          "Unable to get orders.",
      });
    }
  };


// ======================================================
// LIST MY ORDERS
// ======================================================

export const listMyOrders =
  () => async (dispatch, getState) => {

    try {

      dispatch({
        type: ORDER_LIST_MY_REQUEST,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      if (!userInfo || !userInfo.token) {

        throw new Error(
          "Please login again. Authentication token is missing."
        );
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_URL}/api/orders/myorders/`,
        config
      );

      dispatch({
        type: ORDER_LIST_MY_SUCCESS,
        payload: data,
      });

    } catch (error) {

      console.error(
        "MY ORDERS ERROR:",
        error
      );

      dispatch({
        type: ORDER_LIST_MY_FAIL,
        payload:
          error.response?.data?.detail ||
          error.message ||
          "Unable to get your orders.",
      });
    }
  };

