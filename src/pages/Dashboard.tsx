import { useState, useEffect } from 'react';
import { Database, X } from 'lucide-react';
import { StatCards } from '../components/StatCards';
import { RevenueChart, CategoryChart } from '../components/DashboardCharts';
import { RecentOrders } from '../components/RecentOrders';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

function SupabaseNotice() {
  const [visible, setVisible] = useState(!supabase);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
          className="bg-indigo-600 text-white px-4 py-3 flex items-start sm:items-center justify-between shadow-md relative z-50 mb-8 rounded-xl"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg hidden sm:block">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">Supabase Not Connected</p>
              <p className="text-indigo-100 text-xs mt-0.5 max-w-2xl">
                You are currently viewing layout preview data. To load your real-time sales data, add <code className="bg-indigo-800 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="bg-indigo-800 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> to the <span className="font-semibold">.env</span> via the Platform Secrets menu.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setVisible(false)}
            className="p-1 hover:bg-indigo-500 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Dashboard() {
  return (
    <>
      <SupabaseNotice />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        <h1 className="text-xl font-bold text-slate-800">Store Overview</h1>
        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Live Data</span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatCards />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <RevenueChart />
        <CategoryChart />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <RecentOrders />
      </motion.div>
    </>
  );
}
