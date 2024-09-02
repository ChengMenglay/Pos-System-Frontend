import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { request } from "../require";
import { ReactToPrint } from "react-to-print";
import moment from "moment";
import { ThemeContext } from "../Layout/Dashboard";
const InvoiceDetail = () => {
  const { id } = useParams();
  const [dataInvoice, setDataInvoice] = useState([]);
  const [dataOrderedItem, setDataOrderedItem] = useState([]);
  const navigate = useNavigate("");
  const { profile } = useContext(ThemeContext);
  const componentRef = useRef();
  useEffect(() => {
    const getOneDataInvoice = async () => {
      const res = await request("api/invoice/getOne", "post", {
        invoice_id: parseInt(id),
      });
      if (res) {
        setDataInvoice(res.data[0]);
        const selectDataOrderDetail = await request("api/orderDetail", "post", {
          address_id: res.data[0].address_id,
        });
        if (selectDataOrderDetail) {
          setDataOrderedItem(selectDataOrderDetail.data);
        }
      }
    };
    getOneDataInvoice();
  }, [id]);
  const handleBack = () => {
    navigate("/pos");
    setDataInvoice([]);
    setDataOrderedItem([]);
  };
  return (
    <div>
      <div className="flex justify-center gap-5 mr-10 mb-5 mt-3">
        <ReactToPrint
          trigger={() => (
            <button className="w-[85px] h-[40px] rounded-lg  bg-slate-500 text-white">
              Print
            </button>
          )}
          content={() => componentRef.current}
        />
        {/* <button
          className="w-[85px] h-[40px] rounded-lg bg-green-700 text-white"
        >
          Send Mail
        </button> */}
        <button
          className="w-[85px] h-[40px] rounded-lg bg-blue-500 text-white"
          onClick={handleBack}
        >
          Back
        </button>
      </div>
      <div ref={componentRef} className="px-5">
        <div className="flex justify-between text-lg">
          <h1>Koh Sdach 79 Mart</h1>
          <h1>Invoice Sale</h1>
        </div>
        <div className="w-full border-t border-t-black"></div>
        <h1 className="text-center uppercase font-bold text-2xl mt-5">
          Invoice
        </h1>
        <div className="flex justify-between mt-5 px-3">
          <div>
            <h1>
              To, <span className="font-bold">{dataInvoice.customer_name}</span>
            </h1>
            <h1>
              Phone Number:{" "}
              <span className="font-bold">{dataInvoice.phone_number}</span>
            </h1>
            <h1>
              Street:{" "}
              <span className="font-bold">
                {dataInvoice.street == "" ? "-" : dataInvoice.street}
              </span>
            </h1>
            <h1>
              Province:{" "}
              <span className="font-bold">
                {dataInvoice.province == "" ? "-" : dataInvoice.province}
              </span>
            </h1>
          </div>
          <div>
            <h1>
              Saler:{" "}
              <span className="font-bold">
                {profile.data.firstname + " " + profile.data.lastname}
              </span>
            </h1>
            <h1>
              NO:{" "}
              <span className="font-bold">
                {"INV" + dataInvoice.invoice_id}
              </span>
            </h1>
            <h1>
              Date:{" "}
              <span className="font-bold">
                {moment(dataInvoice.create_at).format("DD/MM/YYYY")}
              </span>
            </h1>
          </div>
        </div>
        <div className="w-full mt-10">
          <table className="table-fixed w-full">
            <thead>
              <tr className="h-[50px] border border-black text-center hover:bg-slate-100 duration-200">
                <th className="border border-black">Id</th>
                <th className="border border-black">Name</th>
                <th className="border border-black">Quantity</th>
                <th className="border border-black">Price</th>
                <th className="border border-black">Total</th>
              </tr>
            </thead>
            <tbody>
              {dataOrderedItem.map((e, index) => (
                <tr
                  key={index}
                  className="h-[50px] border border-black text-center hover:bg-slate-100 duration-200"
                >
                  <td className="border border-black">{index + 1}</td>
                  <td className="border border-black">{e.product_name}</td>
                  <td className="border border-black">{e.product_qty}</td>
                  <td className="border border-black">${e.product_price}</td>
                  <td className="border border-black">${e.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full border border-black mt-5">
          <div className="flex w-full">
            {" "}
            <div className="w-[70%] h-[30px] border-b border-b-black border-r border-r-black flex items-center px-5">
              <h1 className="font-bold">DESCRIPTION</h1>
            </div>
            <div className="w-[30%] h-[30px] border-b border-b-black flex items-center justify-end px-5">
              <h1 className="font-bold">AMOUNT</h1>
            </div>
          </div>
          <div className="flex">
            <div className="w-[70%] border-r border-black  p-3">
              <h1 className="mt-3">Delivery</h1>
              <h1 className="mt-3">Shipping Charge</h1>
              <h1 className="mt-3">Payment Status</h1>
              <h1 className="mt-3">Payment Method</h1>
            </div>
            <div className="w-[30%] p-3">
              <h1 className="mt-3 font-bold">{dataInvoice.delivery_name}</h1>
              <h1 className="mt-3 font-bold">${dataInvoice.shipping_charge}</h1>
              <h1 className="mt-3 font-bold">
                {dataInvoice.payment_status == 1 ? "Paid" : "Unpaid"}
              </h1>
              <h1 className="mt-3 font-bold">
                {dataInvoice.payment_method_name}
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full h-[40px] border border-black border-t-0 flex justify-end">
          <h1 className="mr-5 mt-1 text-xl font-bold">
            TOTAL: ${dataInvoice.total}
          </h1>
        </div>
        <div className="mt-5 mb-10">
          <h1 className="text-center uppercase">
            thank you for coming again, if you have any question about this
            invoice, please contact
          </h1>
          <h1 className="text-center font-bold">cheng.menglay79@gmail.com</h1>
          <h1 className="text-center font-bold">089240766</h1>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
