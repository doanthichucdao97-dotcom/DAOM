import React, { useState } from 'react';
import { Supplier, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { 
  Building2, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Edit3, 
  Trash2, 
  X,
  PackageCheck
} from 'lucide-react';

interface SuppliersViewProps {
  suppliers: Supplier[];
  language: Language;
  onAddSupplier: (supplier: Supplier) => void;
  onUpdateSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: string) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  language,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier
}) => {
  const t = getTranslation(language);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [formData, setFormData] = useState<Partial<Supplier>>({
    code: '',
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    suppliedCategories: ['Sắt thép xây dựng'],
    lastPurchasePriceInfo: '',
    rating: 5,
    notes: ''
  });

  const [categoryInput, setCategoryInput] = useState('');

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.includes(search) ||
    s.suppliedCategories.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenAddModal = () => {
    setEditingSupplier(null);
    const nextCode = `NCC-${String(suppliers.length + 1).padStart(2, '0')}`;
    setFormData({
      code: nextCode,
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      suppliedCategories: ['Sắt thép xây dựng'],
      lastPurchasePriceInfo: '',
      rating: 5,
      notes: ''
    });
    setCategoryInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({ ...supplier });
    setCategoryInput('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (editingSupplier) {
      onUpdateSupplier({
        ...editingSupplier,
        ...formData,
        code: formData.code?.trim() || editingSupplier.code,
        name: formData.name.trim(),
        contactPerson: formData.contactPerson || '',
        phone: formData.phone || '',
        email: formData.email || '',
        address: formData.address || '',
        suppliedCategories: formData.suppliedCategories || [],
        notes: formData.notes || '',
        rating: formData.rating || 5
      } as Supplier);
    } else {
      const newSup: Supplier = {
        id: `sup-${Date.now()}`,
        code: formData.code?.trim() || `NCC-${suppliers.length + 1}`,
        name: formData.name.trim(),
        contactPerson: formData.contactPerson || '',
        phone: formData.phone || '',
        email: formData.email || '',
        address: formData.address || '',
        suppliedCategories: formData.suppliedCategories || ['Vật liệu xây dựng'],
        lastPurchasePriceInfo: formData.lastPurchasePriceInfo || 'Mới khởi tạo',
        rating: formData.rating || 5,
        notes: formData.notes || ''
      };
      onAddSupplier(newSup);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp "${name}"?`)) {
      onDeleteSupplier(id);
    }
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() && !formData.suppliedCategories?.includes(categoryInput.trim())) {
      setFormData({
        ...formData,
        suppliedCategories: [...(formData.suppliedCategories || []), categoryInput.trim()]
      });
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setFormData({
      ...formData,
      suppliedCategories: formData.suppliedCategories?.filter(c => c !== cat) || []
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>{t.navSuppliers}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý danh sách các đại lý, mỏ khai thác và nhà máy cung ứng vật tư xây dựng
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addSupplier}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-2xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên nhà cung cấp, người liên hệ, số điện thoại, mặt hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Suppliers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier) => (
          <div 
            key={supplier.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-mono text-xs font-semibold text-blue-600">
                    {supplier.code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base leading-tight mt-0.5">
                    {supplier.name}
                  </h3>
                </div>

                <div className="flex items-center text-amber-500 shrink-0">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold ml-1 text-slate-700 font-mono">
                    {supplier.rating}.0
                  </span>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-1.5 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-4 font-semibold text-center">👤</span>
                  <span className="font-medium text-slate-800">{supplier.contactPerson || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{supplier.phone || '-'}</span>
                </div>
                {supplier.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-500 leading-snug line-clamp-2">{supplier.address || '-'}</span>
                </div>
              </div>

              {/* Supplied categories */}
              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Mặt hàng cung cấp:
                </div>
                <div className="flex flex-wrap gap-1">
                  {supplier.suppliedCategories.map((c) => (
                    <span key={c} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Last purchase info */}
              {supplier.lastPurchasePriceInfo && (
                <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                  <div className="flex items-center gap-1 font-medium text-slate-700 mb-0.5">
                    <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Giá nhập gần nhất:</span>
                  </div>
                  <div className="text-slate-600 italic">
                    {supplier.lastPurchasePriceInfo}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => handleOpenEditModal(supplier)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t.edit}</span>
              </button>
              <button
                onClick={() => handleDelete(supplier.id, supplier.name)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.delete}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                {editingSupplier ? t.editSupplier : t.addSupplier}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.supplierCode} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.supplierName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg"
                    placeholder="Công ty CP / Doanh nghiệp..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.contactPerson}
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson || ''}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.phone}
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.rating} (1 - 5 sao)
                  </label>
                  <select
                    value={formData.rating || 5}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                    className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-semibold text-amber-600"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 sao - Xuất sắc)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 sao - Rất tốt)</option>
                    <option value={3}>⭐⭐⭐ (3 sao - Khá)</option>
                    <option value={2}>⭐⭐ (2 sao - Trung bình)</option>
                    <option value={1}>⭐ (1 sao - Kém)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.address}
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg"
                  placeholder="Địa chỉ văn phòng / kho bãi..."
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.suppliedCategories}
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    placeholder="VD: Cát xây dựng, Thép cây..."
                    className="flex-1 p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3 py-1.5 text-xs bg-slate-800 text-white rounded-lg hover:bg-slate-700 cursor-pointer"
                  >
                    Thêm
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.suppliedCategories?.map((c) => (
                    <span key={c} className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded flex items-center gap-1 border border-blue-200">
                      {c}
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(c)}
                        className="hover:text-red-600 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.lastPurchasePrice}
                </label>
                <input
                  type="text"
                  value={formData.lastPurchasePriceInfo || ''}
                  onChange={(e) => setFormData({ ...formData, lastPurchasePriceInfo: e.target.value })}
                  className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg"
                  placeholder="VD: Thép D10: 14.800 đ/kg (28/09/2026)"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs md:text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
