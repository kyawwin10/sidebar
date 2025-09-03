import { useState } from "react";
import { categoryApi } from "@/api/category";
import AddCategoryDialog from "./chunk/AddCategoryDialog";
import AddBrandDialog from "./chunk/AddBrandDialog";
import AddDoctorDialog from "./chunk/AddDoctorDialog";
import AddSupplierDialog from "./chunk/AddSupplierDialog";
import api from "@/api";

const ROWS_PER_PAGE = 7;

const CategoryView = () => {
  const [tab, setTab] = useState<"brand" | "category" | "supplier" | "doctor" | "booking">("brand");
  const [openBrandDialog, setOpenBrandDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openDoctorDialog, setOpenDoctorDialog] = useState(false);
  const [openSupplierDialog, setOpenSupplierDialog] = useState(false);
  const [page, setPage] = useState(1);

  const { data: brands } = categoryApi.useBrands();
  const { data: categories } = categoryApi.useCategories();
  const { data: doctors } = api.booking.bookingApi.useDoctors();
  const { data: suppliers } = api.supplier.supplierApi.useSupplierHistory();
  const { data: bookings } = api.booking.bookingApi.useBookings();

  // Reset page when tab changes
  const changeTab = (t: typeof tab) => {
    setTab(t);
    setPage(1);
  };

  // Paginate function
  const paginate = <T,>(rows: T[] | undefined) => {
    if (!rows) return [];
    const start = (page - 1) * ROWS_PER_PAGE;
    return rows.slice(start, start + ROWS_PER_PAGE);
  };

  // Get current data and total pages
  const getData = () => {
    switch (tab) {
      case "brand": return brands || [];
      case "category": return categories || [];
      case "supplier": return suppliers || [];
      case "doctor": return doctors || [];
      case "booking": return bookings || [];
      default: return [];
    }
  };

  const totalPages = Math.ceil(getData().length / ROWS_PER_PAGE);

  return (
    <div className="flex gap-6  h-auto overflow-y-hidden text-white">
      {/* Sidebar */}
      <div className="flex flex-col gap-4 p-4 bg-white/10 rounded-2xl shadow-lg">
        <button onClick={() => setOpenBrandDialog(true)} className="px-4 py-2 rounded-xl bg-blue-500/70">➕ Add Brand</button>
        <button onClick={() => setOpenCategoryDialog(true)} className="px-4 py-2 rounded-xl bg-green-500/70">➕ Add Category</button>
        <button onClick={() => setOpenDoctorDialog(true)} className="px-4 py-2 rounded-xl bg-purple-500/70">➕ Add Doctor</button>
        <button onClick={() => setOpenSupplierDialog(true)} className="px-4 py-2 rounded-xl bg-orange-500/70">➕ Add Supplier</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white/10 rounded-2xl shadow-xl">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-600 mb-4">
          {["brand", "category", "supplier", "doctor", "booking"].map((t) => (
            <button
              key={t}
              onClick={() => changeTab(t as typeof tab)}
              className={`pb-2 ${tab === t ? "border-b-2 border-blue-400 font-semibold" : "text-white"}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}s
            </button>
          ))}
        </div>

        {/* Tables */}
        <div className="overflow-y-hidden ">
          <table className="w-full text-left border border-gray-600 rounded-lg">
            <thead className="bg-gray-700 text-gray-200">
              {tab === "brand" && (
                <tr>
                  <th className="px-3 py-2 border border-gray-600">No</th>
                  <th className="px-3 py-2 border border-gray-600">BrandId</th>
                  <th className="px-3 py-2 border border-gray-600">BrandName</th>
                </tr>
              )}
              {tab === "category" && (
                <tr>
                  <th className="px-3 py-2 border border-gray-600">No</th>
                  <th className="px-3 py-2 border border-gray-600">CategoryId</th>
                  <th className="px-3 py-2 border border-gray-600">CategoryName</th>
                </tr>
              )}
              {tab === "supplier" && (
                <tr>
                  <th className="px-3 py-2 border border-gray-600">No</th>
                  <th className="px-3 py-2 border border-gray-600">SupplierName</th>
                  <th className="px-3 py-2 border border-gray-600">ProductCount</th>
                </tr>
              )}
              {tab === "doctor" && (
                <tr>
                  <th className="px-3 py-2 border border-gray-600">No</th>
                  <th className="px-3 py-2 border border-gray-600">Name</th>
                  <th className="px-3 py-2 border border-gray-600">Store</th>
                  <th className="px-3 py-2 border border-gray-600">Phone</th>
                  <th className="px-3 py-2 border border-gray-600">Email</th>
                </tr>
              )}
              {tab === "booking" && (
                <tr>
                  <th className="px-3 py-2 border border-gray-600">No</th>
                  <th className="px-3 py-2 border border-gray-600">BookingDate</th>
                  <th className="px-3 py-2 border border-gray-600">Doctor</th>
                  <th className="px-3 py-2 border border-gray-600">Doctor Phone</th>
                  <th className="px-3 py-2 border border-gray-600">Doctor Email</th>
                  <th className="px-3 py-2 border border-gray-600">Customer</th>
                  <th className="px-3 py-2 border border-gray-600">Store</th>
                  <th className="px-3 py-2 border border-gray-600">Description</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-gray-700">
              {tab === "brand" &&
                paginate(brands)?.map((b, i) => (
                  <tr key={b.brandId}>
                    <td className="px-3 py-2 border border-gray-600">{(page - 1) * ROWS_PER_PAGE + i + 1}</td>
                    <td className="px-3 py-2 border border-gray-600">{b.brandId}</td>
                    <td className="px-3 py-2 border border-gray-600">{b.brandName}</td>
                  </tr>
                ))}

              {tab === "category" &&
                paginate(categories)?.map((c, i) => (
                  <tr key={c.catId}>
                    <td className="px-3 py-2 border border-gray-600">{(page - 1) * ROWS_PER_PAGE + i + 1}</td>
                    <td className="px-3 py-2 border border-gray-600">{c.catId}</td>
                    <td className="px-3 py-2 border border-gray-600">{c.catName}</td>
                  </tr>
                ))}

              {tab === "supplier" &&
                paginate(suppliers)?.map((s, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 border border-gray-600">{(page - 1) * ROWS_PER_PAGE + i + 1}</td>
                    <td className="px-3 py-2 border border-gray-600">{s.supplierName}</td>
                    <td className="px-3 py-2 border border-gray-600">{s.productCount}</td>
                  </tr>
                ))}

              {tab === "doctor" &&
                paginate(doctors)?.map((d, i) => (
                  <tr key={d.doctorId}>
                    <td className="px-3 py-2 border border-gray-600">{(page - 1) * ROWS_PER_PAGE + i + 1}</td>
                    <td className="px-3 py-2 border border-gray-600">{d.name}</td>
                    <td className="px-3 py-2 border border-gray-600">{d.storeName}</td>
                    <td className="px-3 py-2 border border-gray-600">{d.phoneNumber}</td>
                    <td className="px-3 py-2 border border-gray-600">{d.email}</td>
                  </tr>
                ))}

              {tab === "booking" &&
                paginate(bookings)?.map((bk, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 border border-gray-600">{(page - 1) * ROWS_PER_PAGE + i + 1}</td>
                    <td className="px-3 py-2 border border-gray-600">{bk.bookingDate}</td>
                    <td className="px-3 py-2 border border-gray-600">{bk.doctorName}</td>
                    <td className="px-3 py-2 border border-gray-600">{bk.doctorPhone}</td>
                    <td className="px-3 py-2 border border-gray-600">{bk.doctorEmail}</td>
                    <td className="px-3 py-2 border border-gray-600">{bk.userName}</td>
                    <td className="px-3 py-2 border border-gray-600">{bk.storeName}</td>
                    <td className="px-3 py-2 border border-gray-600">{bk.bookingDescription}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 rounded-lg bg-gray-600 disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages || 1}
          </span>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-4 py-2 rounded-lg bg-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Dialogs */}
      {openBrandDialog && <AddBrandDialog onClose={() => setOpenBrandDialog(false)} />}
      {openCategoryDialog && <AddCategoryDialog onClose={() => setOpenCategoryDialog(false)} />}
      {openDoctorDialog && <AddDoctorDialog onClose={() => setOpenDoctorDialog(false)} />}
      {openSupplierDialog && <AddSupplierDialog onClose={() => setOpenSupplierDialog(false)} />}
    </div>
  );
};

export default CategoryView;
