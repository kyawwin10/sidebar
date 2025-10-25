import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Download, FileText } from "lucide-react";
import api from "@/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface VoucherViewProps {
  orderId: string;
  onClose: () => void;
}

const VoucherView: React.FC<VoucherViewProps> = ({ orderId, onClose }) => {
  const { data: voucher, isLoading, error } = api.delivery.useVoucherByOrderId(orderId);
  const printRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 min-h-screen bg-black/40 flex justify-center items-center p-4 z-50 animate-in fade-in">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50 animate-in fade-in">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Voucher</h3>
            <p className="text-gray-600 mb-4">Unable to load voucher details. Please try again.</p>
            <Button onClick={onClose}>Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50 animate-in fade-in">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Voucher Found</h3>
            <p className="text-gray-600 mb-4">No voucher available for this order.</p>
            <Button onClick={onClose}>Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const discountPercentage = ((voucher.discountAmount / voucher.totalAmount) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-start p-4 z-50 animate-in fade-in">
  <div ref={printRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden print:shadow-none print:max-h-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 print:bg-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Order Voucher</h2>
              </div>
              <p className="text-blue-100">Order ID: {voucher.orderId}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="print:hidden"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          id="voucher-scroll"
          className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)] print:overflow-visible print:max-h-none"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-blue-600 font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-blue-900">${voucher.totalAmount}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <p className="text-sm text-green-600 font-medium">Discount</p>
                <p className="text-2xl font-bold text-green-900">-${voucher.discountAmount}</p>
                <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                  {discountPercentage}%
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <p className="text-sm text-purple-600 font-medium">Final Amount</p>
                <p className="text-2xl font-bold text-purple-900">${voucher.finalAmount}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 font-medium">Savings</p>
                <p className="text-2xl font-bold text-gray-900">${voucher.discountAmount}</p>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {voucher.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{voucher.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Qty</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Price</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Discount</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Final Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voucher.orderDetails.map((od, index) => (
                      <tr 
                        key={od.orderDetailId} 
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index === voucher.orderDetails.length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{od.productName}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline" className="bg-gray-100">
                            {od.qty}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">${od.price}</td>
                        <td className="py-3 px-4 text-right text-red-600">-${od.discountAmount}</td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">${od.finalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 print:hidden">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Thank you for your order!</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  <span>Download Voucher</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VoucherView;