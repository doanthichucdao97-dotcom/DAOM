import React, { useState } from 'react';
import { ProvincialBenchmark, Material, Language, BenchmarkMaterial } from '../types';
import { getTranslation } from '../i18n/translations';
import { formatVND, formatDate } from '../utils/formatters';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  MapPin, 
  HardHat, 
  Truck, 
  Layers, 
  PlusCircle, 
  Check, 
  ArrowLeftRight,
  Info
} from 'lucide-react';

interface MarketPricesViewProps {
  benchmarks: ProvincialBenchmark[];
  currentProvince: string;
  onProvinceChange: (province: string) => void;
  language: Language;
  onAddMaterialFromBenchmark: (item: BenchmarkMaterial, province: string) => void;
  onNavigateToQuoteWithLaborWage?: (wage: number, province: string) => void;
}

export const MarketPricesView: React.FC<MarketPricesViewProps> = ({
  benchmarks,
  currentProvince,
  onProvinceChange,
  language,
  onAddMaterialFromBenchmark
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'materials' | 'labor' | 'machinery' | 'compare'>('materials');
  const [regionFilter, setRegionFilter] = useState<'all' | 'Miền Bắc' | 'Miền Trung' | 'Miền Nam'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  // Comparison state
  const [compareProvinceA, setCompareProvinceA] = useState<string>(currentProvince);
  const [compareProvinceB, setCompareProvinceB] = useState<string>(
    benchmarks.find(b => b.province !== currentProvince)?.province || 'Hà Nội'
  );

  const activeBenchmark = benchmarks.find(b => b.province === currentProvince) || benchmarks[0];

  // Filtered materials
  const filteredMaterials = activeBenchmark?.materials?.filter(m => {
    const matchesSearch = searchQuery === '' || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.spec.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) || [];

  const handleAddToCatalog = (item: BenchmarkMaterial) => {
    onAddMaterialFromBenchmark(item, activeBenchmark.province);
    setAddedItemIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [item.id]: false }));
    }, 2500);
  };

  // Provinces list filtered by region
  const filteredProvinces = benchmarks.filter(b => {
    if (regionFilter === 'all') return true;
    return b.region === regionFilter;
  });

  // Benchmarks for comparison
  const benchmarkA = benchmarks.find(b => b.province === compareProvinceA) || benchmarks[0];
  const benchmarkB = benchmarks.find(b => b.province === compareProvinceB) || benchmarks[1] || benchmarks[0];

  return (
    <div className="space-y-6">
      {/* Province Picker & Region Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t.navMarketPrices}
              </h2>
              <p className="text-xs text-slate-500">
                {t.sourceOfficial} · Cập nhật ngày {formatDate(activeBenchmark?.lastUpdated || '')}
              </p>
            </div>
          </div>

          {/* Region Tabs (Interactive Filter Buttons) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setRegionFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                regionFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.all}
            </button>
            <button
              onClick={() => setRegionFilter('Miền Bắc')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                regionFilter === 'Miền Bắc' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.regionNorth}
            </button>
            <button
              onClick={() => setRegionFilter('Miền Trung')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                regionFilter === 'Miền Trung' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.regionCentral}
            </button>
            <button
              onClick={() => setRegionFilter('Miền Nam')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                regionFilter === 'Miền Nam' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.regionSouth}
            </button>
          </div>
        </div>

        {/* Horizontal Province Selector Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {filteredProvinces.map((b) => (
            <button
              key={b.province}
              onClick={() => onProvinceChange(b.province)}
              className={`px-3.5 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                currentProvince === b.province
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {b.province}
            </button>
          ))}
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-3">
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'materials'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t.marketTabMaterials}</span>
          </button>
          <button
            onClick={() => setActiveTab('labor')}
            className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'labor'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <HardHat className="w-4 h-4" />
            <span>{t.marketTabLabor}</span>
          </button>
          <button
            onClick={() => setActiveTab('machinery')}
            className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'machinery'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>{t.marketTabMachinery}</span>
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>{t.marketTabCompare}</span>
          </button>
        </div>

        {activeTab === 'materials' && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* TAB 1: Materials Prices */}
      {activeTab === 'materials' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">{t.materialName}</th>
                  <th className="py-3 px-4">{t.materialGroup}</th>
                  <th className="py-3 px-4">{t.specifications}</th>
                  <th className="py-3 px-4 text-center">{t.unit}</th>
                  <th className="py-3 px-4 text-right">Đơn giá thị trường</th>
                  <th className="py-3 px-4 text-right">Giá kỳ trước</th>
                  <th className="py-3 px-4 text-center">Biến động</th>
                  <th className="py-3 px-4">Nguồn dữ liệu</th>
                  <th className="py-3 px-4 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMaterials.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {item.group}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">
                      {item.spec}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-xs">
                      {item.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatVND(item.marketPrice)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-slate-400 tabular-nums">
                      {formatVND(item.previousPrice)}
                    </td>
                    <td className="py-3 px-4 text-center">
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
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">
                      {item.source}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleAddToCatalog(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                          addedItemIds[item.id]
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                        title="Thêm mặt hàng này vào Danh mục vật tư của công ty"
                      >
                        {addedItemIds[item.id] ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Đã thêm</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>{t.applyToCatalog}</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Labor Wages */}
      {activeTab === 'labor' && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-800">
            <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
            <div>
              <span className="font-semibold">Mức lương nhân công xây dựng tại {activeBenchmark.province}:</span> Đơn giá ngày công khảo sát thực tế trên địa bàn, áp dụng làm cơ sở lập chi phí nhân công trong bảng dự toán báo giá.
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Vị trí nhân công / Hạng mục</th>
                    <th className="py-3 px-4 text-center">{t.unit}</th>
                    <th className="py-3 px-4 text-right">{t.averageWage}</th>
                    <th className="py-3 px-4 text-center">{t.wageRange}</th>
                    <th className="py-3 px-4 text-center">Xu hướng</th>
                    <th className="py-3 px-4">Ghi chú & Yêu cầu kỹ năng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {activeBenchmark?.laborWages?.map((lw) => (
                    <tr key={lw.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {lw.role}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-xs text-slate-500">
                        {lw.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {formatVND(lw.averageWage)}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-xs text-slate-600 tabular-nums">
                        {formatVND(lw.rangeMin)} - {formatVND(lw.rangeMax)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {lw.trend === 'up' ? (
                          <span className="text-xs text-amber-600 font-semibold inline-flex items-center gap-0.5">
                            <TrendingUp className="w-3.5 h-3.5" /> Tăng nhẹ
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">
                            Ổn định
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        {lw.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Machinery Rates */}
      {activeTab === 'machinery' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Loại máy móc / Thiết bị thi công</th>
                  <th className="py-3 px-4 text-center">{t.unit}</th>
                  <th className="py-3 px-4 text-right">Đơn giá thuê bình quân</th>
                  <th className="py-3 px-4">Điều kiện vận hành & Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {activeBenchmark?.machineryRates?.map((mc) => (
                  <tr key={mc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {mc.machine}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-xs text-slate-500">
                      {mc.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatVND(mc.averageRate)}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {mc.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Inter-Provincial Comparison */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tỉnh / Thành phố thứ nhất:
              </label>
              <select
                value={compareProvinceA}
                onChange={(e) => setCompareProvinceA(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
              >
                {benchmarks.map(b => (
                  <option key={b.province} value={b.province}>{b.province} ({b.region})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tỉnh / Thành phố so sánh:
              </label>
              <select
                value={compareProvinceB}
                onChange={(e) => setCompareProvinceB(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
              >
                {benchmarks.map(b => (
                  <option key={b.province} value={b.province}>{b.province} ({b.region})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 text-sm">
                Bảng so sánh chênh lệch đơn giá: {compareProvinceA} vs {compareProvinceB}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Hạng mục so sánh</th>
                    <th className="py-3 px-4 text-center">ĐVT</th>
                    <th className="py-3 px-4 text-right">{compareProvinceA}</th>
                    <th className="py-3 px-4 text-right">{compareProvinceB}</th>
                    <th className="py-3 px-4 text-right">Chênh lệch (VND)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {/* Common Materials */}
                  <tr className="bg-slate-100/50">
                    <td colSpan={5} className="py-2 px-4 font-bold text-xs text-slate-600 uppercase">
                      1. Vật tư chủ lực
                    </td>
                  </tr>
                  {benchmarkA.materials.slice(0, 5).map((matA) => {
                    const matB = benchmarkB.materials.find(m => m.name === matA.name || m.group === matA.group);
                    const priceA = matA.marketPrice;
                    const priceB = matB ? matB.marketPrice : priceA;
                    const diff = priceA - priceB;
                    return (
                      <tr key={matA.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {matA.name}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-xs">
                          {matA.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-slate-900">
                          {formatVND(priceA)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-slate-900">
                          {formatVND(priceB)}
                        </td>
                        <td className={`py-3 px-4 text-right font-mono font-bold tabular-nums ${
                          diff > 0 ? 'text-amber-600' : diff < 0 ? 'text-blue-600' : 'text-slate-400'
                        }`}>
                          {diff > 0 ? `+${formatVND(diff)}` : diff < 0 ? `-${formatVND(Math.abs(diff))}` : '0 ₫'}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Common Labor */}
                  <tr className="bg-slate-100/50">
                    <td colSpan={5} className="py-2 px-4 font-bold text-xs text-slate-600 uppercase">
                      2. Tiền lương nhân công
                    </td>
                  </tr>
                  {benchmarkA.laborWages.slice(0, 3).map((lwA) => {
                    const lwB = benchmarkB.laborWages.find(w => w.role.includes(lwA.role.slice(0, 8)));
                    const wageA = lwA.averageWage;
                    const wageB = lwB ? lwB.averageWage : wageA;
                    const diff = wageA - wageB;
                    return (
                      <tr key={lwA.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {lwA.role}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-xs">
                          {lwA.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-slate-900">
                          {formatVND(wageA)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-slate-900">
                          {formatVND(wageB)}
                        </td>
                        <td className={`py-3 px-4 text-right font-mono font-bold tabular-nums ${
                          diff > 0 ? 'text-amber-600' : diff < 0 ? 'text-blue-600' : 'text-slate-400'
                        }`}>
                          {diff > 0 ? `+${formatVND(diff)}` : diff < 0 ? `-${formatVND(Math.abs(diff))}` : '0 ₫'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
