import React from "react";
import Home from "../pages/Home";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default MainLayout;
