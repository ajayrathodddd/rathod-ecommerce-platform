import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../actions/userActions';
function LoginScreen() {
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    email: null,
    password: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target (defaults to home page "/")
  const redirect = location.search ? location.search.split('=')[1] : '/';

  // Read login state from Redux store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, loading, error } = userLogin || {};

  // REDIRECT EFFECT: When userInfo becomes available, navigate to Home
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormValues = { ...formValues, [name]: value };

    setFormValues(newFormValues);
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMessage = null;

    switch (name) {
      case 'email': {
        if (!value) {
          errorMessage = 'Email is required.';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) errorMessage = 'Invalid email format.';
        }
        break;
      }

      case 'password':
        if (!value) {
          errorMessage = 'Password is required.';
        }
        break;

      default:
        break;
    }

    setFormErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const isFormValid = () => {
    return (
      formValues.email !== '' &&
      formValues.password !== '' &&
      formErrors.email === null &&
      formErrors.password === null
    );
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      // Dispatch the Redux login action
      dispatch(login(formValues.email, formValues.password));
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">LOGIN HERE</h2>

          {/* Display server error if authentication fails */}
          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <div className="text-center mb-3">Loading...</div>}

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={formValues.email}
                onChange={handleChange}
                isValid={formValues.email !== '' && formErrors.email === null}
                isInvalid={!!formErrors.email}
              />
              {formErrors.email && (
                <Form.Control.Feedback type="invalid">
                  {formErrors.email}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="••••••"
                value={formValues.password}
                onChange={handleChange}
                isValid={formValues.password !== '' && formErrors.password === null}
                isInvalid={!!formErrors.password}
              />
              {formErrors.password && (
                <Form.Control.Feedback type="invalid">
                  {formErrors.password}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Button
              type="submit"
              variant="success"
              className="mt-4 w-100"
              disabled={!isFormValid() || loading}
            >
              LOGIN
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginScreen;