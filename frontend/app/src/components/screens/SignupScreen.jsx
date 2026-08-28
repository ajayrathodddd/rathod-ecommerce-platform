import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import { signup } from "../../actions/userActions"; // 1. Added import for signup action

function SignupScreen() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Read userSignup or userLogin state
  const userSignup = useSelector((state) => state.userSignup || state.userLogin) || {};
  const { loading, error, userInfo } = userSignup;

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else if (!agreeTerms) {
      setMessage("Please agree to terms and conditions");
    } else {
      setMessage("");
      // 2. Dispatched the signup action
      dispatch(signup(fname, lname, email, password));
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={3}></Col>
        <Col md={6}>
          <Form onSubmit={submitHandler}>
            <br />
            <h3 className="text-center">SIGNUP HERE</h3>

            {message && <Message variant="danger">{message}</Message>}
            {error && <Message variant="danger">{error}</Message>}
            {loading && <Loader />}

            {/* First Name */}
            <Form.Group controlId="firstname" className="my-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your first name"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                required
              />
            </Form.Group>

            {/* Last Name */}
            <Form.Group controlId="lastname" className="my-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your last name"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                required
              />
            </Form.Group>

            {/* Email Address */}
            <Form.Group controlId="email" className="my-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            {/* Password */}
            <Form.Group controlId="password" className="my-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group controlId="confirmPassword" className="my-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            {/* Terms & Conditions Checkbox */}
            <Form.Group controlId="agreeTerms" className="my-3">
              <Form.Check
                type="checkbox"
                label="Agree to terms and conditions"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="success" className="my-3">
              SIGNUP
            </Button>
          </Form>

          <Row className="py-2">
            <Col>
              Have an Account? <Link to="/login">Login</Link>
            </Col>
          </Row>
        </Col>
        <Col md={3}></Col>
      </Row>
    </Container>
  );
}

export default SignupScreen;