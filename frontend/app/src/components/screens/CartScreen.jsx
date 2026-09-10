
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Container,
  Badge,
} from "react-bootstrap";

import {
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Message from "../Message";

import {
  addToCart,
  removeFromCart,
} from "../../actions/cartActions";


function CartScreen() {

  const { id } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useDispatch();


  const [message, setMessage] = useState("");


  // ======================================================
  // PRODUCT ID
  // ======================================================

  const productId = id;


  // ======================================================
  // QUANTITY
  // ======================================================

  const searchParams = new URLSearchParams(
    location.search
  );

  const qtyFromUrl = Number(
    searchParams.get("qty")
  );

  const qty =
    Number.isFinite(qtyFromUrl) &&
    qtyFromUrl > 0
      ? qtyFromUrl
      : 1;


  // ======================================================
  // CART
  // ======================================================

  const cart = useSelector(
    (state) => state.cart || {}
  );

  const {
    cartItems = [],
  } = cart;


  // ======================================================
  // CLOSE MESSAGE
  // ======================================================

  const handleClose = () => {
    setMessage("");
  };


  // ======================================================
  // ADD PRODUCT TO CART
  // ======================================================

  useEffect(() => {

    if (productId) {

      dispatch(
        addToCart(
          productId,
          qty
        )
      );

    }

  }, [
    dispatch,
    productId,
    qty,
  ]);


  // ======================================================
  // REMOVE PRODUCT
  // ======================================================

  const removeFromCartHandler = (
    productId
  ) => {

    dispatch(
      removeFromCart(
        productId
      )
    );

  };


  // ======================================================
  // CHECKOUT
  // ======================================================

  const checkoutHandler = () => {

    navigate("/checkout");

  };


  // ======================================================
  // TOTAL PRICE
  // ======================================================

  const totalPrice = cartItems.reduce(
    (acc, item) => {

      const price = Number(
        item.price || 0
      );

      const quantity = Number(
        item.qty || 0
      );

      return acc + price * quantity;

    },
    0
  );


  // ======================================================
  // TOTAL QUANTITY
  // ======================================================

  const totalQty = cartItems.reduce(
    (acc, item) => {

      return (
        acc +
        Number(item.qty || 0)
      );

    },
    0
  );


  // ======================================================
  // IMAGE URL
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

    return `https://rathod-ecommerce-platform.onrender.com${image}`;
  };


  // ======================================================
  // PAGE
  // ======================================================

  return (

    <>

      <Row>

        {/* ==================================================
            CART ITEMS
        ================================================== */}

        <Col md={8}>

          <Container>

            <h1 className="mt-3">
              Cart Items
            </h1>


            {message && (

              <Message
                variant="warning"
                onClose={handleClose}
              >
                {message}
              </Message>

            )}


            {cartItems.length === 0 ? (

              <Message
                variant="info"
                onClose={handleClose}
              >

                Your cart is empty{" "}

                <Link to="/home">
                  Go Back
                </Link>

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

                        <Col md={2}>

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

                        <Col md={3}>

                          <Link
                            to={`/product/${item.product}`}
                          >
                            {item.name}
                          </Link>

                        </Col>


                        {/* PRODUCT PRICE */}

                        <Col md={2}>

                          Rs.{" "}

                          {Number(
                            item.price || 0
                          ).toFixed(2)}

                        </Col>


                        {/* QUANTITY */}

                        <Col md={2}>

                          <Badge bg="secondary">

                            Qty:{" "}

                            {Number(
                              item.qty || 0
                            )}

                          </Badge>

                        </Col>


                        {/* REMOVE */}

                        <Col md={1}>

                          <Button
                            type="button"
                            variant="light"
                            onClick={() =>
                              removeFromCartHandler(
                                item.product
                              )
                            }
                          >

                            <i className="fas fa-trash"></i>

                          </Button>

                        </Col>

                      </Row>

                    </ListGroup.Item>

                  )
                )}

              </ListGroup>

            )}

          </Container>

        </Col>


        {/* ==================================================
            CART SUMMARY
        ================================================== */}

        <Col md={4}>

          <Card className="mt-3">

            <ListGroup variant="flush">

              <ListGroup.Item className="mt-4">

                <h6>

                  Total Qty : ({totalQty}) items

                </h6>


                <hr />


                <strong>

                  Rs.{" "}

                  {totalPrice.toFixed(2)}

                </strong>

              </ListGroup.Item>


              <ListGroup.Item>

                <Button
                  type="button"
                  className="btn-block btn-success mt-3"
                  disabled={
                    cartItems.length === 0
                  }
                  onClick={
                    checkoutHandler
                  }
                >

                  Proceed To Checkout

                </Button>

              </ListGroup.Item>

            </ListGroup>

          </Card>

        </Col>

      </Row>

    </>

  );
}


export default CartScreen;

