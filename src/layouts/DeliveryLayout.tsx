import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useOrdersByStatus,
  useAllOrders,
  useDeliveryAccess, // ✅ single hook handles accept/complete/reject
} from "@/api/delivery";
import VoucherView from "@/modules/delivery/chunks/VoucherView";
import DeliveryNavBar from "@/components/DeliveryNavBar";

const DeliveryLayout = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [voucherOrderId, setVoucherOrderId] = useState<string | null>(null);

  const { data: orders = [] } = useOrdersByStatus("ordered");
  const { data: deliveredOrders = [] } = useAllOrders();

  const deliveryAccess = useDeliveryAccess(); // ✅ new mutation

  return (
    <div className="min-h-screen bg-white">
      <DeliveryNavBar />
      <div className="px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "orders"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "delivered"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("delivered")}
          >
            Delivered Orders
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "orders" ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">Active Orders</h2>
              <table className="w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Order ID</th>
                    <th className="border p-2">Customer</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="border p-2">{order.orderId}</td>
                      <td className="border p-2">{order.userName}</td>
                      <td className="border p-2">{order.totalAmount}</td>
                      <td className="border p-2">{order.status}</td>
                      <td className="border p-2 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            deliveryAccess.mutate({
                              orderId: order.orderId as string,
                              status: "Accept",
                            })
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setVoucherOrderId(order.orderId!)}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">Delivered Orders</h2>
              <table className="w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Order ID</th>
                    <th className="border p-2">Customer</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveredOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="border p-2">{order.orderId}</td>
                      <td className="border p-2">{order.userName}</td>
                      <td className="border p-2">{order.totalAmount}</td>
                      <td className="border p-2">{order.status}</td>
                      <td className="border p-2 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            deliveryAccess.mutate({
                              orderId: order.orderId as string,
                              status: "Complete",
                            })
                          }
                        >
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            deliveryAccess.mutate({
                              orderId: order.orderId as string,
                              status: "Reject",
                            })
                          }
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {voucherOrderId && (
        <VoucherView
          orderId={voucherOrderId}
          onClose={() => setVoucherOrderId(null)}
        />
      )}
    </div>
  );
};

export default DeliveryLayout;
