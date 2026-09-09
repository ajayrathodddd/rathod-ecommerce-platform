
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {
    listProductDetails,
    updateProduct
} from '../../actions/ProductAction'
import {
    PRODUCT_UPDATE_RESET
} from '../../constants/ProductConstants'
import FormContainer from '../FormContainer'
import Loader from '../Loader'
import Message from '../Message'
import axios from 'axios'

function ProductEditScreen() {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [rating, setRating] = useState(0)
    const [numReviews, setNumReviews] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)

    const productDetails = useSelector((state) => state.productDetails)
    const { error, loading, product } = productDetails || {}

    const productUpdate = useSelector((state) => state.productUpdate)
    const {
        error: errorUpdate,
        loading: loadingUpdate,
        success: successUpdate
    } = productUpdate || {}

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET })
            navigate('/admin/productlist')
        } else {
            if (
                !product ||
                !product.name ||
                String(product._id) !== String(id)
            ) {
                dispatch(listProductDetails(id))
            } else {
                setName(product.name || '')
                setPrice(product.price || 0)
                setImage(product.image || '')
                setBrand(product.brand || '')
                setCategory(product.category || '')
                setCountInStock(product.countInStock || 0)
                setRating(product.rating || 0)
                setNumReviews(product.numReviews || 0)
                setDescription(product.description || '')
            }
        }
    }, [dispatch, navigate, id, product, successUpdate])

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        const formData = new FormData()

        formData.append('image', file)
        formData.append('product_id', id)

        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }

            const { data } = await axios.post(
                'https://rathod-ecommerce-platform.onrender.com/api/products/upload/',
                formData,
                config
            )

            setImage(data)
            setUploading(false)
        } catch (err) {
            console.error(err)
            setUploading(false)
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()

        dispatch(
            updateProduct({
                _id: id,
                name,
                price: Number(price),
                image,
                brand,
                category,
                countInStock: Number(countInStock),
                rating: Number(rating),
                numReviews: Number(numReviews),
                description,
            })
        )
    }

    return (
        <div className="my-3">

            <Link to="/admin/productlist">
                <Button variant="dark" className="my-3">
                    Go Back
                </Button>
            </Link>

            <FormContainer>

                <h1>Edit Product</h1>

                {loadingUpdate && <Loader />}

                {errorUpdate && (
                    <Message variant="danger">
                        {errorUpdate}
                    </Message>
                )}

                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">
                        {error}
                    </Message>
                ) : (
                    <Form onSubmit={submitHandler}>

                        <Form.Group controlId="name" className="my-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="price" className="my-2">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="image" className="my-2">
                            <Form.Label>Image</Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="Enter image URL"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />

                            <Form.Control
                                type="file"
                                className="mt-2"
                                onChange={uploadFileHandler}
                            />

                            {uploading && <Loader />}
                        </Form.Group>

                        <Form.Group controlId="brand" className="my-2">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="countinstock" className="my-2">
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter stock count"
                                value={countInStock}
                                onChange={(e) =>
                                    setCountInStock(e.target.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="category" className="my-2">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter category"
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="rating" className="my-2">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.1"
                                placeholder="Enter rating"
                                value={rating}
                                onChange={(e) =>
                                    setRating(e.target.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="numReviews" className="my-2">
                            <Form.Label>Number of Reviews</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter number of reviews"
                                value={numReviews}
                                onChange={(e) =>
                                    setNumReviews(e.target.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="description" className="my-2">
                            <Form.Label>Description</Form.Label>

                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                            />
                        </Form.Group>

                        <Button
                            type="submit"
                            variant="primary"
                            className="mt-3"
                        >
                            Update
                        </Button>

                    </Form>
                )}

            </FormContainer>

        </div>
    )
}

export default ProductEditScreen

