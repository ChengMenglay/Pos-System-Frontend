import React, { useState } from "react";
import { request } from "../require";
import { message } from "antd";
const CreateCustomer = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSumit = async (e) => {
    e.preventDefault();
    const data = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      confirm_password: confirmPassword,
    };
    const res = await request("api/user/signup", "post", data);
    if (!firstname) {
      message.error("Please fil in firstname!");
      return false;
    }
    if (!lastname) {
      message.error("Please fil in lastname!");
      return false;
    }
    if (!email) {
      message.error("Please fil in email!");
      return false;
    }
    if (!password) {
      message.error("Please fil in password!");
      return false;
    }
    if (!confirmPassword) {
      message.error("Please fil in Confirm Passwrod!");
      return false;
    }
    if (password != confirmPassword) {
      message.error("Wrong Confirm Password!");
      return false;
    }
    if (res) {
      message.success("Create Success");
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      message.error("Something went wrong!");
      return false;
    }
  };
  return (
    <div>
      <form onSubmit={handleSumit}>
        <div className="mt-10 px-10">
          <div className="w-full flex justify-between relative">
            <input
              type="text"
              className="w-[48%] h-[50px] px-2  border border-[#A8A7A7] outline-none rounded-md"
              placeholder="Firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              type="text"
              className="w-[48%] h-[50px] px-2  border border-[#A8A7A7] outline-none rounded-md"
              placeholder="Lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
          <div className="w-full flex justify-between mt-10">
            <input
              type="text"
              className="w-[48%] h-[50px] px-2  border border-[#A8A7A7] outline-none rounded-md"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              className="w-[48%] h-[50px] px-2  border border-[#A8A7A7] outline-none rounded-md"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <input
            type="text"
            className="w-[48%] h-[50px] px-2 block  border border-[#A8A7A7] outline-none rounded-md mt-10"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="w-[15%] bg-blue-500 mt-10 absolute text-white h-[50px] rounded-md right-10"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomer;
