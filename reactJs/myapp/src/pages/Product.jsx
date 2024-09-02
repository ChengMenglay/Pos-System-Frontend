import { Modal, message } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { request } from "../require";
import { LuImagePlus } from "react-icons/lu";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
const Product = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDetail, setProductDetail] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [productId, setProductId] = useState();
  const [productImage, setProductImage] = useState();
  const [productData, setProductData] = useState([]);
  const [searchVal, setSearchVal] = useState([]);
  const [referEdit, setReferEdit] = useState(false);
  const [updateImage, setUpdateImage] = useState();
  const inputRef = useRef();
  const config = {
    url: "http://localhost/project/image_3/",
  };
  useEffect(() => {
    getCategory();
  }, []);
  useEffect(() => {
    getProduct();
  }, [searchVal]);
  const handleCancel = () => {
    setProductName("");
    setCategory("");
    setProductImage("");
    setProductDetail("");
    setPrice("");
    setQuantity("");
    setStatus("");
    setIsOpen(false);
    setReferEdit(false);
  };
  const getCategory = async () => {
    const res = await request("api/category", "get", {});
    if (res) {
      setCategoryData(res.data);
    }
  };
  const getProduct = async () => {
    var param = "?txtSearch=" + searchVal;
    const res = await request("api/product" + param, "get", {});
    if (res) {
      setProductData(res.data);
    }
  };
  const handleForm = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("product_name", productName);
    form.append("category_id", category);
    form.append("product_detail", productDetail);
    form.append("product_image", productImage);
    form.append("product_price", price);
    form.append("product_quantity", quantity);
    form.append("product_status", status);
    const res = await request("api/product", "post", form);
    if (res) {
      message.success("Create Product Success");
      setIsOpen(false);
      setProductName("");
      setCategory("");
      setUpdateImage("");
      setProductImage("");
      setProductDetail("");
      setPrice("");
      setQuantity("");
      setStatus("");
      getProduct();
    }
  };
  const handleEdit = async (e) => {
    setReferEdit(true);
    setProductName(e.product_name);
    setCategory(e.category_id);
    setProductImage(e.product_image);
    setProductDetail(e.product_detail);
    setPrice(e.product_price);
    setQuantity(e.product_quantity);
    setStatus(e.product_status);
    setProductId(e.product_id);
    setIsOpen(true);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("product_name", productName);
    form.append("category_id", category);
    form.append("product_detail", productDetail);
    if (!updateImage) {
      form.append("product_image", productImage);
    } else {
      form.append("product_image", updateImage);
    }
    form.append("product_price", price);
    form.append("product_quantity", quantity);
    form.append("product_status", status);
    form.append("product_id", productId);
    const res = await request("api/product", "put", form);
    if (res) {
      message.success("Update Product Success");
      setIsOpen(false);
      setReferEdit(false);
      setProductName("");
      setCategory("");
      setProductImage("");
      setProductDetail("");
      setPrice("");
      setUpdateImage("");
      setQuantity("");
      setStatus("");
      getProduct();
    }
  };
  const handleDelete = async (e) => {
    const res = await request(
      "api/product",
      "delete",
      {
        product_id: e.product_id,
      }
    );
    if (res) {
      message.success("Delete Success");
      getProduct();
    } else {
      message.error("Cannot Delete this product!");
    }
  };
  return (
    <div>
      <div className="my-5 flex justify-between px-10">
        <input
          type="text"
          placeholder="Search"
          className="w-[350px] h-[50px] border border-gray-500 rounded-lg px-3 outline-none"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <button
          className="px-4 mx-2 text-lg text-white rounded-md bg-blue-600 hover:bg-blue-500 duration-200"
          onClick={() => setIsOpen(true)}
        >
          <IoMdAdd />
        </button>
        <Modal
          title={"New Product"}
          footer={null}
          open={isOpen}
          onCancel={handleCancel}
        >
          <form
            className="flex flex-col"
            onSubmit={!referEdit ? handleForm : handleUpdate}
          >
            <h1 className="my-3  font-bold">Name</h1>
            <input
              type="text"
              placeholder="Name"
              className="mb-3 h-[40px] border border-[rgba(233,233,233)] outline-none px-3"
              required="require"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <h1 className="my-3  font-bold">Detail</h1>
            <textarea
              placeholder="Detail"
              className="mb-3 h-[40px] pt-2 border border-[rgba(233,233,233)] resize-none  outline-none px-3"
              value={productDetail}
              onChange={(e) => setProductDetail(e.target.value)}
            ></textarea>
            <h1 className="my-3  font-bold">Quantity</h1>
            <input
              type="number"
              placeholder="Quantity"
              className="mb-3 h-[40px] border border-[rgba(233,233,233)] outline-none px-3"
              required="require"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <h1 className="my-3  font-bold">Price</h1>
            <input
              type="number"
              placeholder="Price"
              className="mb-3 h-[40px] border border-[rgba(233,233,233)] outline-none px-3"
              required="require"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <h1 className="mb-3  font-bold">Category</h1>
            <select
              name="Category"
              className="outline-none mb-3 h-[40px] border border-[rgba(233,233,233)] px-3 text-gray-400 cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>
                Select an Option
              </option>
              {categoryData.map((e) => (
                <option key={e.category_id} value={e.category_id}>
                  {e.category_name}
                </option>
              ))}
            </select>
            <h1 className="mb-3  font-bold">Status</h1>
            <select
              name="Status"
              className="outline-none mb-3 h-[40px] border border-[rgba(233,233,233)] px-3 text-gray-400 cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="" disabled>
                Select an Option
              </option>
              <option value="1">Active</option>
              <option value="0">Disable</option>
            </select>
            <h1 className="mb-3  font-bold">Image</h1>
            {!referEdit ? (
              <img
                width={250}
                className="rounded-lg drop-shadow-md"
                src={!productImage ? "" : URL.createObjectURL(productImage)}
                onClick={() => inputRef.current.click()}
              />
            ) : (
              <img
                width={250}
                className="rounded-lg drop-shadow-md"
                src={
                  updateImage
                    ? URL.createObjectURL(updateImage)
                    : config.url + productImage
                    ? config.url + productImage
                    : NULL
                }
                onClick={() => inputRef.current.click()}
              />
            )}
            {!productImage && !updateImage ? (
              <button
                type="button"
                className="border border-[#b9b3b3]  w-[180px] h-[35px] rounded-xl justify-center flex items-center text-md font-bold hover:bg-blue-600 hover:text-white duration-200"
                onClick={() => inputRef.current.click()}
              >
                <LuImagePlus className="text-2xl" />
                <span className="mx-3">Upload an Image</span>
              </button>
            ) : null}
            {!referEdit ? (
              <input
                type="file"
                ref={inputRef}
                className="hidden"
                onChange={(e) => setProductImage(e.target.files[0])}
              />
            ) : (
              <input
                type="file"
                ref={inputRef}
                className="hidden"
                onChange={(e) => setUpdateImage(e.target.files[0])}
              />
            )}
            <div className="flex mt-5 justify-between">
              <input
                type="button"
                value={"Cancel"}
                className="w-[80px] h-[40px] bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-500 duration-200 "
                onClick={handleCancel}
              />
              {!referEdit ? (
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
                  onClick={handleUpdate}
                />
              )}
            </div>
          </form>
        </Modal>
      </div>
      <h1 className="font-bold ml-10 text-lg">
        Total Product: {productData.length}
      </h1>
      <div className="w-full mt-5 flex justify-center">
        <table className="table-fixed w-full">
          <thead className="h-[60px] border-b bg-slate-200 border-b-gray-400">
            <tr>
              <th className="mt-4 xl:block items-center lg:block md:block sm:block hidden">
                NO
              </th>
              <th>Name</th>
              <th className="mt-4 xl:block items-center lg:block md:block sm:block hidden">
                Detail
              </th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Image</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {productData.map((e, index) => (
              <tr
                key={index}
                className="min-h-[60px] border border-b-gray-300 text-center hover:bg-slate-100 duration-200 xl:text-lg lg:text-lg md:text-md sm:text-md text-sm"
              >
                <td className="mt-4 xl:block items-center lg:block md:block sm:block hidden">
                  {index + 1}
                </td>
                <td>{e.product_name}</td>
                <td className="mt-10 xl:block items-center lg:block md:block sm:block hidden">
                  {e.product_detail}
                </td>
                <td>${e.product_price}</td>
                <td>{e.product_quantity}</td>
                <td>
                  <img
                    src={config.url + e.product_image}
                    className="xl:w-[100px] lg:w-[100px] md:w-[100px] sm:w-[70px] w-[70px] mx-auto"
                  />
                </td>
                <td>
                  {e.product_status == "1" && e.product_quantity > 0 ? (
                    <div className="w-[60px] h-[40px] bg-blue-500 flex justify-center items-center mx-auto text-sm text-white rounded-md">
                      Active
                    </div>
                  ) : (
                    <div className="w-[60px] h-[40px] bg-red-500 flex justify-center items-center mx-auto text-sm text-white rounded-md">
                      Disable
                    </div>
                  )}
                </td>
                <td className=" space-y-2 py-1">
                  <button
                    className=" bg-blue-500 mx-3 text-sm px-4 py-3  text-white rounded-md"
                    onClick={() => handleEdit(e)}
                  >
                    <MdEdit />
                  </button>
                  <button
                    className=" bg-red-600 px-4 py-3 mx-3 text-sm text-white rounded-md"
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

export default Product;
