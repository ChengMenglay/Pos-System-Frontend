import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { request } from "../require";
import posImage from "../assets/pos-software.png";
import { message } from "antd";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate("");
  const handleLogin = async () => {
    const data = {
      email: email,
      password: password,
    };
    const res = await request("api/user/login", "post", data);
    if (!email) {
      message.error("Please fil in email!");
      return false;
    }
    if (!password) {
      message.error("Please fil in password!");
      return false;
    }
    if (res && res.message === "Login Success") {
      message.success("Login Success");
      localStorage.setItem("account", JSON.stringify(res));
      localStorage.setItem("accessToken", res.access_token);
      localStorage.setItem("refresh_token",res.refresh_token)
      if (email === "cheng.menglay79@gmail.com") {
        navigate("/");
      } else {
        navigate("/pos");
      }
    } else if (res && res.message === "Email doesn't exist") {
      message.error("Email doesn't exist");
    } else if (res && res.message === "Password Incorrect!") {
      message.error("Password Incorrect!");
    } else {
      message.error("Login Fail, please try again!");
      return false;
    }
  };
  return (
    <div className=" h-screen bg-blue-600 flex justify-center items-center">
      <div className=" w-[450px] h-[430px] shadow-xl bg-white rounded-2xl pt-5 px-7">
        <img
          src={posImage}
          alt="PosImage"
          className="w-[80px] h-[80px] mt-3 rounded-full mx-auto object-cover"
        />
        <h1 className="text-center font-bold text-3xl my-5 font-sans">
          Login Account
        </h1>
        {/* <div className="flex justify-center">
          <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center mx-2 my-3 bg-white border cursor-pointer hover:shadow-xl duration-200">
            <FaFacebookF />
          </div>
          <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center mx-2 my-3  bg-white border cursor-pointer hover:shadow-xl duration-200">
            <FaGoogle />
          </div>
        </div> */}
        {/* <h1 className="text-center text-[#A8A7A7]">or use your account</h1> */}
        <div className="mt-2">
          <input
            type="email"
            className="w-full h-[50px] text-md px-2 mb-5 border border-[#A8A7A7] outline-none rounded-md"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full h-[50px] text-md px-2 border border-[#A8A7A7] outline-none rounded-md"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-blue-500 mt-5 text-white h-[50px] rounded-md"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
