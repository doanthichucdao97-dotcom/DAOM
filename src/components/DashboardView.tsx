import React from 'react';
import { Material, Quotation, ProvincialBenchmark, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { formatVND, formatDate } from '../utils/formatters';
import { 
  FileSpreadsheet, 
  TrendingUp, 
  TrendingDown, 
  Boxes, 
  Wallet, 
  CheckCircle2, 
  ArrowUpRight, 
  AlertCircle,
  Printer,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  materials: Material[];
  quotations: Quotation[];
  benchmarks: ProvincialBenchmark[];
  currentProvince: string;
  language: Language;
  onNavigate: (view: string) => void;
  onViewQuotation: (quote: Quotation) => void;
  onPrintQuotation: (quote: Quotation) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  materials,
  quotations,
  benchmarks,
  currentProvince,
  language,
  onNavigate,
  onViewQuotation,
  onPrintQuotation
}) => {
  const t = getTranslation(language);

  // Calculations
  const totalQuoteValue = quotations.reduce((acc, q) => acc + (q.totalAfterVat || 0), 0);
  const totalNetProfit = quotations.reduce((acc, q) => acc + (q.netProfit || 0), 0);
  const approvedQuotes = quotations.filter(q => q.status === 'approved' || q.status === 'in_progress' || q.status === 'completed');
  const winRate = quotations.length > 0 ? Math.round((approvedQuotes.length / quotations.length) * 100) : 0;

  // Recent 5 quotations
  const recentQuotations = [...quotations]
    .sort((a, b) => new Date(b.createdAt || b.quoteDate).getTime() - new Date(a.createdAt || a.quoteDate).getTime())
    .slice(0, 5);

  // Price fluctuations across current province or benchmark
  const activeBenchmark = benchmarks.find(b => b.province === currentProvince) || benchmarks[0];
  const fluctuatingMaterials = activeBenchmark?.materials?.filter(m => m.trend !== 'stable') || [];

  // Aggregated Cost Breakdown
  const totalMaterialSum = quotations.reduce((acc, q) => acc + (q.totalMaterialAmount || 0), 0);
  const totalLaborSum = quotations.reduce((acc, q) => acc + (q.laborCost || 0), 0);
  const totalMachinerySum = quotations.reduce((acc, q) => acc + (q.machineryCost || 0), 0);
  const totalTransportSum = quotations.reduce((acc, q) => acc + (q.transportCost || 0), 0);
  const aggregateTotal = totalMaterialSum + totalLaborSum + totalMachinerySum + totalTransportSum || 1;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" /> {t.statusApproved}
        </span>;
      case 'in_progress':
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          {t.statusInProgress}
        </span>;
      case 'sent':
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          {t.statusSent}
        </span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
          {t.statusCompleted}
        </span>;
      default:
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
          {t.statusDraft}
        </span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Overview Kicker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.appTitle}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>{t.slogan}</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-slate-700">{currentProvince}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => onNavigate('quick_search')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
          >
            <span>🔍 Tra cứu giá vật tư</span>
          </button>
          <button
            onClick={() => onNavigate('market_prices')}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {t.navMarketPrices}
          </button>
          <button
            onClick={() => onNavigate('create_quote')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{t.quickCreateQuote}</span>
          </button>
        </div>
      </div>

      {/* Quick Search Shortcut Banner */}
      <div 
        onClick={() => onNavigate('quick_search')}
        className="p-3.5 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-xl flex items-center justify-between shadow-2xs cursor-pointer hover:from-blue-800 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
            🔍
          </div>
          <div>
            <h3 className="font-bold text-xs md:text-sm text-white group-hover:text-blue-200 transition-colors">
              Tra cứu nhanh đơn giá thị trường & Dự toán kinh phí theo số lượng
            </h3>
            <p className="text-[11px] text-slate-300">
              Nhập tên vật tư bất kỳ (Thép, Xi măng, Cát, Đá, Gạch, Bê tông...) để xem giá các tỉnh và tính tiền ngay
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-blue-300 group-hover:translate-x-1 transition-transform">
          <span>Mở công cụ</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Materials */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">{t.totalMaterials}</span>
            <Boxes className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {materials.length}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <span className="text-blue-600 font-medium">9 danh mục</span>
            <span aria-hidden="true">·</span>
            <span>Đã cập nhật giá mới</span>
          </div>
        </div>

        {/* Total Quotations */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">{t.totalQuotations}</span>
            <FileSpreadsheet className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {quotations.length}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <span className="text-emerald-600 font-medium">{approvedQuotes.length} đã duyệt</span>
            <span aria-hidden="true">·</span>
            <span>Tỷ lệ: {winRate}%</span>
          </div>
        </div>

        {/* Total Quotation Value */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">{t.totalQuoteValue}</span>
            <Wallet className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums truncate">
            {formatVND(totalQuoteValue)}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <span>Bao gồm VAT</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-600 font-medium">{quotations.length} dự án</span>
          </div>
        </div>

        {/* Expected Net Profit */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">{t.expectedProfit}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums truncate">
            {formatVND(totalNetProfit)}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <span className="font-semibold text-emerald-700">
              {totalQuoteValue > 0 ? ((totalNetProfit / totalQuoteValue) * 100).toFixed(1) : 0}%
            </span>
            <span>Biên lợi nhuận ròng</span>
          </div>
        </div>
      </div>

      {/* Main 2-column Layout: Fluctuations & Cost Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Recent Quotations */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm md:text-base">
                {t.recentQuotations}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Các hồ sơ báo giá công trình thi công mới nhất
              </p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <span>{t.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">{t.quoteCode}</th>
                  <th className="py-3 px-4">{t.projectName}</th>
                  <th className="py-3 px-4">{t.customerName}</th>
                  <th className="py-3 px-4 text-right">{t.totalAfterVat}</th>
                  <th className="py-3 px-4 text-center">{t.status}</th>
                  <th className="py-3 px-4 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentQuotations.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-xs text-blue-600">
                      {quote.code}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 max-w-xs truncate" title={quote.projectName}>
                        {quote.projectName}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <span>{quote.province}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatDate(quote.quoteDate)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-800">
                      {quote.customerName}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {formatVND(quote.totalAfterVat)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(quote.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewQuotation(quote)}
                          className="px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                          title="Xem & Chỉnh sửa"
                        >
                          {t.edit}
                        </button>
                        <button
                          onClick={() => onPrintQuotation(quote)}
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                          title={t.exportPdf}
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Market Fluctuations & Cost Structure */}
        <div className="space-y-6">
          {/* Market Price Alert Box */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <h3 className="font-semibold text-slate-900 text-sm">
                  {t.marketPriceAlerts}
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {currentProvince}
              </span>
            </div>

            <div className="space-y-2.5">
              {fluctuatingMaterials.slice(0, 4).map((m) => (
                <div key={m.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="pr-2">
                    <div className="font-medium text-xs text-slate-900 truncate max-w-[150px]">
                      {m.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {m.spec} · {m.unit}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                      {formatVND(m.marketPrice)}
                    </div>
                    <div className={`flex items-center justify-end text-[11px] font-semibold ${
                      m.trend === 'up' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {m.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-0.5" />
                      )}
                      {m.percentChange > 0 ? `+${m.percentChange}%` : `${m.percentChange}%`}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('market_prices')}
              className="w-full mt-3 py-2 text-center text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            >
              {t.viewAll} giá 63 tỉnh thành &rarr;
            </button>
          </div>

          {/* Aggregated Cost Composition */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <h3 className="font-semibold text-slate-900 text-sm mb-3">
              {t.projectCostBreakdown}
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Vật tư xây dựng</span>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold">
                    {Math.round((totalMaterialSum / aggregateTotal) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${(totalMaterialSum / aggregateTotal) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Chi phí nhân công</span>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold">
                    {Math.round((totalLaborSum / aggregateTotal) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${(totalLaborSum / aggregateTotal) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Máy móc & Vận chuyển</span>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold">
                    {Math.round(((totalMachinerySum + totalTransportSum) / aggregateTotal) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${((totalMachinerySum + totalTransportSum) / aggregateTotal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
