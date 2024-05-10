import React, { useEffect, useState } from "react";
import { request } from "../require";
import { Modal, Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const Pos = () => {
  const [getProduct, setGetProduct] = useState([]);
  const [cart, setCart] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [txtSearch, setTxtSearch] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSpin, setIsSpin] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [street, setStreet] = useState("");
  const [province, setProvince] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentOrderCartDetail, setCurrentCartDetail] = useState([]);
  const [isOpenAddPayment, setIsOpenAddPayment] = useState(false);
  const [modalTimeoutId, setModalTimeoutId] = useState(null);
  const [addressInfo, setAddressInfo] = useState([]);
  const [deliveryId, setDeliveryId] = useState([]);
  const [selectDelivery, setSelectDelivery] = useState(7);
  const [deliveryDataSelected, setDeliveryDataSelected] = useState([]);
  const [idAddress, setIdAddress] = useState("");
  const [qtyOrder, setQtyOrder] = useState(null);
  const [addItemSelect, setAddItemSelect] = useState("");
  const [getProductSelect, setGetProductSelect] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [selectPaymentMethodId, setSelectPaymentMethodId] = useState(4);
  const [getOneDataPaymentMethod, setGetOneDataPaymentMethod] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(0);
  const [getIdInvoice, setGetIdInvoice] = useState(0);
  const [note, setNote] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const navigate = useNavigate("");
  //Fetching api all Product and store it in getProduct state
  useEffect(() => {
    getListProduct();
  }, [txtSearch]);
  const getListProduct = async () => {
    try {
      var param = "?txtSearch=" + txtSearch;
      const res = await request("api/product" + param, "get");
      if (res) {
        setGetProduct(
          res.data.filter(
            (e) => e.product_status.toString() === "1" && e.product_quantity > 0
          )
        );
      }
    } catch (error) {
      console.log("Error Fectiong Product:", error);
      message.error("Error fetching products. Please try again later.");
    }
  };
  useEffect(() => {
    const getDataCategory = async () => {
      const res = await request("api/category", "get");
      if (res) {
        setCategoryData(res.data);
      }
    };
    getDataCategory();
  }, []);
  //Hanlde Filter Product By Category
  const handleFilterProductByCategory = async (e) => {
    const res = await request("api/product", "get");
    if (res) {
      setGetProduct(
        res.data.filter((item) => item.category_name === e.category_name)
      );
    }
    if (e === "All") {
      setGetProduct(res.data);
    }
  };
  //To check when add products to the cart
  const addToCart = async (e) => {
    const param = { product_id: e.product_id };
    const res = await request("api/product/getOne", "post", param);
    if (res) {
      var listTmp = res.data;
      //manage dublicate qty
      if (listTmp.length > 0) {
        listTmp[0].qty = 1;
      }
      var isExist = 0;
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].product_id == listTmp[0].product_id) {
          if (listTmp[0].product_quantity <= cart[i].qty) {
            message.info("Product out of stock!");
            isExist = 1;
            return;
          }
          cart[i].qty += 1;
          listTmp = [...cart];
          isExist = 1;
        }
      }
      var subTotal = 0;
      var total = 0;
      if (isExist === 0) {
        listTmp = [...listTmp, ...cart];
      }
      setCart(listTmp);

      listTmp.map((e) => {
        subTotal += e.product_price * e.qty;
      });
      setSubTotal(subTotal);
      total = subTotal;
      setTotal(total);
    }
  };
  const handleDeleteCart = (e) => {
    const ExsitProduct = cart.find((item) => item.product_id === e.product_id);
    if (ExsitProduct.product_id === e.product_id) {
      var exsit = 0;
      var listTmp = cart.filter(
        (item) => item.product_id !== ExsitProduct.product_id
      );
      exsit = 1;
    }
    if (exsit === 1) {
      listTmp = [...listTmp];
    }
    setCart(listTmp);
    var subTotal = 0;
    var total = 0;
    listTmp.map((item) => (subTotal += item.product_price * item.qty));
    total = subTotal;
    setSubTotal(subTotal);
    setTotal(total);
  };
  //To check When click btn Checkout
  const handleOpenModal = () => {
    setIsSpin(true);
    const timeOutId = setTimeout(() => {
      setIsOpenModal(true);
    }, 1000);
    setModalTimeoutId(timeOutId);
  };
  const handleCancel = () => {
    setIsOpenModal(false);
    setIsSpin(false);
    clearTimeout(modalTimeoutId);
  };

  //Check When Employee Click btn Create address customer then add that information in currentOrderCartDetail
  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    const param = {
      customer_name: customerName,
      street: street,
      province: province,
      phone_number: phoneNumber,
      array_product: cart,
    };
    const res = await request("api/address", "post", param);
    if (res) {
      setAddressInfo(res.data);
      setIdAddress(res.data.address_id);
      const addressId = res.data.address_id;
      setIsSpin(false);
      const timeOutId = setTimeout(() => {
        setCustomerName("");
        setStreet("");
        setProvince("");
        setPhoneNumber("");
        setIsOpenModal(false);
        setIsOpenAddPayment(true);
      }, 1000);
      const getCurrentCart = await request("api/orderDetail", "post", {
        address_id: addressId,
      });
      if (getCurrentCart) {
        setCurrentCartDetail(getCurrentCart.data);
      }
      setModalTimeoutId(timeOutId);
    }
  };
  //Check if Employee Cancel process Add payment
  const handleCancelAddPayment = async () => {
    setIsOpenAddPayment(false);
    setCart([]);
    setSelectPaymentMethodId(4);
    try {
      if (currentOrderCartDetail.length === 0) {
        const deleteCurrentAddress = await request("api/address", "delete", {
          address_id: idAddress,
        });

        if (deleteCurrentAddress) {
          setCurrentCartDetail([]);
        }
      } else {
        const deleteOrderDetail = await request("api/orderDetail", "delete", {
          address_id: currentOrderCartDetail[0].address_id,
        });
        if (deleteOrderDetail) {
          const deleteCurrentAddress = await request("api/address", "delete", {
            address_id: currentOrderCartDetail[0].address_id,
          });

          if (deleteCurrentAddress) {
            setCurrentCartDetail([]);
          }
        }
      }
    } catch (error) {
      console.error("Error deleting address and order details:", error);
    }
  };
  //Check delivery process
  useEffect(() => {
    handleSelectDelivery();
    getPaymentMethod();
    getIdINV();
  }, []);
  const handleSelectDelivery = async () => {
    const res = await request("api/delivery", "get");
    if (res) {
      setDeliveryDataSelected(res.data);
    }
  };
  useEffect(() => {
    var sub = 0;
    var sumqty = 0;
    currentOrderCartDetail.map((e) => {
      sub += e.product_price * e.product_qty;
      sumqty += e.product_qty;
    });
    setSubTotal(sub);
    setTotal(sub);
    setQtyOrder(sumqty);
  }, [currentOrderCartDetail]);
  useEffect(() => {
    getDeliveryData();
  }, [selectDelivery]);
  const getDeliveryData = async () => {
    const res = await request("api/delivery/getone", "post", {
      delivery_id: selectDelivery,
    });
    if (res) {
      setDeliveryId(res.data);
    }
  };

  //Delete each item in add payment slide when click btn delete
  const handleClickDeleteItem = async (item) => {
    const deleteSlected = await request("api/orderDetail/removeOne", "delete", {
      order_detail_id: item.order_detail_id,
    });
    if (deleteSlected) {
      const getCurrentCart = await request("api/orderDetail", "post", {
        address_id: item.address_id,
      });
      if (getCurrentCart) {
        setCurrentCartDetail(getCurrentCart.data);
      }
    }
  };
  useEffect(() => {
    getOneProduct();
  }, [addItemSelect]);
  const getOneProduct = async () => {
    const res = await request("api/product/getOne", "post", {
      product_id: addItemSelect,
    });
    if (res) {
      var listTmp = res.data;
      if (listTmp.length > 0) {
        listTmp[0].product_qty = 1;
      }
      setGetProductSelect([...listTmp]);
    }
  };
  const handleClickItem = async () => {
    if (addItemSelect == "") {
      return null;
    } else {
      const res = await request("api/orderDetail/create", "post", {
        address_id: idAddress,
        product_id: getProductSelect[0].product_id,
        product_name: getProductSelect[0].product_name,
        product_image: getProductSelect[0].product_image,
        product_quantity: getProductSelect[0].product_quantity,
        product_qty: getProductSelect[0].product_qty,
        product_price: getProductSelect[0].product_price,
      });
      if (res) {
        setCurrentCartDetail(res.data);
      }
    }
    setAddItemSelect("");
  };
  const handleChangeQty = async (item, newQty) => {
    const res = await request("api/orderDetail", "put", {
      order_detail_id: item.order_detail_id,
      product_qty: newQty,
      product_price: item.product_price,
      address_id: item.address_id,
    });
    if (res) {
      setCurrentCartDetail(res.data);
    }
  };
  const getPaymentMethod = async () => {
    const res = await request("api/payment_method", "get", {});
    if (res) {
      setPaymentMethod(res.data);
    }
  };
  //GetPaymentMethod Data
  useEffect(() => {
    getOnePaymentMethod();
  }, [selectPaymentMethodId]);
  const getOnePaymentMethod = async () => {
    const res = await request("api/payment_method/getOne", "post", {
      payment_method_id: selectPaymentMethodId,
    });
    if (res) {
      setGetOneDataPaymentMethod(res.data);
    }
  };
  const handleSaveInvoice = async () => {
    const param = {
      address_id: currentOrderCartDetail[0].address_id,
      payment_method_id: selectPaymentMethodId,
      delivery_id: selectDelivery,
      payment_status: paymentStatus,
      note: note,
      total:
        deliveryId.length > 0 && selectDelivery
          ? total + deliveryId[0].shipping_charge
          : total,
      arrayProduct: currentOrderCartDetail,
    };
    const res = await request("api/invoice", "post", param);
    if (res) {
      navigate("/pos/" + res.dataInvoice[0].invoice_id.toString());
      setIsOpenAddPayment(false);
      setSelectPaymentMethodId(4);
      setCurrentCartDetail([]);
      setSelectDelivery(7);
    }
  };
  const getIdINV = async () => {
    const res = await request("api/invoice", "get");
    if (res) {
      var length = res.data.length - 1;
      setGetIdInvoice(res.data[length].invoice_id + 1);
    }
  };

  return (
    <div>
      <div className="w-full xl:flex lg:flex md:flex sm:block block justify-between">
        <div className="xl:w-[40%] lg:w-[40%] md:w-[50%] sm:w-full w-full min-h-[300px] overflow-scroll">
          <table className="table-fixed w-full">
            <thead className="h-[60px] border-b bg-blue-700 text-white border-b-gray-400">
              <tr>
                <th>Id</th>
                <th>Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((e, index) => (
                <tr
                  key={index}
                  className="h-[80px] border border-b-gray-300 text-center hover:bg-slate-100 duration-200"
                >
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={
                        "http://localhost/project/image_3/" + e.product_image
                      }
                      alt="product"
                      width={100}
                    />
                  </td>
                  <td>{e.product_name}</td>
                  <td>{e.qty}</td>
                  <td>${e.product_price}</td>
                  <td>
                    <button
                      className="w-[60px] h-[40px] bg-red-700 text-white mt-2 rounded-lg"
                      onClick={() => handleDeleteCart(e)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cart.length > 0 ? (
            <div className="w-full p-5 text-xl">
              <h1 className="font-bold">Sub Total: ${subTotal}</h1>
              <h1 className="font-bold">Total: ${total}</h1>

              <button
                className="w-[150px] h-[40px] bg-green-600 text-white mt-2 rounded-lg"
                onClick={handleOpenModal}
              >
                {!isOpenModal && isSpin ? (
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
                    />{" "}
                    Check Out
                  </div>
                ) : (
                  "Check Out"
                )}
              </button>
            </div>
          ) : null}
        </div>
        <div className="xl:w-[60%] lg:w-[60%] md:w-[50%] sm:w-full w-full max-h-[600px] overflow-scroll overflow-x-hidden px-3 py-5 bg-[#f5f5f5]">
          <div className="flex flex-col justify-center">
            <div className="w-full flex items-center px-3">
              <label htmlFor="search" className="text-xl mr-3">
                Search:
              </label>
              <input
                type="text"
                placeholder="Search"
                className="w-[350px] h-[40px] border border-gray-500 rounded-lg px-3 outline-none "
                value={txtSearch}
                onChange={(e) => setTxtSearch(e.target.value)}
              />
            </div>
            <div className="w-full flex justify-center flex-wrap gap-1 mt-2">
              <button
                className="mx-2 rounded-lg w-[80px] h-[40px] border border-gray-400 hover:bg-gray-400 hover:text-white duration-300"
                onClick={() => handleFilterProductByCategory("All")}
              >
                All
              </button>
              {categoryData.map((e, index) => (
                <button
                  key={index}
                  className="mx-2 rounded-lg w-[80px] h-[40px] border border-gray-400 hover:bg-gray-400 hover:text-white duration-300"
                  onClick={() => handleFilterProductByCategory(e)}
                >
                  {e.category_name}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full mt-5 flex justify-center flex-wrap gap-3">
            {getProduct.map((e, index) => (
              <div
                key={index}
                className="w-[290px] h-[150px] bg-white rounded-lg overflow-hidden flex"
              >
                <img
                  src={"http://localhost/project/image_3/" + e.product_image}
                  alt="product"
                  className="w-[40%] h-full"
                />
                <div className="w-[60%] h-full py-2 px-3">
                  <h1 className="text-md font-bold">{e.product_name}</h1>
                  <p className="text-md text-gray-600">
                    Price: ${e.product_price}
                  </p>
                  <p className="text-md text-gray-600">
                    Stock: {e.product_quantity}
                  </p>
                  <button
                    className="w-full h-[40px] bg-blue-600 text-white mt-2 rounded-lg"
                    onClick={() => addToCart(e)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        width={1300}
        title={"Add Shipping Address"}
        open={isOpenModal}
        onCancel={handleCancel}
        footer={null}
      >
        <form className="px-3" onSubmit={handleSubmitAddress}>
          <label htmlFor="name" className="text-xl font-bold">
            Full name (First and Last name)
          </label>
          <input
            type="text"
            className="w-full border text-lg border-gray-500 my-3 outline-none px-3 h-[40px]"
            id="name"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <label htmlFor="street" className="text-xl font-bold">
            Street address
          </label>
          <input
            type="text"
            className="w-full border text-lg border-gray-500 my-3 outline-none px-3 h-[40px]"
            placeholder="Street address, P.O.box,company name"
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          <label htmlFor="province" className="text-xl font-bold">
            City/Province
          </label>
          <input
            type="text"
            className="w-full border text-lg border-gray-500 my-3 outline-none px-3 h-[40px]"
            id="province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />
          <label htmlFor="phone" className="text-xl font-bold">
            Phone Number
          </label>
          <input
            type="text"
            className="w-full border text-lg border-gray-500 my-3 outline-none px-3 h-[40px]"
            required
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <div className="w-full flex justify-end mt-3">
            <button
              type="submit"
              className="w-[100px] h-[50px] text-lg bg-green-600 rounded-lg text-white cursor-pointer hover:bg-green-500 duration-200"
            >
              {!isSpin && isOpenModal ? (
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
                  Next
                </div>
              ) : (
                "Next"
              )}
            </button>
          </div>
        </form>
      </Modal>
      <Modal
        width={1300}
        title={"Add Payment"}
        open={isOpenAddPayment}
        footer={null}
        onCancel={handleCancelAddPayment}
      >
        <div className="text-black flex justify-between px-3">
          <div>
            <h1 className="text-lg">
              Customer:{" "}
              <span className="font-bold">{addressInfo.customer_name}</span>
            </h1>
            <h1 className="text-lg my-3">
              Phone Number:{" "}
              <span className="font-bold">{addressInfo.phone_number}</span>
            </h1>
          </div>
          <div>
            <div className="flex items-center text-lg">
              <h1>Invoice NO :</h1>
              <div className="w-[80px] h-[30px] ml-3 border border-[#b98f8f] flex justify-center font-bold rounded-md items-center">
                {"INV" + getIdInvoice}
              </div>
            </div>
            <h1 className="text-lg mt-3">
              Document type: <span className="font-bold">Invoice</span>
            </h1>
          </div>
        </div>
        <div className="w-full mt-5 flex justify-center">
          <table className="table-fixed w-full">
            <thead className="h-[40px] border border-black bg-blue-500 text-white">
              <tr>
                <th>Id</th>
                <th>Image</th>
                <th className="mt-2 xl:block items-center lg:block md:block sm:block hidden">
                  Item Name
                </th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentOrderCartDetail.map((item, index) => (
                <tr
                  key={index}
                  className="min-h-[30px] border border-black border-t-0 text-center font-bold hover:bg-slate-100 duration-200"
                >
                  <td>{index + 1}</td>
                  <td>
                    <img
                      className="mx-auto"
                      src={
                        "http://localhost/project/image_3/" + item.product_image
                      }
                      alt="product"
                      width={50}
                    />
                  </td>
                  <td className="mt-4 xl:block lg:block md:block sm:block hidden">
                    {item.product_name}
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.product_qty}
                      onKeyDown={(e) => e.preventDefault()}
                      className=" text-center"
                      onChange={(e) =>
                        handleChangeQty(item, parseInt(e.target.value))
                      }
                      min={1}
                      max={item.product_quantity}
                    />
                  </td>
                  <td>${item.product_price}</td>
                  <td>${item.total}</td>
                  <td>
                    <div className="flex justify-center">
                      <button
                        className="w-[70px] h-[35px] bg-red-600 text-sm text-white rounded-md"
                        onClick={() => handleClickDeleteItem(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="min-h-[30px] border border-black border-t-0 text-center font-bold">
                <td colSpan={3} className="px-3">
                  {" "}
                  <select
                    name="Products"
                    className="w-full outline-none h-[30px] border border-[#b98f8f] px-3 text-black cursor-pointer"
                    value={addItemSelect}
                    onChange={(e) => setAddItemSelect(e.target.value)}
                  >
                    <option disabled value={""} className="text-gray-500">
                      Select an Option
                    </option>
                    {getProduct.map((e, index) => (
                      <option key={index} value={e.product_id}>
                        {e.product_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="xl:flex lg:flex md:flex sm:flex hidden">
                  {getProductSelect.length > 0 && addItemSelect
                    ? getProductSelect[0].qty
                    : 0}
                </td>
                <td>
                  $
                  {getProductSelect.length > 0 && addItemSelect
                    ? getProductSelect[0].product_price
                    : 0}
                </td>
                <td>
                  <button
                    className="w-[70px] h-[35px] bg-gray-500 mx-3 text-sm text-white rounded-md"
                    onClick={handleClickItem}
                  >
                    Add Item
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h1 className="text-xl font-bold text-end mt-3">
          Payment Item Total: ${total}
        </h1>
        <div className="w-full xl:flex lg:flex md:flex sm:flex block justify-between mt-7">
          <div className="xl:w-[30%] lg:w-[30%] md:w-[30%] sm:w-[30%] w-full flex">
            <div className="w-[50%]">
              <div className="w-full xl:h-[40px] lg:h-[40px] md:h-[40px] sm:h-[40px] h-[30px] border border-black flex justify-center items-center">
                Delevery
              </div>
              <div className="w-full xl:h-[40px] lg:h-[40px] md:h-[40px] sm:h-[40px] h-[30px] border border-black border-t-0  flex justify-center items-center">
                Sub total
              </div>
              <div className="w-full xl:h-[40px] lg:h-[40px] md:h-[40px] sm:h-[40px] h-[30px] border border-black border-t-0  flex justify-center items-center">
                Grand Total
              </div>
              <div className="w-full xl:h-[40px] lg:h-[40px] md:h-[40px] sm:h-[40px] h-[30px] border border-black border-t-0  flex justify-center items-center">
                Shipping Charge
              </div>
            </div>
            <div className="w-[50%]">
              <div className="w-full xl:h-[40px] lg:h-[40px] md:h-[40px] sm:h-[40px] h-[30px]  border border-black flex border-l-0 justify-center items-center">
                <select
                  name="Delivery"
                  className="outline-none w-full h-[30px] border border-[#b98f8f] px-3 text-black cursor-pointer"
                  value={selectDelivery}
                  onChange={(e) => {
                    setSelectDelivery(e.target.value);
                  }}
                >
                  <option disabled value={""} className="text-gray-500">
                    Select an Option
                  </option>
                  {deliveryDataSelected.map((e) => (
                    <option key={e.delivery_id} value={e.delivery_id}>
                      {e.delivery_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full xl:h-[40px] lg:h-[40px] md:h-[40px] sm:h-[40px] h-[30px]  border border-black border-t-0 border-l-0   flex justify-center items-center">
                $
                {deliveryId.length > 0 && selectDelivery
                  ? subTotal + deliveryId[0].shipping_charge
                  : subTotal}
              </div>
              <div className="w-full xl:h-[40px] lg:h-[40px] md:h-[40px] sm:h-[40px] h-[30px]  border border-black border-t-0 border-l-0   flex justify-center items-center">
                $
                {deliveryId.length > 0 && selectDelivery
                  ? total + deliveryId[0].shipping_charge
                  : total}
              </div>
              <div className="w-full xl:h-[40px] lg:h-[40px] md:h-[40px] sm:h-[40px] h-[30px]  border border-black border-t-0 border-l-0   flex justify-center items-center">
                $
                {deliveryId.length > 0 && selectDelivery
                  ? deliveryId[0].shipping_charge
                  : "0"}
              </div>
            </div>
          </div>
          <div className="xl:w-[68%] lg:w-[68%] md:w-[68%] sm:w-[68%] w-full h-[60px]">
            <table className="table-fixed w-full">
              <thead className="h-[30px] border border-black bg-blue-500 text-white">
                <tr>
                  <th>Id</th>
                  <th>Payment Method</th>
                  <th className="xl:block lg:block md:block sm:block hidden">
                    Payment Image
                  </th>
                  <th>Quantity Item</th>
                  <th>Payment Total</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className=" h-[40px] border border-black border-t-0 text-center font-bold hover:bg-slate-100 duration-200">
                  <td>1</td>
                  <td>
                    <select
                      className="w-[100%] outline-none h-[30px] border border-[#b98f8f] px-3 text-black cursor-pointer"
                      value={selectPaymentMethodId}
                      onChange={(e) => setSelectPaymentMethodId(e.target.value)}
                    >
                      <option disabled value={""} className="text-gray-500">
                        Select an Option
                      </option>
                      {paymentMethod.map((e, index) => (
                        <option key={index} value={e.payment_method_id}>
                          {e.payment_method_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="xl:block lg:block md:block sm:block hidden">
                    {getOneDataPaymentMethod.length > 0 &&
                    selectPaymentMethodId ? (
                      <img
                        src={
                          "http://localhost/project/image_3/" +
                          getOneDataPaymentMethod[0].payment_method_image
                        }
                        width={50}
                        alt=""
                        className="mx-auto"
                      />
                    ) : null}
                  </td>
                  <td>{qtyOrder}</td>
                  <td>
                    ${" "}
                    {deliveryId.length > 0 && selectDelivery
                      ? total + deliveryId[0].shipping_charge
                      : total}
                  </td>
                  <td>
                    <select
                      name="Status"
                      className="w-[100%] outline-none h-[30px] border border-[#b98f8f] px-3 text-black cursor-pointer"
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                      <option disabled value={""} className="text-gray-500">
                        Select an Option
                      </option>
                      <option value={0}>Unpaid</option>
                      <option value={1}>IsPaid</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="w-full xl:flex lg:flex md:flex sm:flex hidden items-center mt-10">
              <h1 className=" text-lg">Note: </h1>
              <textarea
                className="w-full h-[80px] ml-3 pt-2 border border-gray-300 resize-none rounded-lg outline-none px-3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-16">
          <button className="w-[100px] h-[40px] rounded-lg border border-blue-500 font-bold hover:bg-blue-500 hover:text-white duration-300">
            Draft
          </button>
          <button
            className="w-[100px] ml-5 h-[40px] rounded-lg border border-green-500 font-bold hover:bg-green-500 hover:text-white duration-300"
            onClick={handleSaveInvoice}
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Pos;
