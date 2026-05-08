import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';

export function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    size: '', 
    color: '', 
    material: 'leather', 
    footbed: 'soft footbed', 
    buckle_size: 'medium', 
    price: '', 
    stock_quantity: '',
    sku: ''
  });

  const fetchProduct = async () => {
    setLoading(true);
    if (!supabase) {
      setProduct({ id, name: 'Boston Classic Oxford', description: 'Premium leather oxford shoes', category_id: 'Shoe' });
      setVariants([
        { id: 1, size: '42', color: 'Black', material: 'leather', footbed: 'soft footbed', buckle_size: 'medium', price: 120, stock_quantity: 50, sku: 'BC-OX-BLK-42' },
      ]);
      setLoading(false);
      return;
    }

    const { data: productData } = await supabase.from('products').select('*').eq('id', id).single();
    if (productData) setProduct(productData);

    const { data: variantsData } = await supabase.from('product_variants').select('*').eq('product_id', id);
    if (variantsData) setVariants(variantsData || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const addVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    const { error } = await supabase.from('product_variants').insert([{
      product_id: id,
      ...formData,
      price: parseFloat(formData.price),
      stock_quantity: parseInt(formData.stock_quantity, 10)
    }]);
    
    if (error) {
      alert(error.message);
      return;
    }

    setShowForm(false);
    setFormData({
      size: '', color: '', material: 'leather', footbed: 'soft footbed', buckle_size: 'medium', price: '', stock_quantity: '', sku: ''
    });
    fetchProduct();
  };

  const deleteVariant = async (variantId: string) => {
    if (!supabase || !confirm('Are you sure?')) return;
    await supabase.from('product_variants').delete().eq('id', variantId);
    fetchProduct();
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link to="/products" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">{product?.name || 'Product Details'}</h1>
          <p className="text-sm text-slate-500">{product?.description}</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800">Product Variants</h2>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Add New Variant'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={addVariant} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">SKU</label>
              <input required type="text" placeholder="BC-SHOE-001" className="w-full border-slate-200 rounded-lg text-sm" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Size</label>
              <input required type="text" placeholder="e.g. 42" className="w-full border-slate-200 rounded-lg text-sm" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Color</label>
              <input required type="text" placeholder="e.g. Brown" className="w-full border-slate-200 rounded-lg text-sm" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Material</label>
              <select className="w-full border-slate-200 rounded-lg text-sm" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})}>
                <option value="leather">Leather</option>
                <option value="suede">Suede</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Footbed</label>
              <select className="w-full border-slate-200 rounded-lg text-sm" value={formData.footbed} onChange={e => setFormData({...formData, footbed: e.target.value})}>
                <option value="soft footbed">Soft Footbed</option>
                <option value="basic footbed">Basic Footbed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Buckle Size</label>
              <select className="w-full border-slate-200 rounded-lg text-sm" value={formData.buckle_size} onChange={e => setFormData({...formData, buckle_size: e.target.value})}>
                <option value="">None</option>
                <option value="big">Big</option>
                <option value="medium">Medium</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Price ($)</label>
              <input required type="number" step="0.01" className="w-full border-slate-200 rounded-lg text-sm" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Stock Quantity</label>
              <input required type="number" className="w-full border-slate-200 rounded-lg text-sm" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} />
            </div>
            <div className="col-span-full pt-2">
              <button type="submit" className="bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-indigo-700 w-full sm:w-auto">Save Variant</button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Color</th>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Footbed</th>
                <th className="px-4 py-3">Buckle</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {variants.map((v) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={v.id} 
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-500 uppercase">{v.sku || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{v.size}</td>
                  <td className="px-4 py-3 text-slate-500">{v.color}</td>
                  <td className="px-4 py-3"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">{v.material}</span></td>
                  <td className="px-4 py-3 text-slate-500">{v.footbed}</td>
                  <td className="px-4 py-3 text-slate-500">{v.buckle_size || '-'}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">${v.price}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={v.stock_quantity < 10 ? "text-rose-600 font-bold" : "text-emerald-600"}>
                      {v.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-400">
                    <button onClick={() => deleteVariant(v.id)} className="p-1.5 hover:text-rose-600 hover:bg-slate-100 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {variants.length === 0 && !showForm && (
            <div className="p-8 text-center text-slate-500 text-sm">
              No variants defined for this product.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
