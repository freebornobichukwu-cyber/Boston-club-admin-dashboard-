import { MoreHorizontal } from "lucide-react";
import { MOCK_DATA } from "../lib/supabase";
import { cn } from "../lib/utils";

export function RecentOrders() {
  return (
    <div className="glass-card flex flex-col col-span-1 lg:col-span-3 overflow-hidden">
      <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800">Recent Orders</h3>
          <p className="text-sm text-slate-500">Checkout latest orders in the store</p>
        </div>
        <button className="text-indigo-600 text-xs font-bold hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-[#E2E8F0]">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Amount</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
              <th className="px-6 py-4 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {MOCK_DATA.recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-slate-600">
                      {order.customer.split(' ').map(n => n[0]).join('')}
                    </div>
                    {order.customer}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{order.product}</td>
                <td className="px-6 py-4 text-slate-600">{order.date}</td>
                <td className="px-6 py-4 text-right font-medium text-slate-900">{order.amount}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className={cn(
                      "px-2 py-1 text-[10px] font-bold rounded-md uppercase border",
                      order.status === "Delivered" && "bg-emerald-50 text-emerald-600 border-emerald-100",
                      order.status === "Processing" && "bg-indigo-50 text-indigo-600 border-indigo-100",
                      order.status === "Shipped" && "bg-amber-50 text-amber-600 border-amber-100",
                      order.status === "Cancelled" && "bg-rose-50 text-rose-600 border-rose-100"
                    )}>
                      {order.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button className="text-slate-400 hover:text-slate-900 p-1 rounded hover:bg-slate-100">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
