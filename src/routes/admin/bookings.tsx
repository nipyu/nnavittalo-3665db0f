import { createFileRoute } from "@tanstack/react-router";
import { useBookings, useUpdateBookingStatus } from "@/hooks/use-bookings";
import { usePackages } from "@/hooks/use-packages";
import { useState, useMemo } from "react";
import { showToast } from "@/components/nna/Toast";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/bookings")({
  component: BookingsAdminPage,
});

function BookingsAdminPage() {
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const { data: packages, isLoading: pkgsLoading } = usePackages(true);
  const updateStatus = useUpdateBookingStatus();

  const [search, setSearch] = useState("");
  const [filterPkgId, setFilterPkgId] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b) => {
      const matchSearch =
        search === "" ||
        b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        b.customer_email.toLowerCase().includes(search.toLowerCase()) ||
        b.id.toLowerCase().includes(search.toLowerCase());

      const matchPkg = filterPkgId === "all" || b.package_id === filterPkgId;
      const matchStatus = filterStatus === "all" || b.payment_status === filterStatus;

      return matchSearch && matchPkg && matchStatus;
    });
  }, [bookings, search, filterPkgId, filterStatus]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      showToast("✅ Status updated!");
    } catch (e) {
      showToast("❌ Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Refunded":
        return "bg-gray-100 text-gray-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (bookingsLoading || pkgsLoading) {
    return <div className="p-8">Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 font-['Montserrat']">Customer Bookings</h2>
        <div className="flex gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border shadow-sm">
          Total Bookings: <span className="font-bold text-gray-900">{bookings?.length || 0}</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-2">
          <input
            type="text"
            placeholder="Search by name, email, or booking ID..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0f2266] outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0f2266] outline-none"
            value={filterPkgId}
            onChange={(e) => setFilterPkgId(e.target.value)}
          >
            <option value="all">All Packages</option>
            {packages?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.emoji} {p.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0f2266] outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No bookings found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(b.booking_date), "MMM d, yyyy")}
                      <div className="text-xs text-gray-400 mt-1">
                        ID: {b.id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{b.customer_name}</div>
                      <div className="text-sm text-gray-500">{b.customer_email}</div>
                      <div className="text-xs text-gray-400">{b.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm text-gray-900 max-w-xs truncate"
                        title={b.packages?.title}
                      >
                        {b.packages?.title || "Unknown Package"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Travel: {b.packages?.trip_date || "TBA"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {b.total_paid_pln} PLN
                      </div>
                      {b.total_paid_eur && (
                        <div className="text-xs text-gray-500">{b.total_paid_eur} EUR</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusBadge(b.payment_status)} outline-none cursor-pointer appearance-none text-center`}
                        value={b.payment_status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Refunded">Refunded</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
