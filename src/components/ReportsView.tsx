import React from 'react';
import { Quotation, Material, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { formatVND } from '../utils/formatters';
import { BarChart3, TrendingUp, DollarSign, PieChart, Layers, CheckCircle2 } from 'lucide-react';

interface ReportsViewProps {
  quotations: Quotation[];
  materials: Material[];
  language: Language;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  quotations,
  materials,
  language
}) => {
  const t = getTranslation(language);

  // Financial aggregates
  const totalRevenue = quotations.reduce((acc, q) => acc + (q.totalAfterVat || 0), 0);
  const totalSubtotal = quotations.reduce((acc, q) => acc + (q.subtotalBeforeVat || 0), 0);
  const totalMaterialCost = quotations.reduce((acc, q) => acc + (q.totalMaterialCost || 0), 0);
  const totalLaborCost = quotations.reduce((acc, q) => acc + (q.laborCost || 0), 0);
  const totalMachineryCost = quotations.reduce((acc, q) => acc + (q.machineryCost || 0), 0);
  const totalTransportCost = quotations.reduce((acc, q) => acc + (q.transportCost || 0), 0);
  const totalNetProfit = quotations.reduce((acc, q) => acc + (q.netProfit || 0), 0);
  const avgProfitMargin = totalSubtotal > 0 ? ((totalNetProfit / totalSubtotal) * 100).toFixed(1) : '0';

  // Cost proportions
  const totalDirectCosts = totalMaterialCost + totalLaborCost + totalMachineryCost + totalTransportCost || 1;
  const materialPct = Math.round((totalMaterialCost / totalDirectCosts) * 100);
  const laborPct = Math.round((totalLaborCost / totalDirectCosts) * 100);
  const machineryPct = Math.round((totalMachineryCost / totalDirectCosts) * 100);
  const transportPct = Math.round((totalTransportCost / totalDirectCosts) * 100);

  // Status breakdown
  const statusCounts = quotations.reduce((acc, q) => {
    acc[q.status] = (acc[q.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span>{t.navReports}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Phân tích hiệu quả kinh doanh, cơ cấu chi phí thi công và biên lợi nhuận công trình
        </p>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Tổng doanh số dự toán</span>
          <div className="text-xl md:text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatVND(totalRevenue)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {quotations.length} hợp đồng & hồ sơ
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Tổng lợi nhuận ròng dự kiến</span>
          <div className="text-xl md:text-2xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
            +{formatVND(totalNetProfit)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Biên lợi nhuận trung bình: {avgProfitMargin}%
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Chi phí vật tư nhập</span>
          <div className="text-xl md:text-2xl font-bold font-mono text-slate-700 mt-1 tabular-nums">
            {formatVND(totalMaterialCost)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Chiếm {materialPct}% chi phí trực tiếp
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Chi phí nhân công thực chi</span>
          <div className="text-xl md:text-2xl font-bold font-mono text-indigo-700 mt-1 tabular-nums">
            {formatVND(totalLaborCost)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Chiếm {laborPct}% chi phí trực tiếp
          </span>
        </div>
      </div>

      {/* 2 Column Charts & Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Structure Breakdown */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-600" />
            <span>Cơ cấu chi phí trực tiếp công trình (%)</span>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Vật liệu xây dựng (Sắt, xi măng, cát, đá, gạch)</span>
                <span className="font-mono font-bold text-slate-900">{materialPct}% ({formatVND(totalMaterialCost)})</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${materialPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Nhân công xây thô & hoàn thiện</span>
                <span className="font-mono font-bold text-slate-900">{laborPct}% ({formatVND(totalLaborCost)})</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${laborPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Máy móc & Ca bơm, máy đào</span>
                <span className="font-mono font-bold text-slate-900">{machineryPct}% ({formatVND(totalMachineryCost)})</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${machineryPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Vận chuyển & Bốc xếp</span>
                <span className="font-mono font-bold text-slate-900">{transportPct}% ({formatVND(totalTransportCost)})</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${transportPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Project Profitability Comparison */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Hiệu quả sinh lời theo từng công trình</span>
          </h3>

          <div className="space-y-3">
            {quotations.map((q) => (
              <div key={q.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-mono text-xs font-semibold text-blue-600">{q.code}</span>
                    <h4 className="font-bold text-xs text-slate-900 truncate max-w-xs">{q.projectName}</h4>
                    <p className="text-[11px] text-slate-500">{q.customerName} · {q.province}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-xs text-emerald-700 tabular-nums">
                      +{formatVND(q.netProfit)}
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-600">
                      Tỷ suất: {q.profitMarginPercent}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
