import { ArrowUpRight, ArrowDownRight, DollarSign, Users, ShoppingBag, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { MOCK_DATA } from '../lib/supabase';
import { useEffect, useState } from 'react';

export function StatCards() {
  const [stats, setStats] = useState(MOCK_DATA.stats);

  // In a real implementation with Supabase, we would fetch these:
  // useEffect(() => {
  //   fetchStats();
  // }, []);

  const icons = [DollarSign, Users, ShoppingBag, Activity];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const Icon = icons[i % icons.length];
        return (
          <div key={stat.label} className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">{stat.label}</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Icon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold mt-1 text-slate-900">{stat.value}</span>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold mt-1",
                stat.isPositive ? "text-emerald-500" : "text-rose-500"
              )}>
                {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.trend}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
