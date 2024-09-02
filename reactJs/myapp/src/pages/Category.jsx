import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { request } from "../require";
const Category = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isStatus, setIsStatus] = useState("");
  const [isCategoryData, setIsCategoryData] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState();
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    getList();
  }, [searchValue]);
  const getList = async () => {
    var param = "?txtSearch=" + searchValue;
    const res = await request("api/category" + param, "get", {});
    if (res) {
      setIsCategoryData(res.data);
    }
  };
  function handleCancel(e) {
    e.preventDefault();
    setIsOpenModal(false);
    setCategoryName("");
    setIsStatus("");
    setIsUpdate(false);
  }
  const handleFinish = async (e) => {
    e.preventDefault();
    const res = await request(
      "api/category",
      "post",
      {
        category_name: categoryName,
        status: isStatus,
      }
    );
    if (res) {
      message.success("Create Success");
      setCategoryName("");
      setIsStatus("");
      setIsOpenModal(false);
      getList();
    } else {
      setCategoryName("");
      setIsStatus("");
      message.error("Something Went Wrong");
    }
  };
  const editCategory = (e) => {
    const { category_id, category_name, status } = e;
    setIsUpdate(true);
    setCategoryName(category_name);
    setIsStatus(status);
    setUpdateId(category_id);
    setIsOpenModal(true);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await request(
      "api/category",
      "put",
      {
        category_id: updateId,
        category_name: categoryName,
        status: isStatus,
      },
    );
    if (res) {
      message.success("Update Success");
      setCategoryName("");
      setIsStatus("");
      setUpdateId("");
      setIsUpdate(false);
      setIsOpenModal(false);
      getList();
    } else {
      message.error("Something Went Wrong");
    }
  };
  const handleDelete = async (e) => {
    const res = await request(
      "api/category",
      "delete",
      {
        category_id: e.category_id,
      }
    );
    if (res) {
      message.success("Delete Success");
      getList();
    } else {
      message.error("Something Went Wrong");
    }
  };
  return (
    <div>
      <div className="my-5 flex justify-between px-10">
        <input
          type="text"
          placeholder="Search"
          className="w-[350px] h-[50px] border border-gray-500 rounded-lg px-3 outline-none"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          className="px-4 text-white rounded-md bg-blue-600 hover:bg-blue-500 duration-200"
          onClick={() => setIsOpenModal(true)}
        >
          <IoMdAdd />
        </button>
        <Modal
          open={isOpenModal}
          title={!isUpdate ? "New Category" : "Update"}
          onCancel={handleCancel}
          footer={null}
        >
          <form
            onSubmit={!isUpdate ? handleFinish : handleUpdate}
            className="flex flex-col"
          >
            <h1 className="my-3  font-bold">Name</h1>
            <input
              type="text"
              value={categoryName}
              placeholder="Name"
              className="mb-3 h-[40px] border border-[rgba(233,233,233)] outline-none px-3"
              onChange={(e) => setCategoryName(e.target.value)}
              required="require"
            />
            <h1 className="mb-3  font-bold">Status</h1>
            <select
              name="Status"
              className="outline-none mb-3 h-[40px] border border-[rgba(233,233,233)] px-3 text-gray-400 cursor-pointer"
              value={isStatus}
              onChange={(e) => setIsStatus(e.target.value)}
            >
              <option value="" disabled>
                Select an Option
              </option>
              <option value="1">Active</option>
              <option value="0">Disable</option>
            </select>
            <div className="flex mt-5 justify-between">
              <input
                type="button"
                value={"Cancel"}
                onClick={handleCancel}
                className="w-[80px] h-[40px] bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-500 duration-200 "
              />
              {!isUpdate ? (
                <input
                  type="submit"
                  value={"Create"}
                  className="w-[80px] h-[40px] bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-500 duration-200 "
                />
              ) : (
                <input
                  type="submit"
                  value={"Update"}
                  className="w-[80px] h-[40px] bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-500 duration-200 "
                />
              )}
            </div>
          </form>
        </Modal>
      </div>
      <p className="mx-10 text-lg font-bold">
        Total Category: {isCategoryData.length}
      </p>
      <div className="w-full mt-5 flex justify-center">
        <table className="table-fixed w-full">
          <thead className="h-[60px] border-b bg-slate-200 border-b-gray-400">
            <tr>
              <th>NO</th>
              <th>Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isCategoryData.map((e, index) => (
              <tr
                key={e.category_id}
                className="h-[60px] border border-b-gray-300 text-center hover:bg-slate-100 duration-200"
              >
                <td>{index + 1}</td>
                <td>{e.category_name}</td>
                <td>
                  {e.status == "1" ? (
                    <div className="w-[60px] h-[40px] bg-blue-500 flex justify-center items-center mx-auto text-sm text-white rounded-md">
                      Active
                    </div>
                  ) : (
                    <div className="w-[60px] h-[40px] bg-rose-500 flex justify-center items-center mx-auto text-sm text-white rounded-md">
                      Disable
                    </div>
                  )}
                </td>
                <td className=" space-y-2 py-1">
                  <button
                    onClick={() => editCategory(e)}
                    className="px-4 py-3 bg-blue-500 mx-3 text-sm text-white rounded-md"
                  >
                    <MdEdit />
                  </button>
                  <button
                    className="px-4 py-3 bg-rose-500 text-sm text-white rounded-md"
                    onClick={() => handleDelete(e)}
                  >
                    <MdDelete />
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

export default Category;
