import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Download, FileText } from "lucide-react";
import api from "@/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface OrderDetail {
  orderDetailId: string;
  productName: string;
  qty: number;
  price: number;
  discountAmount: number;
  finalPrice: number;
}

interface Voucher {
  orderId: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  description?: string;
  orderDetails: OrderDetail[];
}

interface VoucherViewProps {
  orderId: string;
  onClose: () => void;
}

const VoucherView: React.FC<VoucherViewProps> = ({ orderId, onClose }) => {
  const { data: voucher, isLoading, error } = api.delivery.useVoucherByOrderId(orderId);
  const printRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!printRef.current) return;

    try {
      const element = printRef.current;
      
      // Show loading state
      const originalButtonText = document.querySelector('.download-button')?.textContent;
      const downloadButton = document.querySelector('.download-button') as HTMLButtonElement;
      if (downloadButton) {
        downloadButton.disabled = true;
        downloadButton.innerHTML = '<span>Generating PDF...</span>';
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollY: -window.scrollY,
        onclone: (clonedDoc) => {
          // Ensure all content is visible for PDF generation
          const scrollElement = clonedDoc.getElementById('voucher-scroll');
          if (scrollElement) {
            scrollElement.style.overflow = 'visible';
            scrollElement.style.maxHeight = 'none';
            scrollElement.style.height = 'auto';
          }
          
          // Hide buttons in the PDF
          const buttons = clonedDoc.querySelectorAll('button');
          buttons.forEach(button => {
            button.style.display = 'none';
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      
      let imgPDFWidth = pdfWidth;
      let imgPDFHeight = pdfWidth / ratio;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, 0, imgPDFWidth, imgPDFHeight);
      
      // Add additional pages if content is too long
      let heightLeft = imgPDFHeight;
      let position = 0;
      let pageCount = 1;

      while (heightLeft >= pdfHeight) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -position, imgPDFWidth, imgPDFHeight);
        heightLeft -= pdfHeight;
        pageCount++;
      }

      pdf.save(`voucher-${voucher?.orderId || orderId}.pdf`);

      // Restore button state
      if (downloadButton) {
        downloadButton.disabled = false;
        downloadButton.innerHTML = '<Download className="h-4 w-4 mr-2" /><span>Download Voucher</span>';
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Restore button state on error
      const downloadButton = document.querySelector('.download-button') as HTMLButtonElement;
      if (downloadButton) {
        downloadButton.disabled = false;
        downloadButton.innerHTML = '<Download className="h-4 w-4 mr-2" /><span>Download Voucher</span>';
      }
      
      alert('Failed to download voucher. Please try again.');
    }
  };

  // Alternative PDF generation method with better table formatting
  const handleDownloadFormatted = async () => {
    if (!voucher) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let yPosition = margin;

      // Add header with gradient background
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, pageWidth, 50, 'F');
      
      // Header text
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ORDER VOUCHER', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Order ID: ${voucher.orderId}`, pageWidth / 2, 30, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 37, { align: 'center' });

      yPosition = 60;

      // Summary section
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ORDER SUMMARY', margin, yPosition);
      yPosition += 10;

      // Summary cards
      const cardWidth = (pageWidth - 2 * margin - 10) / 2;
      const cardHeight = 20;

      // First row
      drawSummaryCard(pdf, margin, yPosition, cardWidth, cardHeight, 
        'Total Amount', `$${voucher.totalAmount.toFixed(2)}`, 
        [59, 130, 246], [239, 246, 255]);

      drawSummaryCard(pdf, margin + cardWidth + 5, yPosition, cardWidth, cardHeight,
        'Discount', `-$${voucher.discountAmount.toFixed(2)}`,
        [34, 197, 94], [240, 253, 244]);

      yPosition += cardHeight + 8;

      // Second row
      drawSummaryCard(pdf, margin, yPosition, cardWidth, cardHeight,
        'Final Amount', `$${voucher.finalAmount.toFixed(2)}`,
        [147, 51, 234], [250, 245, 255]);

      drawSummaryCard(pdf, margin + cardWidth + 5, yPosition, cardWidth, cardHeight,
        'Savings', `$${voucher.discountAmount.toFixed(2)}`,
        [107, 114, 128], [249, 250, 251]);

      yPosition += cardHeight + 20;

      // Description
      // if (voucher.description) {
      //   pdf.setFontSize(12);
      //   pdf.setFont('helvetica', 'bold');
      //   pdf.text('DESCRIPTION', margin, yPosition);
      //   yPosition += 6;
        
      //   pdf.setFontSize(10);
      //   pdf.setFont('helvetica', 'normal');
      //   const descriptionLines = pdf.splitTextToSize(voucher.description, pageWidth - 2 * margin);
      //   pdf.text(descriptionLines, margin, yPosition);
      //   yPosition += descriptionLines.length * 5 + 10;
      // }

      // Order Items table
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ORDER ITEMS', margin, yPosition);
      yPosition += 8;

      // Table header
      pdf.setFillColor(243, 244, 246);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
      pdf.setDrawColor(209, 213, 219);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8);
      
      pdf.setFontSize(9);
      pdf.setTextColor(55, 65, 81);
      pdf.text('PRODUCT', margin + 3, yPosition + 5.5);
      pdf.text('QTY', margin + 100, yPosition + 5.5);
      pdf.text('PRICE', margin + 120, yPosition + 5.5);
      pdf.text('DISCOUNT', margin + 145, yPosition + 5.5);
      pdf.text('FINAL', pageWidth - margin - 15, yPosition + 5.5, { align: 'right' });

      yPosition += 8;

      // Table rows
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      
      voucher.orderDetails.forEach((item, index) => {
        // Check if we need a new page
        if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
          pdf.addPage();
          yPosition = margin;
          
          // Redraw table header on new page
          pdf.setFillColor(243, 244, 246);
          pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
          pdf.setDrawColor(209, 213, 219);
          pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8);
          
          pdf.setFontSize(9);
          pdf.setTextColor(55, 65, 81);
          pdf.text('PRODUCT', margin + 3, yPosition + 5.5);
          pdf.text('QTY', margin + 100, yPosition + 5.5);
          pdf.text('PRICE', margin + 120, yPosition + 5.5);
          pdf.text('DISCOUNT', margin + 145, yPosition + 5.5);
          pdf.text('FINAL', pageWidth - margin - 15, yPosition + 5.5, { align: 'right' });
          
          yPosition += 8;
        }

        // Alternate row background
        if (index % 2 === 0) {
          pdf.setFillColor(249, 250, 251);
          pdf.rect(margin, yPosition, pageWidth - 2 * margin, 7, 'F');
        }

        // Product name (truncate if too long)
        const productName = item.productName.length > 35 
          ? item.productName.substring(0, 32) + '...' 
          : item.productName;
        
        pdf.setTextColor(0, 0, 0);
        pdf.text(productName, margin + 3, yPosition + 4.5);
        
        // Quantity
        pdf.text(item.qty.toString(), margin + 100, yPosition + 4.5);
        
        // Price
        pdf.text(`$${item.price.toFixed(2)}`, margin + 120, yPosition + 4.5);
        
        // Discount
        pdf.setTextColor(239, 68, 68);
        pdf.text(`-$${item.discountAmount.toFixed(2)}`, margin + 145, yPosition + 4.5);
        
        // Final Price
        pdf.setTextColor(34, 197, 94);
        pdf.text(`$${item.finalPrice.toFixed(2)}`, pageWidth - margin - 15, yPosition + 4.5, { align: 'right' });

        yPosition += 7;
      });

      // Footer
      yPosition += 10;
      pdf.setDrawColor(229, 231, 235);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text('Thank you for your order!', pageWidth / 2, yPosition, { align: 'center' });

      pdf.save(`voucher-${voucher.orderId}.pdf`);

    } catch (error) {
      console.error('Error generating formatted PDF:', error);
      alert('Failed to download voucher. Please try again.');
    }
  };

  // Helper function to draw summary cards
  const drawSummaryCard = (
    pdf: jsPDF, 
    x: number, 
    y: number, 
    width: number, 
    height: number,
    title: string,
    value: string,
    textColor: [number, number, number],
    bgColor: [number, number, number]
  ) => {
    pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    pdf.rect(x, y, width, height, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(x, y, width, height);
    
    pdf.setFontSize(8);
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.text(title, x + 5, y + 5);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(value, x + 5, y + 12);
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
              <p className="text-blue-100 text-sm">Generated on: {new Date().toLocaleDateString()}</p>
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
                <p className="text-2xl font-bold text-blue-900">${voucher.totalAmount.toFixed(2)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <p className="text-sm text-green-600 font-medium">Discount</p>
                <p className="text-2xl font-bold text-green-900">-${voucher.discountAmount.toFixed(2)}</p>
                <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                  {discountPercentage}%
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <p className="text-sm text-purple-600 font-medium">Final Amount</p>
                <p className="text-2xl font-bold text-purple-900">${voucher.finalAmount.toFixed(2)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 font-medium">Savings</p>
                <p className="text-2xl font-bold text-gray-900">${voucher.discountAmount.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {/* {voucher.description && (
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-black font-medium">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800">{voucher.description}</p>
              </CardContent>
            </Card>
          )} */}

          {/* Order Items */}
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-black font-bold">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-black">Product</th>
                      <th className="text-center py-3 px-4 font-semibold text-black">Qty</th>
                      <th className="text-right py-3 px-4 font-semibold text-black">Price</th>
                      <th className="text-right py-3 px-4 font-semibold text-black">Discount</th>
                      <th className="text-right py-3 px-4 font-semibold text-black">Final Price</th>
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
                        <td className="py-3 px-4 text-right text-gray-600">${od.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right text-red-600">-${od.discountAmount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-green-600">${od.finalPrice.toFixed(2)}</td>
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
                <Button onClick={handleDownloadFormatted} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white print:bg-gray-800">
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