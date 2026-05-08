import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', category_id: '' });

  const fetchData = async () => {
    setLoading(true);
    if (!supabase) {
      setProducts([
        { id: 1, name: 'Boston Classic Oxford', description: 'Premium leather oxford shoes', category_id: 'Shoes' },
        { id: 2, name: 'Heritage Loafer', description: 'Slip-on penny loafer', category_id: 'Shoes' },
      ]);
      setCategories([{ id: 'Shoes', title: 'Shoes' }, { id: 'Sandals', title: 'Sandals' }]);
      setLoading(false);
      return;
    }

    const { data: catData } = await supabase.from('categories').select('*');
    if (catData) setCategories(catData);

    const { data: prodData } = await supabase.from('products').select('*');
    if (prodData) setProducts(prodData);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.from('products').insert([formData]);
    if (error) {
      alert(error.message);
      return;
    }
    setShowForm(false);
    setFormData({ name: '', description: '', category_id: '' });
    fetchData();
  };

  const deleteProduct = async (id: string) => {
    if (!supabase || !confirm('Deleting a product will remove its variants. Continue?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert(error.message);
    fetchData();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Boston Club Catalog</h1>
          <p className="text-sm text-slate-500">Manage products and their variants</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'New Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addProduct} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Product Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Product Name</label>
              <input required type="text" placeholder="e.g. Arizona Suede" className="w-full border-slate-200 rounded-lg text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
              <select required className="w-full border-slate-200 rounded-lg text-sm" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.title || c.name || c.id}</option>)}
              </select>
            </div>
            <div className="col-span-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
              <textarea required rows={3} placeholder="Describe the style and heritage..." className="w-full border-slate-200 rounded-lg text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-indigo-700">Save & Close</button>
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
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={product.id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <Link to={`/products/${product.id}`} className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{product.name}</span>
                        <span className="text-xs text-slate-400 truncate max-w-xs">{product.description}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {product.category_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">#{product.id.toString().slice(0, 6)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/products/${product.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => deleteProduct(product.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
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
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Your catalog is empty</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">Start by adding your first product style. You can add variants for size and color after creating the base product.</p>
            <button 
              onClick={() => setShowForm(true)}
              className="mt-6 bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
