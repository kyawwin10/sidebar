import React, { useState } from "react";
import { cn } from "@/lib/utils";
import OrderedColumns from "./chunks/OrderedColumns";
import DeliveryColumns from "./chunks/DeliveryColumns";
import CompletedColumns from "./chunks/CompletedColumns";
import CancelColumns from "./chunks/CancelColumns";

const DeliveryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ordered");

  const tabs = [
    { key: "ordered", label: "Ordered" },
    { key: "delivering", label: "Delivering" },
    { key: "completed", label: "Completed" },
    { key: "cancel", label: "Cancel" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header Tabs */}
      <div className="flex justify-center gap-6 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-6 py-2 rounded-2xl text-lg font-semibold text-white backdrop-blur-lg bg-white/10 border border-white/30 shadow-md transition-all",
              activeTab === tab.key && "bg-white/30 scale-105"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Show Table Based on Tab */}
      <div className="p-4 rounded-xl bg-white/40 backdrop-blur-md shadow-lg">
        {activeTab === "ordered" && <OrderedColumns />}
        {activeTab === "delivering" && <DeliveryColumns />}
        {activeTab === "completed" && <CompletedColumns />}
        {activeTab === "cancel" && <CancelColumns />}
      </div>
    </div>
  );
};

export default DeliveryView;
