import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import api from "@/api";
import { Order } from "@/api/delivery/types";
import VoucherView from "./VoucherView";

const CancelColumns: React.FC = () => {
  const { data = [], isLoading, error } = api.delivery.useOrdersByStatus("rejected");

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const columns: ColumnDef<Order>[] = [
    { accessorKey: "orderId", header: "Order ID" },
    { accessorKey: "userName", header: "Customer" },
    { accessorKey: "deliveryName", header: "Delivery" },
    { accessorKey: "orderPlace", header: "Place" },
    { accessorKey: "totalAmount", header: "Total Amount" },
    { accessorKey: "paymentType", header: "Payment" },
    { accessorKey: "paymentStatus", header: "Payment Status" },
    { accessorKey: "status", header: "Status" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button size="sm" onClick={() => setSelectedOrderId(row.original.orderId!)}>
          Detail
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error loading data</p>;

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* Voucher Modal */}
      {selectedOrderId && (
        <VoucherView
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
};

export default CancelColumns;
