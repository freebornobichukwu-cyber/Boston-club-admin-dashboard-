import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Package, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';

const STATUSES = [
  'payment_pending', 
  'order_confirmed', 
  'production_in_progress', 
  'ready_to_ship', 
  'shipped', 
  'delivered'
];

export function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchOrders = async () => {
    setLoading(true);
    if (!supabase) return;

    let query = supabase
      .from('orders')
      .select('*, customers(full_name, email)')
      .order('created_at', { ascending: false });
    
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    
    const { data, error } = await query;
    if (error) console.error(error);
    if (data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const updateStatus = async (id: string, newStatus: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (error) alert(error.message);
    fetchOrders();
  };

  const toggleVerification = async (id: string, currentStatus: boolean) => {
    if (!supabase) return;
    const { error } = await supabase
      .from('orders')
      .update({ 
        admin_verified: !currentStatus,
        paid_at: !currentStatus ? new Date().toISOString() : null
      })
      .eq('id', id);
    
    if (error) alert(error.message);
    fetchOrders();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Order Management</h1>
          <p className="text-sm text-slate-500">Manage manual payment verification and fulfillment</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-slate-200 rounded-lg text-sm bg-white"
          >
            <option value="all">All Orders</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
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
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Tracking</th>
                  <th className="px-6 py-4 text-center">Status</th>
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
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{order.payment_reference || order.id.slice(0, 8)}</span>
                        <span className="text-[10px] text-slate-400 uppercase">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-[10px]">
                        {order.whatsapp_reference && (
                          <a href={`https://wa.me/${order.whatsapp_reference}?text=Regarding order ${order.payment_reference}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-600 font-bold hover:underline">
                            <ExternalLink className="w-3 h-3" /> WhatsApp
                          </a>
                        )}
                        {order.payment_proof_url && (
                          <a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-600 font-bold hover:underline">
                            <ExternalLink className="w-3 h-3" /> Proof of Payment
                          </a>
                        )}
                        {!order.whatsapp_reference && !order.payment_proof_url && (
                          <span className="text-slate-400">No additional details</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-medium">{order.customers?.full_name || 'Anonymous'}</span>
                        <span className="text-xs text-slate-400">{order.customers?.email || order.customer_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleVerification(order.id, order.admin_verified)}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors",
                          order.admin_verified 
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        )}
                      >
                        {order.admin_verified ? (
                          <><CheckCircle2 className="w-3 h-3" /> Paid</>
                        ) : (
                          <><XCircle className="w-3 h-3" /> Pending</>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">${order.total_amount?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs uppercase">
                      <div className="flex items-center gap-2">
                        {order.tracking_code || 'Pending...'}
                        <button 
                          onClick={() => {
                            const newTracking = prompt('Enter new tracking code:', order.tracking_code || '');
                            if (newTracking !== null) {
                              supabase?.from('orders').update({ tracking_code: newTracking, status: 'shipped' }).eq('id', order.id).then(() => fetchOrders());
                            }
                          }}
                          className="text-indigo-600 hover:bg-indigo-50 p-1 rounded transition-colors"
                          title="Update Tracking"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={cn(
                          "px-2 py-1 text-xs font-bold rounded-md uppercase border focus:outline-none appearance-none cursor-pointer w-40 text-center",
                          order.status === 'delivered' && "bg-emerald-50 text-emerald-600 border-emerald-100",
                          order.status === 'production_in_progress' && "bg-indigo-50 text-indigo-600 border-indigo-100",
                          (order.status === 'shipped' || order.status === 'ready_to_ship') && "bg-blue-50 text-blue-600 border-blue-100",
                          order.status === 'payment_pending' && "bg-rose-50 text-rose-600 border-rose-100",
                          order.status === 'order_confirmed' && "bg-slate-50 text-slate-600 border-slate-200"
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
            <p className="mt-1 text-sm text-slate-500">Orders from customers paying via bank transfer will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
