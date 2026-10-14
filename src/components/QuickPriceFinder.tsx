import React, { useState, useMemo } from 'react';
import { Material, ProvincialBenchmark, Language, QuotationItem } from '../types';
import { getTranslation } from '../i18n/translations';
import { formatVND, formatDate } from '../utils/formatters';
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Plus, 
  Calculator, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Boxes, 
  Building2, 
  FileSpreadsheet, 
  X, 
  SlidersHorizontal,
  ChevronRight,
  BadgePercent
} from 'lucide-react';

interface QuickPriceFinderProps {
  materials: Material[];
  benchmarks: ProvincialBenchmark[];
  currentProvince: string;
  onProvinceChange: (province: string) => void;
  language: Language;
  onAddToQuotation: (item: Partial<QuotationItem>) => void;
  onAddMaterialToCatalog: (material: Material) => void;
  onNavigate: (view: string) => void;
}

const QUICK_TAGS = [
  'Thép D10',
  'Thép D16',
  'Thép Pomina',
  'Xi măng Hà Tiên',
  'Xi măng Nghi Sơn',
  'Keo dán gạch Weber',
  'Cát vàng bê tông',
  'Đá 1x2 xanh',
  'Gạch 4 lỗ',
  'Gạch 80x80 Đồng Tâm',
  'Đá granite Kim Sa',
  'Cọc BTCT 250x250',
  'Bê tông M250',
  'Bê tông M350',
  'Sơn Jotun',
  'Chống thấm Sikatop',
  'Dây Cadivi 2.5',
  'Ống Tiền Phong D90',
  'Trần thạch cao Vĩnh Tường',
  'Bồn cầu TOTO',
  'Máy bơm tăng áp'
];

export const QuickPriceFinder: React.FC<QuickPriceFinderProps> = ({
  materials,
  benchmarks,
  currentProvince,
  onProvinceChange,
  language,
  onAddToQuotation,
  onAddMaterialToCatalog,
  onNavigate
}) => {
  const t = getTranslation(language);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under100k' | '100k_500k' | '500k_2m' | 'over2m'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'catalog' | 'market'>('all');

  // Quantity estimator state per item id
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedItemNotice, setAddedItemNotice] = useState<Record<string, string>>({});

  const activeBenchmark = benchmarks.find(b => b.province === currentProvince) || benchmarks[0];

  // Combine both Internal Catalog Materials and Provincial Market Benchmark Materials into unified searchable items
  interface UnifiedSearchResult {
    id: string;
    source: 'catalog' | 'market';
    name: string;
    code: string;
    group: string;
    spec: string;
    unit: string;
    price: number; // sellingPrice for catalog, marketPrice for benchmark
    costPrice?: number;
    trend?: 'up' | 'down' | 'stable';
    percentChange?: number;
    supplierOrSource: string;
    province?: string;
    rawMaterial?: Material;
  }

  const allSearchableItems: UnifiedSearchResult[] = useMemo(() => {
    const list: UnifiedSearchResult[] = [];

    // Internal materials
    materials.forEach(m => {
      list.push({
        id: `cat-${m.id}`,
        source: 'catalog',
        name: m.name,
        code: m.code,
        group: m.group,
        spec: m.spec,
        unit: m.unit,
        price: m.sellingPrice,
        costPrice: m.costPrice,
        supplierOrSource: m.supplierName || 'Danh mục nội bộ',
        rawMaterial: m
      });
    });

    // Market benchmarks from selected province
    if (activeBenchmark && activeBenchmark.materials) {
      activeBenchmark.materials.forEach(bm => {
        // avoid duplicating exact names if user prefers
        list.push({
          id: `bm-${bm.id}`,
          source: 'market',
          name: bm.name,
          code: `TT-${bm.group.toUpperCase()}`,
          group: bm.group,
          spec: bm.spec,
          unit: bm.unit,
          price: bm.marketPrice,
          trend: bm.trend,
          percentChange: bm.percentChange,
          supplierOrSource: `${bm.source} (${activeBenchmark.province})`,
          province: activeBenchmark.province
        });
      });
    }

    return list;
  }, [materials, activeBenchmark]);

  // Filtered Search Results
  const filteredResults = useMemo(() => {
    return allSearchableItems.filter(item => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        const matchSpec = item.spec.toLowerCase().includes(q);
        const matchGroup = item.group.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchSpec && !matchGroup) return false;
      }

      // 2. Source filter
      if (sourceFilter !== 'all' && item.source !== sourceFilter) {
        return false;
      }

      // 3. Category
      if (selectedCategory !== 'all') {
        if (!item.group.toLowerCase().includes(selectedCategory.toLowerCase()) && 
            !selectedCategory.toLowerCase().includes(item.group.toLowerCase())) {
          return false;
        }
      }

      // 4. Price range
      if (priceRange === 'under100k' && item.price >= 100000) return false;
      if (priceRange === '100k_500k' && (item.price < 100000 || item.price > 500000)) return false;
      if (priceRange === '500k_2m' && (item.price < 500000 || item.price > 2000000)) return false;
      if (priceRange === 'over2m' && item.price <= 2000000) return false;

      return true;
    });
  }, [allSearchableItems, searchQuery, sourceFilter, selectedCategory, priceRange]);

  const handleQuantityChange = (id: string, qty: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, qty)
    }));
  };

  const handleQuickAddQuote = (item: UnifiedSearchResult) => {
    const qty = quantities[item.id] || 1;
    const cost = item.costPrice || Math.round(item.price * 0.9);
    onAddToQuotation({
      materialId: item.rawMaterial?.id || `mat-quick-${Date.now()}`,
      code: item.code,
      name: item.name,
      spec: item.spec,
      unit: item.unit,
      quantity: qty,
      costPrice: cost,
      sellingPrice: item.price,
      amount: qty * item.price,
      profit: qty * (item.price - cost),
      notes: `Tra cứu giá tại ${activeBenchmark.province}`
    });

    setAddedItemNotice(prev => ({ ...prev, [item.id]: 'Đã thêm vào báo giá!' }));
    setTimeout(() => {
      setAddedItemNotice(prev => ({ ...prev, [item.id]: '' }));
    }, 2500);
  };

  const handleSaveToCatalog = (item: UnifiedSearchResult) => {
    const newMaterial: Material = {
      id: `mat-${Date.now()}`,
      code: item.code,
      name: item.name,
      group: item.group,
      spec: item.spec,
      unit: item.unit,
      supplierId: '',
      supplierName: item.supplierOrSource,
      costPrice: Math.round(item.price * 0.9),
      sellingPrice: item.price,
      vatRate: 10,
      updatedAt: new Date().toISOString().split('T')[0],
      notes: `Lưu từ bảng giá thị trường ${currentProvince}`
    };

    onAddMaterialToCatalog(newMaterial);
    setAddedItemNotice(prev => ({ ...prev, [item.id]: 'Đã lưu vào danh mục!' }));
    setTimeout(() => {
      setAddedItemNotice(prev => ({ ...prev, [item.id]: '' }));
    }, 2500);
  };

  // Cross-province price overview for current search query if relevant
  const crossProvinceComparison = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return null;
    const q = searchQuery.toLowerCase();

    const matchesPerProvince: { province: string; region: string; material: any }[] = [];
    benchmarks.forEach(b => {
      const found = b.materials.find(m => m.name.toLowerCase().includes(q) || m.group.toLowerCase().includes(q));
      if (found) {
        matchesPerProvince.push({
          province: b.province,
          region: b.region,
          material: found
        });
      }
    });

    return matchesPerProvince.length >= 2 ? matchesPerProvince : null;
  }, [benchmarks, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-6 md:p-8 shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tra Cứu Nhanh & Dự Toán Chi Phí Tức Thời</span>
          </div>

          <h2 className="text-xl md:text-3xl font-black tracking-tight text-white mb-2">
            Tìm giá vật tư xây dựng toàn quốc
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6">
            Dễ dàng tra cứu đơn giá sắt thép, xi măng, cát, đá, bê tông tươi, gạch, thiết bị điện nước theo từng tỉnh thành. Nhập số lượng để tự động tính tổng kinh phí tức thì.
          </p>

          {/* Big Search Box */}
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.quickSearchPlaceholder}
              className="w-full pl-12 pr-12 py-3.5 bg-white text-slate-900 rounded-xl text-sm md:text-base font-medium placeholder-slate-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Click Tags */}
          <div className="mt-4 flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-slate-400 font-medium mr-1">Tìm nhanh:</span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  searchQuery === tag
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Province Selector */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">Đơn vị khảo sát tại:</span>
            <select
              value={currentProvince}
              onChange={(e) => onProvinceChange(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs md:text-sm font-bold text-blue-900 cursor-pointer"
            >
              {benchmarks.map(b => (
                <option key={b.province} value={b.province}>{b.province} ({b.region})</option>
              ))}
            </select>
          </div>

          {/* Source Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                sourceFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả nguồn ({allSearchableItems.length})
            </button>
            <button
              onClick={() => setSourceFilter('catalog')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                sourceFilter === 'catalog' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kho nội bộ ({materials.length})
            </button>
            <button
              onClick={() => setSourceFilter('market')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                sourceFilter === 'market' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Thị trường {currentProvince}
            </button>
          </div>
        </div>

        {/* Secondary Category and Price Range Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Phân loại vật tư
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            >
              <option value="all">Tất cả chủng loại</option>
              <option value="sắt thép">Sắt thép & Kim khí</option>
              <option value="xi măng">Xi măng & Vữa</option>
              <option value="cát">Cát xây dựng</option>
              <option value="đá">Đá xây dựng</option>
              <option value="gạch">Gạch xây & Ốp lát</option>
              <option value="bê tông">Bê tông tươi & Cọc</option>
              <option value="sơn">Sơn, Bột bả & Chống thấm</option>
              <option value="điện">Thiết bị Điện & Chiếu sáng</option>
              <option value="nước">Cấp thoát nước & Phụ kiện</option>
              <option value="cửa">Gỗ, Cửa & Thạch cao</option>
              <option value="vệ sinh">Thiết bị vệ sinh & Bếp</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Khoảng giá
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as any)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            >
              <option value="all">Tất cả mức giá</option>
              <option value="under100k">Dưới 100.000 đ</option>
              <option value="100k_500k">100.000 đ - 500.000 đ</option>
              <option value="500k_2m">500.000 đ - 2.000.000 đ</option>
              <option value="over2m">Trên 2.000.000 đ</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-end justify-between text-xs text-slate-500 pb-1">
            <div>
              Tìm thấy <strong className="text-slate-900">{filteredResults.length}</strong> vật tư phù hợp
              {searchQuery && <span> cho từ khóa "<strong className="text-blue-600">{searchQuery}</strong>"</span>}
            </div>

            {(searchQuery || selectedCategory !== 'all' || priceRange !== 'all' || sourceFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceRange('all');
                  setSourceFilter('all');
                }}
                className="text-xs text-blue-600 hover:underline cursor-pointer font-medium"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cross-Province Matrix Box (If user searched for specific material) */}
      {crossProvinceComparison && (
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Bảng đối chiếu giá "{searchQuery}" giữa các tỉnh thành</span>
            </h3>
            <span className="text-[11px] text-blue-700 font-medium">Khảo sát ngày {formatDate(activeBenchmark.lastUpdated)}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {crossProvinceComparison.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => onProvinceChange(item.province)}
                className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                  item.province === currentProvince
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-800 border-blue-100 hover:border-blue-300'
                }`}
              >
                <div className="text-[11px] font-semibold truncate">{item.province}</div>
                <div className="font-mono font-bold text-xs mt-0.5 tabular-nums">
                  {formatVND(item.material.marketPrice)}
                </div>
                <div className="text-[10px] opacity-75">
                  / {item.material.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResults.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white border border-slate-200 rounded-2xl">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base">Không tìm thấy vật tư nào phù hợp</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Hãy thử tìm kiếm với từ khóa khác như "Thép", "Xi măng", "Cát", "Sơn", hoặc chọn các từ khóa gợi ý bên trên.
            </p>
          </div>
        ) : (
          filteredResults.map((item) => {
            const qty = quantities[item.id] || 1;
            const subtotal = qty * item.price;
            const notice = addedItemNotice[item.id];

            return (
              <div 
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {item.code}
                      </span>
                      {item.source === 'catalog' ? (
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          Kho nội bộ
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Thị trường {item.province}
                        </span>
                      )}
                    </div>

                    {item.trend && (
                      <div className="shrink-0">
                        {item.trend === 'up' && (
                          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-600">
                            <TrendingUp className="w-3.5 h-3.5" /> +{item.percentChange}%
                          </span>
                        )}
                        {item.trend === 'down' && (
                          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                            <TrendingDown className="w-3.5 h-3.5" /> {item.percentChange}%
                          </span>
                        )}
                        {item.trend === 'stable' && (
                          <span className="inline-flex items-center gap-0.5 text-xs text-slate-400 font-medium">
                            <Minus className="w-3 h-3" /> 0%
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Material Name & Spec */}
                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.spec || item.group}
                  </p>

                  {/* Price Tag */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Đơn giá bán:</span>
                      <div className="text-lg md:text-xl font-black font-mono text-slate-900 tabular-nums">
                        {formatVND(item.price)}
                        <span className="text-xs font-normal text-slate-500 ml-1">/ {item.unit}</span>
                      </div>
                    </div>

                    {item.costPrice && (
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Giá vốn:</span>
                        <span className="font-mono text-xs text-slate-600 tabular-nums">
                          {formatVND(item.costPrice)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Source and Provider */}
                  <div className="text-[11px] text-slate-400 mt-2 truncate">
                    Nguồn: {item.supplierOrSource}
                  </div>
                </div>

                {/* Bottom Interactive Calculator & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                  {/* Quantity Estimator Bar */}
                  <div className="flex items-center justify-between gap-2 p-2 bg-slate-100/70 rounded-lg">
                    <span className="text-xs font-medium text-slate-600">Số lượng:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, qty - 1)}
                        className="w-6 h-6 rounded bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={qty}
                        onChange={(e) => handleQuantityChange(item.id, parseFloat(e.target.value) || 1)}
                        className="w-16 p-1 text-center bg-white border border-slate-300 rounded font-mono font-bold text-xs"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.id, qty + 1)}
                        className="w-6 h-6 rounded bg-white hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Calculated Estimated Amount */}
                  <div className="flex justify-between items-center text-xs px-1">
                    <span className="text-slate-500">Thành tiền dự toán:</span>
                    <span className="font-mono font-black text-blue-900 text-sm tabular-nums">
                      {formatVND(subtotal)}
                    </span>
                  </div>

                  {/* Feedback Notice */}
                  {notice && (
                    <div className="p-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded text-center border border-emerald-200">
                      ✓ {notice}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {item.source === 'market' && (
                      <button
                        onClick={() => handleSaveToCatalog(item)}
                        className="flex-1 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors cursor-pointer text-center"
                        title="Lưu vào danh mục nội bộ của công ty"
                      >
                        Lưu vào kho
                      </button>
                    )}

                    <button
                      onClick={() => handleQuickAddQuote(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Đưa vào báo giá</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
