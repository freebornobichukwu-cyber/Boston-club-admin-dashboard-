import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Package } from 'lucide-react';

const STATUSES = ['payment_pending', 'order_confirmed', 'production_in_progress', 'ready_to_ship', 'shipped', 'delivered'];

export function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    if (!supabase) {
      setOrders([
        { id: 'ORD-1', customer_id: 'CUST-A', total_amount: 120.50, status: 'order_confirmed', created_at: new Date().toISOString() },
        { id: 'ORD-2', customer_id: 'CUST-B', total_amount: 85.00, status: 'shipped', created_at: new Date(Date.now() - 86400000).toISOString() },
      ]);
      setLoading(false);
      return;
    }

    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    if (!supabase) return;
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    fetchOrders();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Orders</h1>
          <p className="text-sm text-slate-500">Manage customer orders and fulfillments</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={order.id} 
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-500">{order.customer_id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">${order.total_amount?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={cn(
                          "px-2 py-1 text-xs font-bold rounded-md uppercase border focus:outline-none appearance-none cursor-pointer",
                          order.status === 'delivered' && "bg-emerald-50 text-emerald-600 border-emerald-100",
                          order.status === 'production_in_progress' && "bg-indigo-50 text-indigo-600 border-indigo-100",
                          (order.status === 'shipped' || order.status === 'ready_to_ship') && "bg-amber-50 text-amber-600 border-amber-100",
                          (order.status === 'payment_pending' || order.status === 'order_confirmed') && "bg-slate-50 text-slate-600 border-slate-200"
                        )}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No orders yet</h3>
            <p className="mt-1 text-sm text-slate-500">When customers place an order, it will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
