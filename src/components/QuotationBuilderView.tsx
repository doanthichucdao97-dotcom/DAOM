import React, { useState, useEffect } from 'react';
import { 
  Quotation, 
  QuotationItem, 
  Material, 
  Language, 
  ProvincialBenchmark, 
  CompanyProfile 
} from '../types';
import { getTranslation } from '../i18n/translations';
import { formatVND, formatDate, numberToVietnameseWords } from '../utils/formatters';
import { exportQuotationToExcel } from '../utils/storage';
import { 
  Plus, 
  Trash2, 
  Save, 
  Printer, 
  FileSpreadsheet, 
  Boxes, 
  ArrowLeft, 
  Copy, 
  Calculator, 
  Check, 
  Search, 
  X,
  Sparkles,
  Percent,
  HelpCircle
} from 'lucide-react';

interface QuotationBuilderViewProps {
  initialQuotation?: Quotation | null;
  materials: Material[];
  benchmarks: ProvincialBenchmark[];
  company: CompanyProfile;
  language: Language;
  onSave: (quotation: Quotation) => void;
  onBack: () => void;
  onPrint: (quotation: Quotation) => void;
}

export const QuotationBuilderView: React.FC<QuotationBuilderViewProps> = ({
  initialQuotation,
  materials,
  benchmarks,
  company,
  language,
  onSave,
  onBack,
  onPrint
}) => {
  const t = getTranslation(language);

  // General quotation information state
  const [code, setCode] = useState(
    initialQuotation?.code || `BG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`
  );
  const [customerName, setCustomerName] = useState(initialQuotation?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(initialQuotation?.customerPhone || '');
  const [customerEmail, setCustomerEmail] = useState(initialQuotation?.customerEmail || '');
  const [customerAddress, setCustomerAddress] = useState(initialQuotation?.customerAddress || '');
  const [projectName, setProjectName] = useState(initialQuotation?.projectName || '');
  const [projectLocation, setProjectLocation] = useState(initialQuotation?.projectLocation || '');
  const [province, setProvince] = useState(initialQuotation?.province || benchmarks[0]?.province || 'TP. Hồ Chí Minh');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [quoteDate, setQuoteDate] = useState(initialQuotation?.quoteDate || todayStr);
  
  const defaultValidDate = new Date();
  defaultValidDate.setDate(defaultValidDate.getDate() + (company.defaultValidityDays || 20));
  const [validUntil, setValidUntil] = useState(
    initialQuotation?.validUntil || defaultValidDate.toISOString().split('T')[0]
  );
  
  const [preparedBy, setPreparedBy] = useState(initialQuotation?.preparedBy || 'Kỹ sư dự toán DAOM');
  const [status, setStatus] = useState(initialQuotation?.status || 'draft');
  const [notesAndTerms, setNotesAndTerms] = useState(initialQuotation?.notesAndTerms || company.defaultTerms);

  // Line items state
  const [items, setItems] = useState<QuotationItem[]>(initialQuotation?.items || [
    {
      id: `qi-init-1`,
      stt: 1,
      materialId: materials[0]?.id || '',
      code: materials[0]?.code || 'THEP-HP-D10',
      name: materials[0]?.name || 'Thép thanh vằn Hòa Phát D10',
      spec: materials[0]?.spec || 'CB300-V phi 10mm L=11.7m',
      unit: materials[0]?.unit || 'cây',
      quantity: 100,
      costPrice: materials[0]?.costPrice || 106000,
      sellingPrice: materials[0]?.sellingPrice || 122000,
      amount: 100 * (materials[0]?.sellingPrice || 122000),
      profit: 100 * ((materials[0]?.sellingPrice || 122000) - (materials[0]?.costPrice || 106000)),
      notes: 'Thép sàn và cốt đai'
    }
  ]);

  // Cost and adjustment state
  const [laborCost, setLaborCost] = useState<number>(initialQuotation?.laborCost || 85000000);
  const [transportCost, setTransportCost] = useState<number>(initialQuotation?.transportCost || 8000000);
  const [machineryCost, setMachineryCost] = useState<number>(initialQuotation?.machineryCost || 12000000);
  const [contingencyPercent, setContingencyPercent] = useState<number>(initialQuotation?.contingencyPercent || 3);
  const [discountPercent, setDiscountPercent] = useState<number>(initialQuotation?.discountPercent || 0);
  const [markupPercent, setMarkupPercent] = useState<number>(initialQuotation?.markupPercent || 10);
  const [vatPercent, setVatPercent] = useState<number>(initialQuotation?.vatPercent ?? company.defaultVatRate);

  // Modal for selecting from catalog
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogGroup, setCatalogGroup] = useState('all');

  // Quick Labor Calculator Modal
  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
  const [floorArea, setFloorArea] = useState<number>(200); // m2
  const [floorsCount, setFloorsCount] = useState<number>(3);

  // Toast / feedback message
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active benchmark data for current province
  const currentBenchmark = benchmarks.find(b => b.province === province) || benchmarks[0];

  // Recalculate line item amounts whenever quantity, costPrice or sellingPrice change
  const handleItemChange = (id: string, field: keyof QuotationItem, value: any) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };
        const q = Number(updated.quantity) || 0;
        const cp = Number(updated.costPrice) || 0;
        const sp = Number(updated.sellingPrice) || 0;

        updated.amount = q * sp;
        updated.profit = updated.amount - (q * cp);
        return updated;
      })
    );
  };

  // Add a blank custom row
  const handleAddBlankRow = () => {
    const newItem: QuotationItem = {
      id: `qi-${Date.now()}`,
      stt: items.length + 1,
      code: `VT-TUY-CHON`,
      name: '',
      spec: '',
      unit: 'cái',
      quantity: 1,
      costPrice: 0,
      sellingPrice: 0,
      amount: 0,
      profit: 0,
      notes: ''
    };
    setItems(prev => [...prev, newItem]);
  };

  // Delete row
  const handleDeleteRow = (id: string) => {
    if (items.length <= 1) {
      alert('Báo giá cần có ít nhất 1 dòng vật tư.');
      return;
    }
    setItems(prev => prev.filter(i => i.id !== id).map((item, idx) => ({ ...item, stt: idx + 1 })));
  };

  // Add items from catalog modal
  const handleSelectFromCatalog = (mat: Material) => {
    const existing = items.find(i => i.materialId === mat.id);
    if (existing) {
      handleItemChange(existing.id, 'quantity', Number(existing.quantity) + 1);
    } else {
      const newItem: QuotationItem = {
        id: `qi-${Date.now()}-${mat.id}`,
        stt: items.length + 1,
        materialId: mat.id,
        code: mat.code,
        name: mat.name,
        spec: mat.spec,
        unit: mat.unit,
        quantity: 1,
        costPrice: mat.costPrice,
        sellingPrice: mat.sellingPrice,
        amount: mat.sellingPrice,
        profit: mat.sellingPrice - mat.costPrice,
        notes: mat.notes || ''
      };
      setItems(prev => [...prev, newItem]);
    }
    setIsCatalogModalOpen(false);
  };

  // Load benchmark package (quick foundation & frame materials from current province)
  const handleLoadProvincePackage = () => {
    if (!currentBenchmark) return;
    if (window.confirm(`Bạn có muốn nạp gói vật tư mác chuẩn theo giá thị trường tại ${province}? Các dòng hiện tại sẽ được bổ sung.`)) {
      const benchmarkItems: QuotationItem[] = currentBenchmark.materials.slice(0, 6).map((bm, index) => {
        const costEstimate = Math.round(bm.marketPrice * 0.9);
        return {
          id: `qi-bm-${Date.now()}-${index}`,
          stt: items.length + index + 1,
          code: `VT-${bm.group.toUpperCase()}-${index + 1}`,
          name: bm.name,
          spec: bm.spec,
          unit: bm.unit,
          quantity: bm.unit === 'viên' ? 10000 : bm.unit === 'cây' ? 150 : bm.unit === 'm3' ? 40 : 100,
          costPrice: costEstimate,
          sellingPrice: bm.marketPrice,
          amount: (bm.unit === 'viên' ? 10000 : bm.unit === 'cây' ? 150 : bm.unit === 'm3' ? 40 : 100) * bm.marketPrice,
          profit: (bm.unit === 'viên' ? 10000 : bm.unit === 'cây' ? 150 : bm.unit === 'm3' ? 40 : 100) * (bm.marketPrice - costEstimate),
          notes: `Đơn giá khảo sát tại ${province}`
        };
      });
      setItems(prev => [...prev, ...benchmarkItems].map((item, idx) => ({ ...item, stt: idx + 1 })));
    }
  };

  // Summary Calculations
  const totalMaterialAmount = items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const totalMaterialCost = items.reduce((acc, item) => acc + ((Number(item.quantity) || 0) * (Number(item.costPrice) || 0)), 0);
  const baseSubtotal = totalMaterialAmount + Number(laborCost) + Number(transportCost) + Number(machineryCost);

  // Contingency calculation
  const contingencyCost = Math.round((baseSubtotal * (Number(contingencyPercent) || 0)) / 100);

  // Discount calculation
  const subtotalWithContingency = baseSubtotal + contingencyCost;
  const discountAmount = Math.round((subtotalWithContingency * (Number(discountPercent) || 0)) / 100);

  // Subtotal before tax
  const subtotalBeforeVat = Math.max(0, subtotalWithContingency - discountAmount);

  // VAT
  const vatAmount = Math.round((subtotalBeforeVat * (Number(vatPercent) || 0)) / 100);
  const totalAfterVat = subtotalBeforeVat + vatAmount;

  // Real estimated costs & net profit
  const totalEstimatedCost = totalMaterialCost + Number(laborCost) + Number(transportCost) + Number(machineryCost) + contingencyCost;
  const netProfit = subtotalBeforeVat - totalEstimatedCost;
  const profitMarginPercent = totalAfterVat > 0 ? Number(((netProfit / subtotalBeforeVat) * 100).toFixed(2)) : 0;

  // Construct current Quotation object
  const getCurrentQuotation = (): Quotation => {
    return {
      id: initialQuotation?.id || `quote-${Date.now()}`,
      code: code.trim(),
      customerName: customerName.trim() || 'Khách hàng',
      customerPhone,
      customerEmail,
      customerAddress,
      projectName: projectName.trim() || 'Công trình xây dựng',
      projectLocation: projectLocation.trim() || province,
      province,
      quoteDate,
      validUntil,
      preparedBy,
      status: status as any,
      items,
      totalMaterialAmount,
      totalMaterialCost,
      laborCost: Number(laborCost) || 0,
      transportCost: Number(transportCost) || 0,
      machineryCost: Number(machineryCost) || 0,
      contingencyPercent: Number(contingencyPercent) || 0,
      contingencyCost,
      discountPercent: Number(discountPercent) || 0,
      discountAmount,
      markupPercent: Number(markupPercent) || 0,
      subtotalBeforeVat,
      vatPercent: Number(vatPercent) || 0,
      vatAmount,
      totalAfterVat,
      totalEstimatedCost,
      netProfit,
      profitMarginPercent,
      notesAndTerms,
      createdAt: initialQuotation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const handleSaveQuotation = () => {
    if (!customerName.trim()) {
      alert('Vui lòng nhập Tên khách hàng / Chủ đầu tư');
      return;
    }
    if (!projectName.trim()) {
      alert('Vui lòng nhập Tên dự án / Công trình');
      return;
    }

    const q = getCurrentQuotation();
    onSave(q);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExcelExport = () => {
    const q = getCurrentQuotation();
    exportQuotationToExcel(q, company);
  };

  const handleApplyLaborSuggestion = () => {
    const defaultM2Rate = currentBenchmark?.laborWages?.find(w => w.unit.includes('m²'))?.averageWage || 1400000;
    const calculatedLabor = Math.round(floorArea * floorsCount * defaultM2Rate);
    setLaborCost(calculatedLabor);
    setIsLaborModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{initialQuotation ? t.editQuotation : t.newQuotation}</span>
              <span className="font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-200">
                {code}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tự động tính thành tiền, lợi nhuận, chi phí nhân công và xuất bảng báo giá chuyên nghiệp
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleExcelExport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Xuất file Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{t.exportExcel}</span>
          </button>

          <button
            onClick={() => onPrint(getCurrentQuotation())}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="In hoặc xuất PDF"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            <span>{t.exportPdf}</span>
          </button>

          <button
            onClick={handleSaveQuotation}
            className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Đã lưu!' : t.save}</span>
          </button>
        </div>
      </div>

      {/* Part 1: Quotation Information Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
          1. Thông tin chung về công trình & khách hàng
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Quote Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.quoteCode} *
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-blue-700"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.status}
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-medium"
            >
              <option value="draft">{t.statusDraft}</option>
              <option value="sent">{t.statusSent}</option>
              <option value="approved">{t.statusApproved}</option>
              <option value="in_progress">{t.statusInProgress}</option>
              <option value="completed">{t.statusCompleted}</option>
              <option value="rejected">{t.statusRejected}</option>
            </select>
          </div>

          {/* Quote Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.quoteDate}
            </label>
            <input
              type="date"
              value={quoteDate}
              onChange={(e) => setQuoteDate(e.target.value)}
              className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono"
            />
          </div>

          {/* Valid Until */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.validUntil}
            </label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.customerName} *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Nguyễn Văn Nam"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.customerPhone}
            </label>
            <input
              type="text"
              placeholder="VD: 0912 345 678"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono"
            />
          </div>

          {/* Customer Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.customerEmail}
            </label>
            <input
              type="email"
              placeholder="email@khachhang.vn"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Project Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.projectName} *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Xây mới nhà phố 3 tầng hiện đại"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Province */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.province} (Đơn giá địa phương)
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-semibold text-blue-900"
            >
              {benchmarks.map(b => (
                <option key={b.province} value={b.province}>{b.province}</option>
              ))}
            </select>
          </div>

          {/* Prepared By */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.preparedBy}
            </label>
            <input
              type="text"
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
              className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {t.projectLocation}
          </label>
          <input
            type="text"
            placeholder="Số nhà, đường, phường/xã, quận/huyện..."
            value={projectLocation}
            onChange={(e) => setProjectLocation(e.target.value)}
            className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg"
          />
        </div>
      </div>

      {/* Part 2: Line Items Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs space-y-2">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              2. Danh mục khối lượng & đơn giá vật tư thi công
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.formulaNote}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsCatalogModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
            >
              <Boxes className="w-4 h-4" />
              <span>{t.selectFromCatalog}</span>
            </button>

            <button
              onClick={handleLoadProvincePackage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
              title={`Nạp nhanh đơn giá vật tư chuẩn thị trường tại ${province}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.quickLoadBenchmark}</span>
            </button>

            <button
              onClick={handleAddBlankRow}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addNewRow}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">{t.stt}</th>
                <th className="py-2.5 px-3 w-28">{t.materialCode}</th>
                <th className="py-2.5 px-3 min-w-[200px]">{t.materialName}</th>
                <th className="py-2.5 px-3 min-w-[140px]">{t.specifications}</th>
                <th className="py-2.5 px-2 w-16 text-center">{t.unit}</th>
                <th className="py-2.5 px-3 w-24 text-right">{t.quantity}</th>
                <th className="py-2.5 px-3 w-28 text-right">{t.costPrice}</th>
                <th className="py-2.5 px-3 w-32 text-right">{t.sellingPrice}</th>
                <th className="py-2.5 px-3 w-32 text-right">{t.amount}</th>
                <th className="py-2.5 px-3 w-28 text-right">{t.profit}</th>
                <th className="py-2.5 px-3 min-w-[120px]">{t.notes}</th>
                <th className="py-2.5 px-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={item.code}
                      onChange={(e) => handleItemChange(item.id, 'code', e.target.value)}
                      className="w-full p-1 text-xs bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white font-mono"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={item.name}
                      placeholder="Tên công việc / vật tư"
                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white font-medium"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={item.spec}
                      placeholder="Quy cách"
                      onChange={(e) => handleItemChange(item.id, 'spec', e.target.value)}
                      className="w-full p-1 text-xs bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white text-slate-600"
                    />
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                      className="w-full p-1 text-xs text-center bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white font-mono"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full p-1 text-xs md:text-sm text-right bg-slate-50 border border-slate-200 rounded font-mono font-medium focus:bg-white focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={item.costPrice}
                      onChange={(e) => handleItemChange(item.id, 'costPrice', parseFloat(e.target.value) || 0)}
                      className="w-full p-1 text-xs text-right bg-slate-50 border border-slate-200 rounded font-mono text-slate-600 focus:bg-white focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={item.sellingPrice}
                      onChange={(e) => handleItemChange(item.id, 'sellingPrice', parseFloat(e.target.value) || 0)}
                      className="w-full p-1 text-xs md:text-sm text-right bg-white border border-slate-300 rounded font-mono font-bold text-slate-900 focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {formatVND(item.amount)}
                  </td>
                  <td className={`py-2.5 px-3 text-right font-mono font-semibold text-xs tabular-nums ${
                    item.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {formatVND(item.profit)}
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={item.notes || ''}
                      placeholder="Ghi chú kỹ thuật"
                      onChange={(e) => handleItemChange(item.id, 'notes', e.target.value)}
                      className="w-full p-1 text-xs bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white text-slate-500"
                    />
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <button
                      onClick={() => handleDeleteRow(item.id)}
                      className="p-1 text-slate-300 hover:text-red-600 rounded cursor-pointer"
                      title="Xóa dòng"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-semibold text-xs md:text-sm border-t border-slate-200">
              <tr>
                <td colSpan={8} className="py-3 px-4 text-right text-slate-700">
                  {t.totalMaterialAmount}:
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-blue-900 tabular-nums">
                  {formatVND(totalMaterialAmount)}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                  +{formatVND(totalMaterialAmount - totalMaterialCost)}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Part 3: Project Costs & Automated Summary Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Additional Project Costs */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm">
              3. Chi phí nhân công & máy móc thi công
            </h3>
            <button
              onClick={() => setIsLaborModalOpen(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Dự toán nhân công theo m² sàn</span>
            </button>
          </div>

          <div className="space-y-3">
            {/* Labor Cost */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  {t.laborCost} (VNĐ):
                </label>
                <span className="text-[11px] text-slate-500">
                  Gợi ý chuẩn {province}: ~{formatVND(currentBenchmark?.laborWages?.[0]?.averageWage || 480000)}/ngày
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="500000"
                value={laborCost}
                onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono font-semibold"
              />
            </div>

            {/* Machinery Cost */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.machineryCost} (Xe đào, ca bơm, máy đầm) (VNĐ):
              </label>
              <input
                type="number"
                min="0"
                step="500000"
                value={machineryCost}
                onChange={(e) => setMachineryCost(parseFloat(e.target.value) || 0)}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono font-semibold"
              />
            </div>

            {/* Transport Cost */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.transportCost} (Vận chuyển, bốc xếp xà bần) (VNĐ):
              </label>
              <input
                type="number"
                min="0"
                step="200000"
                value={transportCost}
                onChange={(e) => setTransportCost(parseFloat(e.target.value) || 0)}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono font-semibold"
              />
            </div>

            {/* Contingency % and Discount % */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dự phòng phát sinh ({contingencyPercent}%):
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  value={contingencyPercent}
                  onChange={(e) => setContingencyPercent(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chiết khấu khách hàng ({discountPercent}%):
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* VAT Rate */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.vatRate} (%)
              </label>
              <div className="flex gap-2">
                {[0, 8, 10].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVatPercent(v)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      vatPercent === v
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    VAT {v}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary Ledger Card */}
        <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>{t.summaryTitle}</span>
              <span className="text-xs font-normal text-slate-400">
                Hiệu lực {validUntil}
              </span>
            </h3>

            <div className="space-y-2.5 text-xs md:text-sm mt-3">
              <div className="flex justify-between items-center text-slate-300">
                <span>1. Tổng giá trị vật tư bán:</span>
                <span className="font-mono tabular-nums font-semibold text-white">
                  {formatVND(totalMaterialAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>2. Chi phí nhân công:</span>
                <span className="font-mono tabular-nums font-semibold text-white">
                  {formatVND(laborCost)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>3. Chi phí máy móc thiết bị:</span>
                <span className="font-mono tabular-nums font-semibold text-white">
                  {formatVND(machineryCost)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>4. Chi phí vận chuyển:</span>
                <span className="font-mono tabular-nums font-semibold text-white">
                  {formatVND(transportCost)}
                </span>
              </div>

              {contingencyCost > 0 && (
                <div className="flex justify-between items-center text-slate-300">
                  <span>5. Chi phí dự phòng ({contingencyPercent}%):</span>
                  <span className="font-mono tabular-nums text-white">
                    +{formatVND(contingencyCost)}
                  </span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-amber-400">
                  <span>6. Chiết khấu khách ({discountPercent}%):</span>
                  <span className="font-mono tabular-nums font-semibold">
                    -{formatVND(discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-slate-800 font-semibold text-slate-200">
                <span>{t.subtotalBeforeVat}:</span>
                <span className="font-mono tabular-nums text-base">
                  {formatVND(subtotalBeforeVat)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span>Thuế GTGT (VAT {vatPercent}%):</span>
                <span className="font-mono tabular-nums">
                  +{formatVND(vatAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Grand Total & Net Profit Display */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                {t.totalAfterVat}:
              </span>
              <span className="text-xl md:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {formatVND(totalAfterVat)}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 italic">
              Bằng chữ: <strong className="text-slate-200 not-italic">{numberToVietnameseWords(totalAfterVat)}</strong>
            </div>

            {/* Profit margin insight */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Lợi nhuận ròng dự kiến (sau mọi chi phí):
              </span>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-400 tabular-nums">
                  +{formatVND(netProfit)}
                </span>
                <span className="text-[10px] text-emerald-500 block font-semibold">
                  (Biên lãi {profitMarginPercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 4: Contract Terms & Conditions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <h3 className="font-bold text-slate-900 text-sm mb-2">
          4. Điều khoản thanh toán & cam kết thi công
        </h3>
        <textarea
          rows={5}
          value={notesAndTerms}
          onChange={(e) => setNotesAndTerms(e.target.value)}
          className="w-full p-3 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
        />
      </div>

      {/* MODAL 1: Select Material From Catalog */}
      {isCatalogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm md:text-base">
                {t.selectFromCatalog}
              </h3>
              <button
                onClick={() => setIsCatalogModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b border-slate-200 flex gap-2 bg-white">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên vật tư, mã..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {materials
                .filter(m => 
                  m.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                  m.code.toLowerCase().includes(catalogSearch.toLowerCase())
                )
                .map((mat) => (
                  <div
                    key={mat.id}
                    onClick={() => handleSelectFromCatalog(mat)}
                    className="p-3.5 hover:bg-blue-50/70 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-blue-600">{mat.code}</span>
                        <span className="font-bold text-xs md:text-sm text-slate-900">{mat.name}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {mat.spec} · ĐVT: <span className="font-mono font-semibold">{mat.unit}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-xs md:text-sm text-slate-900 tabular-nums">
                        {formatVND(mat.sellingPrice)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Nhập: {formatVND(mat.costPrice)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCatalogModalOpen(false)}
                className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Quick Labor Calculation By Floor Area */}
      {isLaborModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Tính nhanh chi phí nhân công theo diện tích xây dựng
              </h3>
              <button
                onClick={() => setIsLaborModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs md:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Diện tích một mặt sàn (m²):
                </label>
                <input
                  type="number"
                  min="20"
                  value={floorArea}
                  onChange={(e) => setFloorArea(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số tầng xây dựng:
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={floorsCount}
                  onChange={(e) => setFloorsCount(parseInt(e.target.value) || 1)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
                <div>Tổng diện tích sàn: <strong>{floorArea * floorsCount} m²</strong></div>
                <div>Đơn giá nhân công khoán chuẩn tại {province}: <strong>~1.400.000 đ/m²</strong></div>
                <div className="text-sm font-bold text-blue-900 pt-1 border-t border-blue-200">
                  Dự toán nhân công: {formatVND(floorArea * floorsCount * 1400000)}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsLaborModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleApplyLaborSuggestion}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                Áp dụng vào báo giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
