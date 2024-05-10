import React, { createContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { BiSolidFileFind } from "react-icons/bi";
import { TbCategoryFilled } from "react-icons/tb";
import { Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { FaBoxOpen, FaCartShopping, FaUsers, FaXmark } from "react-icons/fa6";
import { FaBars, FaFileInvoice } from "react-icons/fa";
import posImage from "../assets/pos-software.png";
export const ThemeContext = createContext(null);
const Dashboard = () => {
  const [checkLogout, setCheckLogout] = useState(false);
  const [spin, setSpin] = useState(false);
  const [openBar, setOpenBar] = useState(false);
  var profile = localStorage.getItem("account");
  const navigate = useNavigate();
  if (profile == null) {
    useEffect(() => {
      navigate("/login");
    }, [profile]);
  } else {
    profile = JSON.parse(profile);
  }
  const handleLogout = () => {
    setSpin(false);
    setTimeout(() => {
      setCheckLogout(false);
      localStorage.removeItem("account");
      navigate("/login");
    }, 3000);
  };
  if (!profile) {
    return (profile = null);
  }
  const configpathCashier = [
    { path: "/category", name: "Category", icon: <TbCategoryFilled /> },
    { path: "/product", name: "Product", icon: <FaBoxOpen /> },
    { path: "/pos", name: "Order", icon: <FaCartShopping /> },
    { path: "/invoice", name: "Invoice", icon: <FaFileInvoice /> },
  ];
  const configpathAdmin = [
    { path: "/", name: "Overview", icon: <BiSolidFileFind /> },
    { path: "/category", name: "Category", icon: <TbCategoryFilled /> },
    { path: "/product", name: "Product", icon: <FaBoxOpen /> },
    { path: "/pos", name: "Order", icon: <FaCartShopping /> },
    { path: "/invoice", name: "Invoice", icon: <FaFileInvoice /> },
    { path: "/account", name: "Account", icon: <FaUsers /> },
  ];
  if (profile.role_name === "Cashier") {
    return (
      <>
        <div
          className={
            !openBar
              ? "xl:w-[300px] xl:block  lg:w-[300px] lg:block md:w-[300px] md:hidden sm:w-[220px] sm:hidden h-[100vh] w-[200px] hidden fixed left-0 top-[0] bg-white  shadow-xl"
              : " md:w-[300px] md:block sm:w-[300px] sm:block h-[100vh] w-[300px] fixed left-0 top-[0] bg-white  shadow-xl"
          }
        >
          <FaXmark
            className="xl:hidden lg:hidden md:block sm:block block text-xl absolute right-3 top-3 cursor-pointer"
            onClick={() => setOpenBar(false)}
          />
          <div className="h-[100px] flex items-center px-5">
            <img
              src={posImage}
              alt="PosImage"
              className="w-[60px] h-[60px] rounded-full object-cover"
            />
            <h1 className="text-xl font-bold mx-3">Point Of Sales</h1>
          </div>

          <ul>
            {configpathCashier.map((e, index) => (
              <Link key={index} to={e.path}>
                <li className=" h-[60px] flex items-center rounded-xl text-xl  hover:bg-[rgba(233,233,233)] duration-150">
                  <span className="mx-5">{e.icon}</span>
                  {e.name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="h-[80px] flex xl:justify-end lg:justify-end md:justify-between sm:justify-between justify-between items-center px-5 bg-[rgba(233,233,233)]">
          <div className="xl:hidden lg:hidden md:block sm:block block cursor-pointer">
            <FaBars onClick={() => setOpenBar(true)} />
          </div>
          <h1 className="text-md flex items-center justify-center px-5 h-[40px] bg-green-400 text-white rounded-lg mx-5">
            <span className="font-bold">{profile.role_name}</span>:{" "}
            {profile.firstname + " " + profile.lastname}{" "}
          </h1>
          <Modal
            footer={null}
            open={checkLogout}
            onCancel={() => {
              setSpin(false);
              setCheckLogout(false);
            }}
            title={"Are you sure! You want to logout account."}
          >
            <div className="flex justify-end">
              <button
                className="w-[100px] h-[40px] bg-red-700 text-white rounded-lg mt-3"
                onClick={handleLogout}
              >
                {checkLogout && !spin ? (
                  <div className="flex items-center justify-center">
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 30,
                            marginRight: 3,
                            color: "white",
                          }}
                          spin
                        />
                      }
                    />
                    <h1 className="mx-2">Logout</h1>
                  </div>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          </Modal>
          <button
            className="w-[100px] h-[40px] bg-red-500 text-white rounded-md"
            onClick={() => {
              setSpin(true);
              setTimeout(() => {
                setCheckLogout(true);
              }, 1500);
            }}
          >
            {!checkLogout && spin ? (
              <div>
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{
                        fontSize: 30,
                        marginRight: 3,
                        color: "white",
                      }}
                      spin
                    />
                  }
                />
                Logout
              </div>
            ) : (
              "Logout"
            )}
          </button>
        </div>
        <div className="min-h-[70vh] shadow-md xl:ml-[300px] lg:ml-[300px] overflow-hidden">
          <ThemeContext.Provider value={profile}>
            <Outlet />
          </ThemeContext.Provider>
        </div>
      </>
    );
  }
  if (profile.role_name === "Admin") {
    return (
      <>
        <div
          className={
            !openBar
              ? "xl:w-[300px] xl:block  lg:w-[300px] lg:block md:w-[300px] md:hidden sm:w-[220px] sm:hidden h-[100vh] w-[200px] hidden fixed left-0 top-[0] bg-white  shadow-xl"
              : " md:w-[300px] md:block sm:w-[300px] sm:block h-[100vh] w-[300px] fixed left-0 top-[0] bg-white  shadow-xl"
          }
        >
          <FaXmark
            className="xl:hidden lg:hidden md:block sm:block block text-xl absolute right-3 top-3 cursor-pointer"
            onClick={() => setOpenBar(false)}
          />
          <div className="h-[100px] flex items-center px-5">
            <img
              src={posImage}
              alt="PosImage"
              className="w-[60px] h-[60px] rounded-full object-cover"
            />
            <h1 className="text-xl font-bold mx-3">Point Of Sales</h1>
          </div>

          <ul>
            {configpathAdmin.map((e, index) => (
              <Link key={index} to={e.path}>
                <li className=" h-[60px] flex items-center rounded-xl text-xl  hover:bg-[rgba(233,233,233)] duration-150">
                  <span className="mx-5">{e.icon}</span>
                  {e.name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="h-[80px] flex xl:justify-end lg:justify-end md:justify-between sm:justify-between justify-between items-center px-5 bg-[rgba(233,233,233)]">
          <div className="xl:hidden lg:hidden md:block sm:block block cursor-pointer">
            <FaBars onClick={() => setOpenBar(true)} />
          </div>
          <h1 className="text-lg flex items-center justify-center px-5 h-[40px] bg-green-400 text-white rounded-lg mx-5">
            <span className="font-bold">{profile.role_name}</span>:{" "}
            {profile.firstname + " " + profile.lastname}{" "}
          </h1>
          <Modal
            footer={null}
            open={checkLogout}
            onCancel={() => {
              setSpin(false);
              setCheckLogout(false);
            }}
            title={"Are you sure! You want to logout account."}
          >
            <div className="flex justify-end">
              <button
                className="w-[100px] h-[40px] bg-red-700 text-white rounded-lg mt-3"
                onClick={handleLogout}
              >
                {checkLogout && !spin ? (
                  <div className="flex items-center justify-center">
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 30,
                            marginRight: 3,
                            color: "white",
                          }}
                          spin
                        />
                      }
                    />
                    <h1 className="mx-2">Logout</h1>
                  </div>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          </Modal>
          <button
            className="w-[100px] h-[40px] bg-red-500 text-white rounded-md"
            onClick={() => {
              setSpin(true);
              setTimeout(() => {
                setCheckLogout(true);
              }, 1500);
            }}
          >
            {!checkLogout && spin ? (
              <div>
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{
                        fontSize: 30,
                        marginRight: 3,
                        color: "white",
                      }}
                      spin
                    />
                  }
                />
                Logout
              </div>
            ) : (
              "Logout"
            )}
          </button>
        </div>
        <div className="min-h-[70vh] shadow-md xl:ml-[300px] lg:ml-[300px] overflow-hidden">
          <ThemeContext.Provider value={profile}>
            <Outlet />
          </ThemeContext.Provider>
        </div>
      </>
    );
  }
};

export default Dashboard;
