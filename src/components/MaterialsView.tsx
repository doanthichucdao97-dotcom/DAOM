import React, { useState, useMemo } from 'react';
import { Material, Supplier, Language, MaterialGroup } from '../types';
import { masterConstructionMaterials } from '../data/constructionMaterialsLibrary';
import { getTranslation } from '../i18n/translations';
import { formatVND, formatDate } from '../utils/formatters';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  X, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Boxes,
  Sparkles,
  FileSpreadsheet,
  Percent,
  Check,
  RotateCcw
} from 'lucide-react';

interface MaterialsViewProps {
  materials: Material[];
  suppliers: Supplier[];
  language: Language;
  onAddMaterial: (material: Material) => void;
  onUpdateMaterial: (material: Material) => void;
  onDeleteMaterial: (id: string) => void;
  onBulkAddMaterials?: (materials: Material[]) => void;
}

const MATERIAL_GROUPS: MaterialGroup[] = [
  'Sắt thép & Kim khí',
  'Xi măng & Vữa',
  'Cát xây dựng',
  'Đá xây dựng',
  'Gạch xây & ốp lát',
  'Bê tông tươi & Cọc móng',
  'Sơn, Bột bả & Chống thấm',
  'Thiết bị Điện & Chiếu sáng',
  'Cấp thoát nước & Phụ kiện',
  'Gỗ, Cửa & Thạch cao',
  'Thiết bị vệ sinh & Nhà bếp',
  'Vật tư phụ & Bảo hộ',
  'Khác'
];

const STANDARD_UNITS = ['kg', 'tấn', 'm', 'm2', 'm3', 'bộ', 'cái', 'bao', 'cuộn', 'cây', 'lít', 'thùng', 'tấm', 'viên', 'can'];

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  suppliers,
  language,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
  onBulkAddMaterials
}) => {
  const t = getTranslation(language);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<'all' | 'tho' | 'hoanthien' | 'me' | 'thietbi'>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [sortField, setSortField] = useState<'code' | 'name' | 'costPrice' | 'sellingPrice' | 'updatedAt'>('updatedAt');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Add/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  // Bulk Price Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkAdjustmentPercent, setBulkAdjustmentPercent] = useState<number>(5);
  const [bulkTargetField, setBulkTargetField] = useState<'sellingPrice' | 'costPrice'>('sellingPrice');
  const [bulkTargetGroup, setBulkTargetGroup] = useState<string>('all');

  // Form State
  const [formData, setFormData] = useState<Partial<Material>>({
    code: '',
    name: '',
    group: 'Sắt thép & Kim khí',
    spec: '',
    unit: 'cây',
    supplierId: suppliers[0]?.id || '',
    supplierName: suppliers[0]?.name || '',
    costPrice: 0,
    sellingPrice: 0,
    vatRate: 10,
    notes: ''
  });

  const [formError, setFormError] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Filtering & Sorting
  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchSearch = 
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.code.toLowerCase().includes(search.toLowerCase()) ||
        (m.spec && m.spec.toLowerCase().includes(search.toLowerCase())) ||
        (m.notes && m.notes.toLowerCase().includes(search.toLowerCase()));

      let matchPhase = true;
      if (selectedPhase === 'tho') {
        matchPhase = ['Sắt thép & Kim khí', 'Xi măng & Vữa', 'Cát xây dựng', 'Đá xây dựng', 'Bê tông tươi & Cọc móng'].some(g => m.group.includes(g) || g.includes(m.group));
      } else if (selectedPhase === 'hoanthien') {
        matchPhase = ['Gạch xây & ốp lát', 'Sơn, Bột bả & Chống thấm', 'Gỗ, Cửa & Thạch cao'].some(g => m.group.includes(g) || g.includes(m.group));
      } else if (selectedPhase === 'me') {
        matchPhase = ['Thiết bị Điện & Chiếu sáng', 'Cấp thoát nước & Phụ kiện', 'Điện & Nước'].some(g => m.group.includes(g) || g.includes(m.group));
      } else if (selectedPhase === 'thietbi') {
        matchPhase = ['Thiết bị vệ sinh & Nhà bếp', 'Vật tư phụ & Bảo hộ'].some(g => m.group.includes(g) || g.includes(m.group));
      }

      const matchGroup = selectedGroup === 'all' || m.group === selectedGroup;
      const matchSupplier = selectedSupplier === 'all' || m.supplierId === selectedSupplier;

      return matchSearch && matchPhase && matchGroup && matchSupplier;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        const comp = valA.localeCompare(valB as string);
        return sortAsc ? comp : -comp;
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }, [materials, search, selectedPhase, selectedGroup, selectedSupplier, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage) || 1;
  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAddModal = () => {
    setEditingMaterial(null);
    const nextCode = `VT-${String(materials.length + 1).padStart(3, '0')}`;
    setFormData({
      code: nextCode,
      name: '',
      group: 'Sắt thép & Kim khí',
      spec: '',
      unit: 'cây',
      supplierId: suppliers[0]?.id || '',
      supplierName: suppliers[0]?.name || '',
      costPrice: 0,
      sellingPrice: 0,
      vatRate: 10,
      notes: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (material: Material) => {
    setEditingMaterial(material);
    setFormData({ ...material });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setFormError('Vui lòng nhập tên vật tư');
      return;
    }
    if (!formData.code?.trim()) {
      setFormError('Vui lòng nhập mã vật tư');
      return;
    }

    const supplierObj = suppliers.find(s => s.id === formData.supplierId);
    const supplierName = supplierObj ? supplierObj.name : (formData.supplierName || '');
    const todayStr = new Date().toISOString().split('T')[0];

    if (editingMaterial) {
      onUpdateMaterial({
        ...editingMaterial,
        ...formData,
        code: formData.code!.trim(),
        name: formData.name!.trim(),
        supplierName,
        costPrice: Number(formData.costPrice) || 0,
        sellingPrice: Number(formData.sellingPrice) || 0,
        vatRate: Number(formData.vatRate) || 0,
        updatedAt: todayStr
      } as Material);
    } else {
      const newMaterial: Material = {
        id: `mat-${Date.now()}`,
        code: formData.code!.trim(),
        name: formData.name!.trim(),
        group: formData.group || 'Khác',
        spec: formData.spec || '',
        unit: formData.unit || 'cái',
        supplierId: formData.supplierId || '',
        supplierName,
        costPrice: Number(formData.costPrice) || 0,
        sellingPrice: Number(formData.sellingPrice) || 0,
        vatRate: Number(formData.vatRate) || 0,
        updatedAt: todayStr,
        notes: formData.notes || ''
      };
      onAddMaterial(newMaterial);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa vật tư "${name}"?`)) {
      onDeleteMaterial(id);
    }
  };

  // Nạp toàn bộ thư viện 100+ vật tư chuẩn
  const handleLoadFullMasterLibrary = () => {
    if (window.confirm(`Hệ thống sẽ đồng bộ và bổ sung toàn bộ 100+ vật tư tiêu chuẩn (Phần thô, hoàn thiện, cơ điện M&E, thiết bị vệ sinh, cọc bê tông, đá granite...) vào danh mục của bạn. Tiếp tục?`)) {
      if (onBulkAddMaterials) {
        onBulkAddMaterials(masterConstructionMaterials);
      } else {
        masterConstructionMaterials.forEach(m => {
          if (!materials.some(existing => existing.code === m.code)) {
            onAddMaterial(m);
          }
        });
      }
      setFeedbackMessage('Đã đồng bộ đầy đủ 100+ vật tư xây dựng chuẩn vào danh mục!');
      setTimeout(() => setFeedbackMessage(''), 4000);
    }
  };

  // Bulk Price Update Handler
  const handleApplyBulkPriceAdjustment = () => {
    const factor = 1 + (bulkAdjustmentPercent / 100);
    let count = 0;

    materials.forEach(m => {
      if (bulkTargetGroup === 'all' || m.group === bulkTargetGroup) {
        const updated = { ...m };
        if (bulkTargetField === 'sellingPrice') {
          updated.sellingPrice = Math.round(m.sellingPrice * factor);
        } else {
          updated.costPrice = Math.round(m.costPrice * factor);
        }
        updated.updatedAt = new Date().toISOString().split('T')[0];
        onUpdateMaterial(updated);
        count++;
      }
    });

    setIsBulkModalOpen(false);
    setFeedbackMessage(`Đã điều chỉnh ${bulkTargetField === 'sellingPrice' ? 'giá bán' : 'giá nhập'} (${bulkAdjustmentPercent > 0 ? '+' : ''}${bulkAdjustmentPercent}%) cho ${count} vật tư!`);
    setTimeout(() => setFeedbackMessage(''), 4000);
  };

  // Export Material Catalog to Excel/CSV
  const handleExportCatalogExcel = () => {
    const header = ['STT', 'Mã VT', 'Tên vật tư', 'Nhóm', 'Quy cách kỹ thuật', 'ĐVT', 'Giá nhập (VND)', 'Đơn giá bán (VND)', 'Biên lãi (VND)', 'Thuế VAT (%)', 'Nhà cung cấp', 'Ngày cập nhật', 'Ghi chú'];
    const rows = filteredMaterials.map((m, idx) => [
      idx + 1,
      m.code,
      m.name,
      m.group,
      m.spec || '-',
      m.unit,
      m.costPrice,
      m.sellingPrice,
      m.sellingPrice - m.costPrice,
      m.vatRate,
      m.supplierName || '-',
      m.updatedAt || '-',
      m.notes || ''
    ]);

    const csvContent = '\uFEFF' + [
      header.join('\t'),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join('\t'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bang_Gia_Vat_Tu_DAOM_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleSort = (field: 'code' | 'name' | 'costPrice' | 'sellingPrice' | 'updatedAt') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert Feedback */}
      {feedbackMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs md:text-sm font-semibold flex items-center justify-between shadow-xs transition-all">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage('')} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Title & Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-600" />
            <span>{t.navMaterials} ({materials.length} mặt hàng)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý bảng giá nhập, đơn giá bán và danh mục vật liệu xây dựng toàn công ty
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Load Full Library CTA */}
          <button
            onClick={handleLoadFullMasterLibrary}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
            title="Đồng bộ 100+ vật tư xây dựng tiêu chuẩn (thô, hoàn thiện, M&E, thiết bị, cọc móng, đá hoa cương)"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Nạp 100+ vật tư chuẩn</span>
          </button>

          {/* Bulk Price Adjust */}
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Tăng/giảm giá bán hoặc giá nhập theo %"
          >
            <Percent className="w-4 h-4 text-slate-600" />
            <span>Sửa giá hàng loạt</span>
          </button>

          {/* Export Excel */}
          <button
            onClick={handleExportCatalogExcel}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Xuất danh mục vật tư ra file Excel (.xls)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          {/* Add New Material */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addMaterial}</span>
          </button>
        </div>
      </div>

      {/* Construction Phase Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-medium">
        <button
          onClick={() => { setSelectedPhase('all'); setCurrentPage(1); }}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            selectedPhase === 'all'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Tất cả vật tư ({materials.length})
        </button>
        <button
          onClick={() => { setSelectedPhase('tho'); setCurrentPage(1); }}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            selectedPhase === 'tho'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🧱 Phần Thô (Sắt, Xi măng, Cát, Đá, Bê tông)
        </button>
        <button
          onClick={() => { setSelectedPhase('hoanthien'); setCurrentPage(1); }}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            selectedPhase === 'hoanthien'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🎨 Hoàn Thiện (Gạch ốp lát, Sơn bả, Chống thấm, Cửa)
        </button>
        <button
          onClick={() => { setSelectedPhase('me'); setCurrentPage(1); }}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            selectedPhase === 'me'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          ⚡ Cơ Điện M&E (Dây điện, Ống luồn, Cấp thoát nước)
        </button>
        <button
          onClick={() => { setSelectedPhase('thietbi'); setCurrentPage(1); }}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            selectedPhase === 'thietbi'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🚿 Thiết Bị Vệ Sinh & Bảo Hộ
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 border border-slate-200 rounded-xl shadow-2xs">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên (VD: D10, Hà Tiên, Inax, ống D90, Dulux)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedGroup}
            onChange={(e) => {
              setSelectedGroup(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2 px-3 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="all">Tất cả nhóm ({materials.length})</option>
            {MATERIAL_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Supplier Filter */}
        <div>
          <select
            value={selectedSupplier}
            onChange={(e) => {
              setSelectedSupplier(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2 px-3 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="all">Tất cả nhà cung cấp</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th 
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100"
                  onClick={() => toggleSort('code')}
                >
                  <div className="flex items-center gap-1">
                    <span>{t.materialCode}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    <span>{t.materialName}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">{t.materialGroup}</th>
                <th className="py-3 px-4">{t.specifications}</th>
                <th className="py-3 px-4 text-center">{t.unit}</th>
                <th 
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100"
                  onClick={() => toggleSort('costPrice')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{t.costPrice}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100"
                  onClick={() => toggleSort('sellingPrice')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{t.sellingPrice}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Lãi gộp / ĐVT</th>
                <th className="py-3 px-4 text-center">{t.vatRate}</th>
                <th className="py-3 px-4">{t.supplier}</th>
                <th className="py-3 px-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedMaterials.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <p className="mb-2 font-medium">{t.noData}</p>
                    <button
                      onClick={handleLoadFullMasterLibrary}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Nạp ngay 55+ vật tư xây dựng tiêu chuẩn</span>
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedMaterials.map((m) => {
                  const unitProfit = m.sellingPrice - m.costPrice;
                  const marginPct = m.sellingPrice > 0 ? ((unitProfit / m.sellingPrice) * 100).toFixed(0) : '0';

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-xs text-blue-600">
                        {m.code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {m.name}
                        {m.notes && (
                          <div className="text-[11px] font-normal text-slate-400 mt-0.5 truncate max-w-xs">
                            {m.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        {m.group}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 max-w-xs truncate" title={m.spec}>
                        {m.spec || '-'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-xs font-semibold text-slate-700">
                        {m.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs tabular-nums text-slate-600">
                        {formatVND(m.costPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                        {formatVND(m.sellingPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs tabular-nums">
                        <span className={`font-semibold ${unitProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          +{formatVND(unitProfit)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          ({marginPct}%)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-xs">
                        {m.vatRate}%
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 max-w-xs truncate" title={m.supplierName}>
                        {m.supplierName || '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(m)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title={t.edit}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(m.id, m.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title={t.delete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-600">
          <div>
            Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> đến <strong>{Math.min(currentPage * itemsPerPage, filteredMaterials.length)}</strong> trên <strong>{filteredMaterials.length}</strong> vật tư
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono tabular-nums">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Material Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                {editingMaterial ? t.editMaterial : t.addMaterial}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto">
              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.materialCode} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="VD: THEP-HP-D10"
                  />
                </div>

                {/* Group */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.materialGroup} *
                  </label>
                  <select
                    value={formData.group || 'Sắt thép & Kim khí'}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {MATERIAL_GROUPS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.materialName} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Thép thanh vằn Hòa Phát D10"
                />
              </div>

              {/* Spec & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.specifications}
                  </label>
                  <input
                    type="text"
                    value={formData.spec || ''}
                    onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                    className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: CB300-V phi 10mm L=11.7m"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.unit} *
                  </label>
                  <select
                    value={formData.unit || 'cây'}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    {STANDARD_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Supplier */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.supplier}
                </label>
                <select
                  value={formData.supplierId || ''}
                  onChange={(e) => {
                    const sup = suppliers.find(s => s.id === e.target.value);
                    setFormData({
                      ...formData,
                      supplierId: e.target.value,
                      supplierName: sup?.name || ''
                    });
                  }}
                  className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn nhà cung cấp --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              {/* Price Calculations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.costPrice} (VNĐ) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={formData.costPrice || 0}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 text-xs md:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.sellingPrice} (VNĐ) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={formData.sellingPrice || 0}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 text-xs md:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.vatRate} (%)
                  </label>
                  <select
                    value={formData.vatRate || 10}
                    onChange={(e) => setFormData({ ...formData, vatRate: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 text-xs md:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono font-semibold"
                  >
                    <option value={0}>0%</option>
                    <option value={8}>8%</option>
                    <option value={10}>10%</option>
                  </select>
                </div>

                <div className="sm:col-span-3 text-xs text-slate-600 flex justify-between items-center border-t border-slate-200 pt-2">
                  <span>Lợi nhuận gộp dự kiến:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    +{formatVND((formData.sellingPrice || 0) - (formData.costPrice || 0))} / {formData.unit}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.notes}
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú kỹ thuật, tiêu chuẩn áp dụng, thời gian bảo hành..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
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

      {/* Bulk Price Adjustment Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                <Percent className="w-4 h-4 text-blue-600" />
                <span>Điều chỉnh đơn giá hàng loạt</span>
              </h3>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs md:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Áp dụng cho nhóm vật tư:
                </label>
                <select
                  value={bulkTargetGroup}
                  onChange={(e) => setBulkTargetGroup(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                >
                  <option value="all">Tất cả các nhóm ({materials.length} vật tư)</option>
                  {MATERIAL_GROUPS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đơn giá muốn điều chỉnh:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBulkTargetField('sellingPrice')}
                    className={`p-2 rounded-lg border text-xs font-semibold cursor-pointer ${
                      bulkTargetField === 'sellingPrice'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Đơn giá bán
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkTargetField('costPrice')}
                    className={`p-2 rounded-lg border text-xs font-semibold cursor-pointer ${
                      bulkTargetField === 'costPrice'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Giá nhập
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tỷ lệ điều chỉnh (%):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={bulkAdjustmentPercent}
                    onChange={(e) => setBulkAdjustmentPercent(parseFloat(e.target.value) || 0)}
                    className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-blue-700 text-center text-base"
                  />
                  <span className="font-bold text-slate-600">%</span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[-5, -2, 2, 5, 8, 10].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setBulkAdjustmentPercent(pct)}
                      className="flex-1 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded font-mono font-medium text-slate-700 cursor-pointer"
                    >
                      {pct > 0 ? `+${pct}%` : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleApplyBulkPriceAdjustment}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer shadow-xs"
              >
                Xác nhận điều chỉnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
