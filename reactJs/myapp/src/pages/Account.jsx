import React, { useEffect, useState } from "react";
import { request } from "../require";
import moment from "moment";
import { message } from "antd";
const Account = () => {
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    getList();
  }, []);
  const getList = async () => {
    const res = await request("api/user", "get");
    if (res) {
      setUserData(res.data);
    }
  };
  const handleDelete = async (e) => {
    const res = await request("api/user", "delete", { user_id: e.user_id });
    if (res) {
      message.success("Delete Success");
      getList();
    } else {
      message.error("Cannot delete this account!");
    }
  };
  return (
    <div>
      <div className="w-full flex justify-center">
        <table className="table-fixed w-full">
          <thead className="h-[60px] border-b bg-blue-500 text-white border-b-gray-300  xl:text-lg lg:text-md sm:text-sm text-xs">
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Description</th>
              <th>Permission</th>
              <th className="mt-4 xl:block items-center lg:block md:block sm:block hidden">
                Date
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((e, index) => (
              <tr
                key={e.user_id}
                className="h-[60px] border border-b-gray-300 text-center hover:bg-slate-100 duration-200 xl:text-lg lg:text-md sm:text-sm text-xs"
              >
                <td>{e.firstname + " " + e.lastname}</td>
                <td>{e.role_name}</td>
                <td>{e.description}</td>
                <td>{e.permission}</td>
                <td className="mt-4 xl:block items-center lg:block md:block sm:block hidden">
                  {moment(e.create_at).format("DD/MMM/YYYY")}
                </td>
                <td>
                  <button
                    className="w-[60px] h-[40px] bg-rose-500 text-sm text-white rounded-md"
                    onClick={() => handleDelete(e)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Account;
