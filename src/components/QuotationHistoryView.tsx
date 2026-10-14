import React, { useState } from 'react';
import { Quotation, Language, CompanyProfile } from '../types';
import { getTranslation } from '../i18n/translations';
import { formatVND, formatDate } from '../utils/formatters';
import { exportQuotationToExcel } from '../utils/storage';
import { 
  History, 
  Search, 
  Filter, 
  Printer, 
  FileSpreadsheet, 
  Copy, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Plus,
  ArrowUpDown
} from 'lucide-react';

interface QuotationHistoryViewProps {
  quotations: Quotation[];
  company: CompanyProfile;
  language: Language;
  onEditQuotation: (quote: Quotation) => void;
  onPrintQuotation: (quote: Quotation) => void;
  onDuplicateQuotation: (quote: Quotation) => void;
  onDeleteQuotation: (id: string) => void;
  onNewQuotation: () => void;
}

export const QuotationHistoryView: React.FC<QuotationHistoryViewProps> = ({
  quotations,
  company,
  language,
  onEditQuotation,
  onPrintQuotation,
  onDuplicateQuotation,
  onDeleteQuotation,
  onNewQuotation
}) => {
  const t = getTranslation(language);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');

  const filteredQuotes = quotations.filter(q => {
    const matchesSearch = 
      q.projectName.toLowerCase().includes(search.toLowerCase()) ||
      q.customerName.toLowerCase().includes(search.toLowerCase()) ||
      q.code.toLowerCase().includes(search.toLowerCase()) ||
      (q.customerPhone && q.customerPhone.includes(search));

    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesProvince = provinceFilter === 'all' || q.province === provinceFilter;

    return matchesSearch && matchesStatus && matchesProvince;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" /> {t.statusApproved}
        </span>;
      case 'in_progress':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          {t.statusInProgress}
        </span>;
      case 'sent':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          {t.statusSent}
        </span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
          {t.statusCompleted}
        </span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
          {t.statusRejected}
        </span>;
      default:
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
          {t.statusDraft}
        </span>;
    }
  };

  const provinces = Array.from(new Set(quotations.map(q => q.province).filter(Boolean)));

  const handleDelete = (id: string, code: string, project: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ báo giá "${code} - ${project}"?`)) {
      onDeleteQuotation(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <span>{t.navHistory}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Lịch sử lưu trữ toàn bộ các hồ sơ dự toán, báo giá thi công công trình
          </p>
        </div>

        <button
          onClick={onNewQuotation}
          className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.quickCreateQuote}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 border border-slate-200 rounded-xl shadow-2xs">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã báo giá, tên dự án, chủ đầu tư, số ĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="all">Tất cả trạng thái ({quotations.length})</option>
            <option value="draft">{t.statusDraft}</option>
            <option value="sent">{t.statusSent}</option>
            <option value="approved">{t.statusApproved}</option>
            <option value="in_progress">{t.statusInProgress}</option>
            <option value="completed">{t.statusCompleted}</option>
            <option value="rejected">{t.statusRejected}</option>
          </select>
        </div>

        <div>
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="all">Tất cả địa điểm</option>
            {provinces.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{t.quoteCode}</th>
                <th className="py-3 px-4">{t.projectName}</th>
                <th className="py-3 px-4">{t.customerName}</th>
                <th className="py-3 px-4">{t.date}</th>
                <th className="py-3 px-4 text-right">Tổng sau thuế</th>
                <th className="py-3 px-4 text-right">Lợi nhuận ròng</th>
                <th className="py-3 px-4 text-center">{t.status}</th>
                <th className="py-3 px-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    {t.noData}
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-blue-600">
                      {q.code}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 max-w-sm truncate" title={q.projectName}>
                        {q.projectName}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate max-w-sm">
                        {q.projectLocation} ({q.province}) · {q.items?.length || 0} hạng mục
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 text-xs">
                        {q.customerName}
                      </div>
                      {q.customerPhone && (
                        <div className="text-[11px] text-slate-500 font-mono">
                          {q.customerPhone}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-600">
                      {formatDate(q.quoteDate)}
                      <div className="text-[10px] text-slate-400">
                        Hạn: {formatDate(q.validUntil)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatVND(q.totalAfterVat)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs tabular-nums">
                      <span className="font-semibold text-emerald-600 block">
                        +{formatVND(q.netProfit)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({q.profitMarginPercent}%)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(q.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit */}
                        <button
                          onClick={() => onEditQuotation(q)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded cursor-pointer"
                          title="Chỉnh sửa báo giá"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Print */}
                        <button
                          onClick={() => onPrintQuotation(q)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                          title="In / Xuất PDF"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Excel Export */}
                        <button
                          onClick={() => exportQuotationToExcel(q, company)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded cursor-pointer"
                          title="Tải file Excel (.xls)"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                        </button>

                        {/* Duplicate */}
                        <button
                          onClick={() => onDuplicateQuotation(q)}
                          className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-slate-100 rounded cursor-pointer"
                          title="Sao chép báo giá để tạo mới"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(q.id, q.code, q.projectName)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded cursor-pointer"
                          title="Xóa báo giá"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
