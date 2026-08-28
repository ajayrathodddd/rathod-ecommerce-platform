import React, { useEffect,useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
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
import Message from "../Message";
import { addToCart, removeFromCart } from "../../actions/cartActions";
import { useDispatch, useSelector } from "react-redux";


function CartScreen({ params }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('')
  const handleClose = () => setMessage(false);
  const productId = id;
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHadler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler=()=>{
    navigate("/checkout")
  }

  return (
    <>
      <Row>
        <Col md={8}>
          <Container>
            <h1 className="mt-3">Cart Items</h1>

            {cartItems.length === 0 ? (
              <Message variant="info" onClose={handleClose}>
                Your cart is empty <Link to="/">Go Back</Link>
              </Message>
            ) : (
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.product}>
                    <Row>
                      <Col md={2}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fluid
                          rounded
                        />
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item.product}`}>
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={2}>Rs {item.price}</Col>

                      <Col md={1}>
                        <Badge bg="secondary">Qty: {item.qty}</Badge>
                      </Col>

                      <Col md={1}>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => removeFromCartHadler(item.product)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Container>
        </Col>

        <Col md={4}>
          <Card className="mt-3">
            <ListGroup variant="flush">
              <ListGroup.Item className="mt-4">
                <h6>
                  Total Qty : (
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                </h6>
                <hr />
                <strong>
                  {" "}
                  Rs.{" "}
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </strong>
              </ListGroup.Item>

              <ListGroup.Item>
              <Button
                type="button"
                className="btn-block btn-success mt-3"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              
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
