import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FolderTree, Plus, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';

export function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: '', title: '', description: '', parent_id: '' });

  const fetchCategories = async () => {
    setLoading(true);
    if (!supabase) return;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('title');

    if (error) {
      console.error(error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    const { error } = await supabase.from('categories').insert([{
      id: formData.id.toLowerCase().replace(/\s+/g, '-'),
      title: formData.title,
      description: formData.description,
      parent_id: formData.parent_id || null
    }]);

    if (error) {
      alert(error.message);
      return;
    }

    setShowForm(false);
    setFormData({ id: '', title: '', description: '', parent_id: '' });
    fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    if (!supabase || !confirm('Are you sure? This may affect products in this category.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) alert(error.message);
    fetchCategories();
  };

  // Helper to build tree structure
  const buildTree = (cats: any[], parentId: string | null = null) => {
    return cats.filter(c => c.parent_id === parentId).map(c => ({
      ...c,
      children: buildTree(cats, c.id)
    }));
  };

  const categoryTree = buildTree(categories);

  const renderTree = (nodes: any[], depth = 0) => {
    return nodes.map(node => (
      <React.Fragment key={node.id}>
        <motion.tr 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hover:bg-slate-50/50 transition-colors"
        >
          <td className="px-6 py-4 font-medium text-slate-900" style={{ paddingLeft: `${(depth * 32) + 24}px` }}>
            <div className="flex items-center gap-2">
              {depth > 0 && <span className="text-slate-300">↳</span>}
              {node.title}
            </div>
          </td>
          <td className="px-6 py-4 text-slate-500 font-mono text-xs">{node.id}</td>
          <td className="px-6 py-4 text-slate-500">{node.description || '-'}</td>
          <td className="px-6 py-4 text-right">
            <button onClick={() => deleteCategory(node.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded">
              <Trash2 className="w-4 h-4" />
            </button>
          </td>
        </motion.tr>
        {node.children && renderTree(node.children, depth + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Categories</h1>
          <p className="text-sm text-slate-500">Manage product categories and structure</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'New Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addCategory} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Category Details</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Title</label>
              <input required type="text" className="w-full border-slate-200 rounded-lg text-sm" value={formData.title} onChange={e => {
                const title = e.target.value;
                setFormData({
                  ...formData, 
                  title, 
                  id: title.toLowerCase().replace(/\s+/g, '-')
                });
              }} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">ID (Slug)</label>
              <input required type="text" className="w-full border-slate-200 rounded-lg text-sm bg-slate-50" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Parent Category</label>
              <select className="w-full border-slate-200 rounded-lg text-sm" value={formData.parent_id || ''} onChange={e => setFormData({...formData, parent_id: e.target.value})}>
                <option value="">None (Top Level)</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="col-span-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
              <textarea rows={2} className="w-full border-slate-200 rounded-lg text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-indigo-700">Save</button>
          </div>
        </form>
      )}

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">ID / Slug</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {renderTree(categoryTree)}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <FolderTree className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">No categories yet</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">Create categories to organize your products.</p>
          </div>
        )}
      </div>
    </div>
  );
}
