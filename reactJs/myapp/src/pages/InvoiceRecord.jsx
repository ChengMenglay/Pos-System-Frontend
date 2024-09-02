import React, { useEffect, useState } from "react";
import { request } from "../require";
import { TiTick } from "react-icons/ti";
import { FaX, FaFileInvoice } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { message } from "antd";
import moment from "moment";
const InvoiceRecord = () => {
  const [trackingDate, setTrackingDate] = useState("");
  const [dataInvoice, setDataInvoice] = useState([]);
  useEffect(() => {
    getInvoiceData();
  }, [trackingDate, []]);
  const getInvoiceData = async () => {
    const res = await request("api/invoice", "get", {});
    if (res) {
      if (trackingDate != "") {
        setDataInvoice(
          res.data.filter(
            (item) =>
              moment(item.create_at).format("YYYY-MM-DD") == trackingDate
          )
        );
      } else {
        setDataInvoice(res.data);
      }
    }
  };
  const handleDelete = async (item) => {
    const selectDataOrderDetail = await request(
      "api/orderDetail",
      "post",
      {
        address_id: item.address_id,
      }
    );
    if (selectDataOrderDetail) {
      const res = await request(
        "api/invoice",
        "delete",
        {
          invoice_id: item.invoice_id,
          address_id: item.address_id,
          arrayProduct: selectDataOrderDetail.data,
        }
      );
      if (res) {
        message.info("Delete Success");
        getInvoiceData();
      }
    }
  };
  return (
    <div>
      <div className="my-5 px-10">
        <input
          className="w-[200px] h-[50px] border border-gray-500 rounded-lg px-3 outline-none"
          type="date"
          value={trackingDate}
          onChange={(e) => setTrackingDate(e.target.value)}
        />
      </div>
      <p className="mx-10 text-lg font-bold"></p>
      <div className="w-full mt-5 flex justify-center">
        <table className="table-fixed w-full">
          <thead className="h-[40px] border-b bg-slate-200 border-b-gray-400">
            <tr>
              <th>NO</th>
              <th className=" md:hidden sm:hidden hidden">
                Customer
              </th>
              <th className=" md:hidden sm:hidden hidden">
                Phone Number
              </th>
              <th className=" md:hidden sm:hidden hidden">
                Payment Method
              </th>
              <th>Grand Total</th>
              <th>Payment Status</th>
              <th className="md:hidden sm:hidden hidden">Date</th>
              <th>View Recipt</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataInvoice.map((item, index) => (
              <tr
                key={index}
                className="h-[40px] border border-b-gray-300 text-center hover:bg-slate-100 duration-200"
              >
                <td>{"INV" + item.invoice_id}</td>
                <td className="md:hidden sm:hidden hidden">
                  {item.delivery_name}
                </td>
                <td className="md:hidden sm:hidden hidden">
                  {item.phone_number}
                </td>
                <td className="md:hidden sm:hidden hidden">
                  {item.payment_method_name}
                </td>
                <td>${item.total}</td>
                <td>
                  {item.payment_status === 1 ? (
                    <span className="w-[75px] h-[35px] rounded-lg mx-auto flex justify-center items-center bg-slate-400 text-white">
                      Paid
                      <TiTick />
                    </span>
                  ) : (
                    <span className="w-[75px] h-[35px] rounded-lg mx-auto flex justify-center items-center bg-red-500 text-white">
                      Unpaid
                      <FaX className="text-xs mx-1" />
                    </span>
                  )}
                </td>
                <td className="md:hidden sm:hidden hidden">
                  {moment(item.create_at).format("DD/MM/YYYY")}
                </td>
                <td className="text-2xl flex justify-center items-center">
                  <Link to={"/pos/" + item.invoice_id} className="mt-1">
                    <FaFileInvoice />
                  </Link>
                </td>
                <td>
                  {" "}
                  <button
                    className="flex justify-center p-2 items-center mx-auto bg-rose-500 text-sm text-white rounded-md"
                    onClick={() => handleDelete(item)}
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

export default InvoiceRecord;
