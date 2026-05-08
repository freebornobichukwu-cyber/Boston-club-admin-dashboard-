import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from environment variables
// Clean the URL in case the user pasted the direct REST API endpoint
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
if (supabaseUrl.endsWith('/rest/v1/') || supabaseUrl.endsWith('/rest/v1')) {
  supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '');
}
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a singleton client instance
export const supabase = 
  supabaseUrl && supabaseAnonKey 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null;

// Mock data structures for the demonstration until Supabase is connected
export const MOCK_DATA = {
  stats: [
    { label: "Total Revenue", value: "$45,231.89", trend: "+20.1% from last month", isPositive: true },
    { label: "Active Users", value: "+2350", trend: "+180.1% from last month", isPositive: true },
    { label: "Sales", value: "+12,234", trend: "+19% from last month", isPositive: true },
    { label: "Active Now", value: "573", trend: "+201 since last hour", isPositive: true }
  ],
  revenueData: [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
    { name: 'Jul', value: 7000 },
    { name: 'Aug', value: 8500 },
    { name: 'Sep', value: 7200 },
    { name: 'Oct', value: 9000 },
    { name: 'Nov', value: 8000 },
    { name: 'Dec', value: 11000 },
  ],
  salesByCategory: [
    { name: 'Electronics', value: 400 },
    { name: 'Apparel', value: 300 },
    { name: 'Home & Garden', value: 300 },
    { name: 'Beauty', value: 200 },
  ],
  recentOrders: [
    { id: "ORD-7352", customer: "Liam Johnson", product: "MacBook Pro 16\"", date: "2026-05-08", amount: "$2,499.00", status: "Delivered" },
    { id: "ORD-7353", customer: "Olivia Williams", product: "AirPods Pro", date: "2026-05-08", amount: "$249.00", status: "Processing" },
    { id: "ORD-7354", customer: "Noah Brown", product: "Ergonomic Chair", date: "2026-05-07", amount: "$350.00", status: "Shipped" },
    { id: "ORD-7355", customer: "Emma Davis", product: "Desk Mat", date: "2026-05-07", amount: "$35.00", status: "Delivered" },
    { id: "ORD-7356", customer: "Ava Miller", product: "Wireless Mouse", date: "2026-05-06", amount: "$89.99", status: "Processing" },
    { id: "ORD-7357", customer: "William Wilson", product: "Mechanical Keyboard", date: "2026-05-05", amount: "$150.00", status: "Cancelled" },
    { id: "ORD-7358", customer: "Sophia Moore", product: "27\" 4K Monitor", date: "2026-05-05", amount: "$450.00", status: "Delivered" }
  ]
};
