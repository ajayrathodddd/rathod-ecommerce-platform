
import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Message";
import Loader from "../Loader";
import {
  getOrderDetails,
  deliverOrder,
} from "../../actions/orderActions";

function OrderScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");

  const handleClose = () => setMessage(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    success: successDeliver,
  } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Calculate items price safely
  if (!loading && !error && order) {
    order.itemsPrice = order.orderItems
      .reduce(
        (acc, item) =>
          acc + Number(item.price || 0) * Number(item.qty || 0),
        0
      )
      .toFixed(2);
  }

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      dispatch(getOrderDetails(id));
    }
  }, [id, dispatch, userInfo, navigate]);

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  // Convert backend image path into a working URL
  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `https://rathod-ecommerce-platform.onrender.com${image}`;
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger" onClose={handleClose}>
      {error}
    </Message>
  ) : (
    <div>
      <h1 className="mt-4">Order ID : {id}</h1>

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">

            {/* Shipping */}
            <ListGroup.Item>
              <h2>Shipping</h2>

              <p>
                <strong>Name: </strong>
                {order.user?.name}
              </p>

              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user?.email}`}>
                  {order.user?.email}
                </a>
              </p>

              <p>
                <strong>Shipping: </strong>
                {order.shippingAddress?.address},{" "}
                {order.shippingAddress?.city}{" "}
                {order.shippingAddress?.postalCode},{" "}
                {order.shippingAddress?.country}
              </p>

              {order.isDelivered ? (
                <Message
                  variant="success"
                  onClose={handleClose}
                >
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message
                  variant="warning"
                  onClose={handleClose}
                >
                  Not Delivered
                </Message>
              )}
            </ListGroup.Item>

            {/* Payment */}
            <ListGroup.Item>
              <h2>Payment Method</h2>

              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message
                  variant="success"
                  onClose={handleClose}
                >
                  Paid on {order.paidAt}
                </Message>
              ) : (
                <Message
                  variant="warning"
                  onClose={handleClose}
                >
                  Not Paid
                </Message>
              )}
            </ListGroup.Item>

            {/* Order Items */}
            <ListGroup.Item>
              <h2>Order Items</h2>

              {order.orderItems.length === 0 ? (
                <Message
                  variant="info"
                  onClose={handleClose}
                >
                  Order is empty
                </Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>

                        {/* Product Image */}
                        <Col md={1}>
                          <Image
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        {/* Product Name */}
                        <Col>
                          <Link
                            to={`/product/${item.product}`}
                          >
                            {item.name}
                          </Link>
                        </Col>

                        {/* Price */}
                        <Col md={4}>
                          {item.qty} X Rs{" "}
                          {Number(item.price || 0).toFixed(2)}
                          {" = "}
                          Rs
                          {(
                            Number(item.qty || 0) *
                            Number(item.price || 0)
                          ).toFixed(2)}
                        </Col>

                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Order Summary */}
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">

              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>RS {order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>Rs {order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>Rs {order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>Rs {order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

            </ListGroup>

            {loadingDeliver && <Loader />}

            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderScreen;

