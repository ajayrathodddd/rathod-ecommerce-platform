import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form, Table } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import Message from '../Message';
import { getUserDetails, updateUserProfile } from '../../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import { listMyOrders } from '../../actions/orderActions';
import { LinkContainer } from 'react-router-bootstrap';

function ProfileScreen() {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClose = () => setMessage('');

    const userDetails = useSelector((state) => state.userDetails);
    const { error, loading, user } = userDetails || {};

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin || {};

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { success } = userUpdateProfile || {};

    const orderMyList = useSelector((state) => state.orderMyList);
    const { loading: loadingOrders, error: errorOrders, orders } = orderMyList || {};

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            // Check if profile details need to be fetched or refreshed
            if (!user || !user.first_name || success) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET });
                dispatch(getUserDetails('profile')); // Pass 'profile' endpoint
                dispatch(listMyOrders()); // Call without arguments
            } else {
                setFname(user.first_name || '');
                setLname(user.last_name || '');
            }
        }
    }, [dispatch, navigate, userInfo, user, success]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            dispatch(
                updateUserProfile({
                    id: user._id,
                    fname: fname,
                    lname: lname,
                    password: password,
                })
            );
            setMessage('');
        }
    };

    return (
        <Row className="mt-4">
            <Col md={3}>
                <h2>User Profile</h2>

                {message && <Message variant="danger" onClose={handleClose}>{message}</Message>}
                {error && <Message variant="danger" onClose={handleClose}>{error}</Message>}
                {loading && <Loader />}

                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="fname" className="my-2">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter First name"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="lname" className="my-2">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter Last name"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="password" className="my-2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="passwordConfirm" className="my-2">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="mt-3">
                        Update
                    </Button>
                </Form>
            </Col>

            <Col md={9}>
                <h2>My Orders</h2>
                {loadingOrders ? (
                    <Loader />
                ) : errorOrders ? (
                    <Message variant="danger" onClose={handleClose}>{errorOrders}</Message>
                ) : (
                    <Table striped responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders && orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt ? order.createdAt.substring(0, 10) : ''}</td>
                                    <td>Rs {order.totalPrice}</td>
                                    <td>
                                        {order.isPaid ? (
                                            order.paidAt.substring(0, 10)
                                        ) : (
                                            <i className="fas fa-times" style={{ color: 'red' }}></i>
                                        )}
                                    </td>
                                    <td>
                                        {order.isDelivered ? (
                                            order.deliveredAt.substring(0, 10)
                                        ) : (
                                            <i className="fas fa-times" style={{ color: 'red' }}></i>
                                        )}
                                    </td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button className="btn-sm">Details</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    );
}

export default ProfileScreen;