import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import LoginLayout from "./Layout/LoginLayout";
import Dashboard from "./Layout/Dashboard";
import Overview from "./pages/Overview";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Pos from "./pages/Pos";
import Account from "./pages/Account";
import Customer from "./pages/Customer";
import InvoiceDetail from "./pages/InvoiceDetail";
import InvoiceRecord from "./pages/InvoiceRecord";
const App = () => {
  const initialRoute = [
    {
      path: "/login",
      element: <LoginLayout />,
      children: [
        {
          index: true,
          element: <Login />,
        },
      ],
    },
    {
      path: "/",
      element: <Dashboard />,
      children: [
        {
          index: true,
          element: <Overview />,
        },
        {
          path: "category",
          element: <Category />,
        },
        {
          path: "product",
          element: <Product />,
        },
        {
          path: "account",
          element: <Account />,
        },
        {
          path: "pos",
          element: <Pos />,
        },
        {
          path: "customer",
          element: <Customer />,
        },
        {
          path: "pos/:id",
          element: <InvoiceDetail />,
        },
        {
          path: "invoice",
          element: <InvoiceRecord />,
        },
      ],
    },
  ];
  const [route, setRoute] = useState(initialRoute);
  useEffect(() => {
    // Fetch user role from local storage or API
    var userRole = localStorage.getItem("account");
    userRole = JSON.parse(userRole);
    // Modify route configuration based on user role
    if (userRole) {
      if (userRole.role_name === "Cashier") {
        // Filter out all routes except the "Order" route under "/pos"
        const modifiedRoutes = initialRoute.map((route) => {
          if (route.path === "/") {
            return {
              ...route,
              children: route.children.filter(
                (child) =>
                  child.path === "pos" ||
                  child.path === "category" ||
                  child.path === "product" ||
                  child.path === "pos/:id" ||
                  child.path === "invoice"
              ),
            };
          }
          return route;
        });
        setRoute(modifiedRoutes);
      }
      if (userRole.role_name === "Admin") {
        setRoute(initialRoute);
      }
    } else {
      setRoute(initialRoute);
    }
  }, []);

  return (
    <>
      <RouterProvider router={createBrowserRouter(route)} />
    </>
  );
};

export default App;
