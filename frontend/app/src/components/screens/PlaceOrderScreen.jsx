
import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
} from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CheckoutSteps from "../CheckoutSteps";
import Message from "../Message";

import { createOrder } from "../../actions/orderActions";
import { ORDER_CREATE_RESET } from "../../constants/orderConstants";


// ======================================================
// BACKEND API URL
// ======================================================

const API_URL = "https://rathod-ecommerce-platform.onrender.com";


function PlaceOrderScreen() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");


  // ======================================================
  // CLOSE MESSAGE
  // ======================================================

  const handleClose = () => {
    setMessage("");
  };


  // ======================================================
  // ORDER CREATE STATE
  // ======================================================

  const orderCreate = useSelector(
    (state) => state.orderCreate || {}
  );

  const {
    order,
    error,
    success,
    loading,
  } = orderCreate;


  // ======================================================
  // CART
  // ======================================================

  const cart = useSelector(
    (state) => state.cart || {}
  );

  const {
    cartItems = [],
    shippingAddress = {},
    paymentMethod = "Cash on Delivery",
  } = cart;


  // ======================================================
  // PRICE CALCULATIONS
  // ======================================================

  const itemsPriceNumber = cartItems.reduce(
    (acc, item) => {

      const price = Number(item.price || 0);
      const qty = Number(item.qty || 0);

      return acc + price * qty;

    },
    0
  );


  const itemsPrice = itemsPriceNumber.toFixed(2);


  const shippingPrice = (
    itemsPriceNumber > 10000
      ? 0
      : 100
  ).toFixed(2);


  const taxPrice = (
    itemsPriceNumber * 0.1
  ).toFixed(2);


  const totalPrice = (
    itemsPriceNumber +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);


  // ======================================================
  // PRODUCT IMAGE URL
  // ======================================================

  const getImageUrl = (image) => {

    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API_URL}${image}`;
  };


  // ======================================================
  // ORDER SUCCESS
  // ======================================================

  useEffect(() => {

    if (success && order) {

      const orderId =
        order._id ||
        order.id;

      console.log(
        "Created order:",
        order
      );

      console.log(
        "Order ID:",
        orderId
      );


      if (orderId) {

        dispatch({
          type: ORDER_CREATE_RESET,
        });

        navigate(
          `/order/${orderId}`
        );
      }
    }

  }, [
    success,
    order,
    navigate,
    dispatch,
  ]);


  // ======================================================
  // PLACE ORDER
  // ======================================================

  const placeOrder = () => {

    // Prevent empty cart
    if (cartItems.length === 0) {

      setMessage(
        "Your cart is empty."
      );

      return;
    }


    // Prevent invalid shipping address
    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {

      setMessage(
        "Please complete your shipping address."
      );

      return;
    }


    // Create order data
    const orderData = {

      orderItems: cartItems,

      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },

      paymentMethod:
        paymentMethod ||
        "Cash on Delivery",

      itemsPrice,

      shippingPrice,

      taxPrice,

      totalPrice,
    };


    console.log(
      "Sending order data:",
      orderData
    );


    dispatch(
      createOrder(orderData)
    );
  };


  // ======================================================
  // PAGE
  // ======================================================

  return (

    <>

      <CheckoutSteps
        step1
        step2
        step3
        step4
      />


      <Row>

        {/* ==================================================
            LEFT SIDE
        ================================================== */}

        <Col md={8}>

          <ListGroup variant="flush">


            {/* ==================================================
                SHIPPING
            ================================================== */}

            <ListGroup.Item>

              <h2>
                Shipping
              </h2>


              <p>

                <strong>
                  Shipping:
                </strong>{" "}

                {shippingAddress.address},{" "}

                {shippingAddress.city},{" "}

                {shippingAddress.postalCode},{" "}

                {shippingAddress.country}

              </p>

            </ListGroup.Item>


            {/* ==================================================
                PAYMENT
            ================================================== */}

            <ListGroup.Item>

              <h2>
                Payment Method
              </h2>


              <p>

                <strong>
                  Method:
                </strong>{" "}

                {paymentMethod ||
                  "Cash on Delivery"}

              </p>

            </ListGroup.Item>


            {/* ==================================================
                ORDER ITEMS
            ================================================== */}

            <ListGroup.Item>

              <h2>
                Order Items
              </h2>


              {cartItems.length === 0 ? (

                <Message
                  variant="info"
                  onClose={handleClose}
                >
                  Your cart is empty.
                </Message>

              ) : (

                <ListGroup variant="flush">

                  {cartItems.map(
                    (item) => (

                      <ListGroup.Item
                        key={item.product}
                      >

                        <Row>


                          {/* PRODUCT IMAGE */}

                          <Col md={1}>

                            <Image
                              src={getImageUrl(
                                item.image
                              )}
                              alt={item.name}
                              fluid
                              rounded
                            />

                          </Col>


                          {/* PRODUCT NAME */}

                          <Col>

                            <Link
                              to={`/product/${item.product}`}
                            >
                              {item.name}
                            </Link>

                          </Col>


                          {/* PRODUCT PRICE */}

                          <Col md={4}>

                            {Number(
                              item.qty || 0
                            )}{" "}

                            X{" "}

                            Rs.{" "}

                            {Number(
                              item.price || 0
                            ).toFixed(2)}

                            {" = "}

                            Rs.{" "}

                            {(
                              Number(
                                item.qty || 0
                              ) *

                              Number(
                                item.price || 0
                              )
                            ).toFixed(2)}

                          </Col>

                        </Row>

                      </ListGroup.Item>

                    )
                  )}

                </ListGroup>

              )}

            </ListGroup.Item>

          </ListGroup>

        </Col>


        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <Col md={4}>

          <Card>

            <ListGroup variant="flush">


              {/* ORDER SUMMARY */}

              <ListGroup.Item>

                <h2>
                  Order Summary
                </h2>

              </ListGroup.Item>


              {/* ITEMS */}

              <ListGroup.Item>

                <Row>

                  <Col>
                    Items:
                  </Col>

                  <Col>
                    Rs. {itemsPrice}
                  </Col>

                </Row>

              </ListGroup.Item>


              {/* SHIPPING */}

              <ListGroup.Item>

                <Row>

                  <Col>
                    Shipping:
                  </Col>

                  <Col>
                    Rs. {shippingPrice}
                  </Col>

                </Row>

              </ListGroup.Item>


              {/* TAX */}

              <ListGroup.Item>

                <Row>

                  <Col>
                    Tax:
                  </Col>

                  <Col>
                    Rs. {taxPrice}
                  </Col>

                </Row>

              </ListGroup.Item>


              {/* TOTAL */}

              <ListGroup.Item>

                <Row>

                  <Col>
                    <strong>
                      Total:
                    </strong>
                  </Col>

                  <Col>

                    <strong>
                      Rs. {totalPrice}
                    </strong>

                  </Col>

                </Row>

              </ListGroup.Item>


              {/* LOCAL MESSAGE */}

              {message && (

                <ListGroup.Item>

                  <Message
                    variant="warning"
                    onClose={handleClose}
                  >
                    {message}
                  </Message>

                </ListGroup.Item>

              )}


              {/* SERVER ERROR */}

              {error && (

                <ListGroup.Item>

                  <Message
                    variant="danger"
                    onClose={handleClose}
                  >
                    {error}
                  </Message>

                </ListGroup.Item>

              )}


              {/* PLACE ORDER */}

              <ListGroup.Item>

                <Button
                  type="button"
                  className="btn-block"
                  disabled={
                    cartItems.length === 0 ||
                    loading
                  }
                  onClick={placeOrder}
                >

                  {loading
                    ? "Placing Order..."
                    : "Place Order"}

                </Button>

              </ListGroup.Item>


            </ListGroup>

          </Card>

        </Col>

      </Row>

    </>

  );
}


export default PlaceOrderScreen;

