import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Message';
import Loader from '../Loader';
import FormContainer from '../FormContainer';
import { USER_UPDATE_RESET } from '../../constants/userConstants';
import { updateUser, getUserDetails } from '../../actions/userActions';

function UserEditScreen() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [fname, setFname] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const userDetails = useSelector((state) => state.userDetails);
    const { error, loading, user } = userDetails || {};

    const userUpdate = useSelector((state) => state.userUpdate);
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = userUpdate || {};

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET });
            navigate('/admin/userlist');
        } else {
            if (!user || user._id !== Number(id)) {
                dispatch(getUserDetails(id));
            } else {
                setFname(user.first_name || user.name || '');
                setEmail(user.email || user.username || '');
                setIsAdmin(user.isAdmin || false);
            }
        }
    }, [dispatch, navigate, id, user, successUpdate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            updateUser({
                _id: user._id,
                fname: fname,
                name: fname,
                email: email,
                isAdmin: isAdmin,
            })
        );
    };

    return (
        <div className="my-3">
            <Link to="/admin/userlist">
                <Button variant="dark" className="my-3">
                    Go Back
                </Button>
            </Link>

            <FormContainer>
                <h1>Edit User</h1>

                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">{error}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name" className="my-2">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="email" className="my-2">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="isadmin" className="my-3">
                            <Form.Check
                                type="checkbox"
                                label="Is Admin"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary" className="mt-2">
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </div>
    );
}

export default UserEditScreen;
