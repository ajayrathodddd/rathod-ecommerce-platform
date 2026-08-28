import React from "react";
import { Form, Button, Col } from "react-bootstrap";
import {  useSelector } from "react-redux";
import CheckoutSteps from "../CheckoutSteps";
import FormContainer from "../FormContainer";
import {  useNavigate,  } from "react-router-dom";

function PaymentScreen() {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress.address) {
    navigate("/shipping");
  }

  const submitHandler=(e)=>{
    e.preventDefault()
    navigate('/placeorder')
  }

  return (
    <div>
      <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <Form onSubmit={submitHandler}>
          <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
                        <Form.Check
                            type='radio'
                            label='Cash on Delivery'
                            checked
                          
                        >

                        </Form.Check>
                    </Col>
          </Form.Group>
          <Button type='submit' variant='primary'>
                    Continue
                </Button>
        </Form>
      </FormContainer>
    </div>
  );
}

export default PaymentScreen;
