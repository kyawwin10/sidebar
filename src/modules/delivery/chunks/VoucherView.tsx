import React from "react";
import { Button } from "@/components/ui/button";
import api from "@/api";

interface VoucherViewProps {
  orderId: string;
  onClose: () => void;
}

const VoucherView: React.FC<VoucherViewProps> = ({ orderId, onClose }) => {
  const { data: voucher, isLoading, error } = api.delivery.useVoucherByOrderId(orderId);

  if (isLoading) return <p>Loading voucher...</p>;
  if (error) return <p className="text-red-500">Error loading voucher</p>;
  if (!voucher) return <p>No voucher found</p>;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-1 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl relative">
        <Button
          className="absolute top-2 right-4"
          size="sm"
          variant="outline"
          onClick={onClose}
        >
          Close
        </Button>

        <h2 className="text-xl font-bold mb-4">Voucher Details</h2>

        <p><strong>Order ID:</strong> {voucher.orderId}</p>
        <p><strong>Total Amount:</strong> {voucher.totalAmount}</p>
        <p><strong>Discount:</strong> {voucher.discountAmount} ({voucher.discountPercent.toFixed(2)}%)</p>
        <p><strong>Final Amount:</strong> {voucher.finalAmount}</p>
        <p><strong>Description:</strong> {voucher.description}</p>

        <h3 className="mt-4 font-semibold">Order Items</h3>
        <table className="w-full text-left mt-2 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Product</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Discount</th>
              <th className="border p-2">Final Price</th>
            </tr>
          </thead>
          <tbody>
            {voucher.orderDetails.map((od) => (
              <tr key={od.orderDetailId}>
                <td className="border p-2">{od.productName}</td>
                <td className="border p-2">{od.qty}</td>
                <td className="border p-2">{od.price}</td>
                <td className="border p-2">{od.discountAmount}</td>
                <td className="border p-2">{od.finalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VoucherView;
