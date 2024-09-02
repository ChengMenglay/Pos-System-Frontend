import React, { useEffect, useState } from "react";
import { request } from "../require";
const Overview = () => {
  const [productStock, setProductStock] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [invoice, setInvoice] = useState([]);
  var totalStock = 0;
  var totalRevenue = 0;
  useEffect(() => {
    getProductStock();
    getCustomer();
    getAllInvoice();
  }, []);
  const getProductStock = async () => {
    const res = await request("api/product", "get", {});
    if (res) {
      setProductStock(res.data);
    }
  };
  const getCustomer = async () => {
    const res = await request("api/user", "get", {});
    if (res) {
      setCustomer(res.data);
    }
  };
  for (let i = 0; i < productStock.length; i++) {
    totalStock += productStock[i].product_quantity;
  }
  for (let i = 0; i < invoice.length; i++) {
    totalRevenue += invoice[i].total;
  }
  const getAllInvoice = async () => {
    const res = await request("api/invoice", "get", {});
    if (res) {
      setInvoice(res.data);
    }
  };
  return (
    <div>
      <div className="w-full grid place-items-center xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 px-10 mt-5 gap-20">
        <div className="w-[200px] h-[100px] flex flex-col justify-center items-center rounded-xl border border-blue-700">
          <h1 className="font-bold text-xl">Total Revenue</h1>
          <p className="text-blue-600">${totalRevenue}</p>
        </div>
        <div className="w-[200px] h-[100px] flex flex-col justify-center items-center  rounded-xl border border-blue-700">
          <h1 className="font-bold text-xl">Product Stock</h1>
          <p className="text-blue-600">{totalStock}</p>
        </div>
        <div className="w-[200px] h-[100px] flex flex-col justify-center items-center  rounded-xl border border-blue-700">
          <h1 className="font-bold text-xl">Sales</h1>
          <p className="text-blue-600">{invoice.length}</p>
        </div>
        <div className="w-[200px] h-[100px] flex flex-col justify-center items-center  rounded-xl border border-blue-700">
          <h1 className="font-bold text-xl">Manage Page</h1>
          <p className="text-blue-600">{customer.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
