import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MOCK_DATA } from "../lib/supabase";

export function RevenueChart() {
  return (
    <div className="glass-card p-6 flex flex-col gap-6 col-span-1 lg:col-span-2 hidden sm:flex">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800">Revenue Analytics</h3>
          <p className="text-sm text-slate-500">Monthly revenue for the current year</p>
        </div>
        <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/20">
          <option>This Year</option>
          <option>Last Year</option>
        </select>
      </div>
      
      <div className="h-[300px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_DATA.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(value) => `$${value/1000}k`} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
              itemStyle={{ color: '#0F172A', fontWeight: 600 }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CategoryChart() {
  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#8B5CF6'];

  return (
    <div className="glass-card p-6 flex flex-col gap-6 col-span-1 hidden sm:flex">
      <div>
        <h3 className="font-bold text-slate-800">Sales by Category</h3>
        <p className="text-sm text-slate-500">Distribution of sales volume</p>
      </div>
      
      <div className="h-[300px] w-full flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={MOCK_DATA.salesByCategory}
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {MOCK_DATA.salesByCategory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-semibold text-slate-900">1,200</span>
          <span className="text-sm text-slate-500">Total Sales</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        {MOCK_DATA.salesByCategory.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            <span className="text-sm text-slate-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
