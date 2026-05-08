import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', category_id: '' });

  const fetchProducts = async () => {
    setLoading(true);
    if (!supabase) {
      // Mock data fallback
      setProducts([
        { id: 1, name: 'Boston Classic Oxford', description: 'Premium leather oxford shoes', category_id: 'Shoe' },
        { id: 2, name: 'Heritage Loafer', description: 'Slip-on penny loafer', category_id: 'Shoe' },
      ]);
      setLoading(false);
      return;
    }

    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    await supabase.from('products').insert([formData]);
    setShowForm(false);
    setFormData({ name: '', description: '', category_id: '' });
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    if (!supabase || !confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Products</h1>
          <p className="text-sm text-slate-500">Manage your product catalog</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={addProduct} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">New Product</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
              <input required type="text" className="w-full border-slate-200 rounded-lg text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
              <input required type="text" className="w-full border-slate-200 rounded-lg text-sm" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} />
            </div>
            <div className="col-span-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
              <textarea required rows={3} className="w-full border-slate-200 rounded-lg text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700">Save Product</button>
          </div>
        </form>
      )}

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={product.id} 
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-indigo-600 hover:text-indigo-800">
                      <Link to={`/products/${product.id}`}>{product.name}</Link>
                    </td>
                    <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{product.description}</td>
                    <td className="px-6 py-4 text-slate-500">{product.category_id}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/products/${product.id}`} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => deleteProduct(product.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No products yet</h3>
            <p className="mt-1 text-sm text-slate-500">Get started by adding a new product to your store.</p>
          </div>
        )}
      </div>
    </div>
  );
}
