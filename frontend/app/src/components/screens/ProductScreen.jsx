import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function ProductScreen({ product }) {
  // Fallback to product.id or product._id
  const productId = product?._id || product?.id;

  return (
    <Card className="my-3 p-3 rounded h-100">
      <Link to={productId ? `/product/${productId}` : "#"}>
        <Card.Img src={product?.image} variant="top" />
      </Link>

      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Link to={productId ? `/product/${productId}` : "#"}>
            <Card.Title as="div">
              <strong>{product?.name}</strong>
            </Card.Title>
          </Link>

          <Card.Text as="div" className="my-2">
            {product?.rating} from {product?.numReviews || product?.numreviews || 0} reviews
          </Card.Text>

          <Card.Text as="h3" className="my-2">
            ${product?.price}
          </Card.Text>
        </div>

        <Link 
          className="btn btn-outline-success mt-2" 
          to={productId ? `/product/${productId}` : "#"}
        >
          View More
        </Link>
      </Card.Body>
    </Card>
  );
}

export default ProductScreen;
