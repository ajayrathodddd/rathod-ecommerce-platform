import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { Container } from "react-bootstrap";
import Home from "./components/Home";
import Footer from "./components/Footer";
import SignupScreen from "./components/screens/SignupScreen";
import LoginScreen from "./components/screens/LoginScreen";
import ProductDetails from "./components/screens/ProductDetails";
import CartScreen from "./components/screens/CartScreen";
import ShippingScreen from "./components/screens/ShippingScreen";
import PlaceOrderScreen from "./components/screens/PlaceOrderScreen";
import PaymentScreen from "./components/screens/PaymentScreen";
import OrderScreen from "./components/screens/OrderScreen";
import ProductListScreen from "./components/screens/ProductListScreen";
import ProductEditScreen from "./components/screens/ProductEditScreen";
import OrderListScreen from "./components/screens/OrderListScreen";
import UserListScreen from "./components/screens/UserListScreen";
import UserEditScreen from "./components/screens/UserEditScreen";
import ProfileScreen from "./components/screens/ProfileScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            {/* User & Auth Routes */}
            <Route path="/" element={<LoginScreen />} />{" "}
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            {/* Product & Shopping Routes */}
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart/:id?" element={<CartScreen />} />
            <Route path="/checkout" element={<ShippingScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            {/* Admin Routes */}
            <Route path="/admin/userlist" element={<UserListScreen />} />
            <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
            <Route path="/admin/productList" element={<ProductListScreen />} />
            <Route
              path="/admin/product/:id/edit"
              element={<ProductEditScreen />}
            />
            <Route path="/admin/orderlist" element={<OrderListScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
