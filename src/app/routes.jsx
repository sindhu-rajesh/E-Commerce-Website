//import React from "react";
import { Navigate } from "react-router-dom";

import ShoppingPage from "../Pages/ShoppingPage";
import MyOrdersPage from "../Pages/MyOrdersPage";
import CartPage from "../Pages/CartPage";
import LoginPage from "../Pages/LoginPage";
import AdminPage from "../Pages/AdminPage";
import ProductPage from "../Pages/ProductPage";

import Dashboard from "../Components/admin-page/dashboard/Dashboard";
import Orders from "../Components/admin-page/orders/OrderList";
import Products from "../Components/admin-page/products/ProductList";

import PrivateRoute from "../Components/shared/PrivateRoute";

// Define routes
const routes = [
  {
    path: "/",
    element: <ShoppingPage />,
  },
  {
    path: "/my-orders",
    element: <MyOrdersPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/admin",
    element: <LoginPage />,
  },
  {
    path: "/product/:id", // More explicit path for product pages
    element: <ProductPage />,
  },
  {
    path: "/admin-page",
    element: (
      <PrivateRoute>
        <AdminPage />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "products",
        element: <Products />,
      },
    ],
  },
  {
    path: "*", // Fallback for unknown routes
    element: <Navigate to="/" replace />,
  },
];

export default routes;
