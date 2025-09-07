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

  const deliveryAccess = useDeliveryAccess(); // ✅ mutation hook

  return (
    <div className="min-h-screen bg-gradient-to-l from-blue-500 to-pink-300">
      <DeliveryNavBar />
      <div className="px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-white/20 backdrop-blur-md">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "orders"
                ? "border-b-2 border-white text-white"
                : "text-white/70 hover:text-white"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "delivered"
                ? "border-b-2 border-white text-white"
                : "text-white/70 hover:text-white"
            }`}
            onClick={() => setActiveTab("delivered")}
          >
            Delivered Orders
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "orders" ? (
            <div className="rounded-2xl shadow-lg bg-white/30 backdrop-blur-md p-4">
              <h2 className="text-lg font-semibold mb-4 text-white">
                Active Orders
              </h2>
              <table className="w-full text-left border-collapse border border-white/30 text-white">
                <thead>
                  <tr className="bg-white/20">
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
            <div className="rounded-2xl shadow-lg bg-white/30 backdrop-blur-md p-4">
              <h2 className="text-lg font-semibold mb-4 text-white">
                Delivered Orders
              </h2>
              <table className="w-full text-left border-collapse border border-white/30 text-white">
                <thead>
                  <tr className="bg-white/20">
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
                          disabled={
                            order.status === "completed" ||
                            order.status === "reject"
                          }
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
                          disabled={
                            order.status === "completed" ||
                            order.status === "reject"
                          }
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
