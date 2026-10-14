import React from 'react';
import { Quotation, CompanyProfile, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { formatVND, formatDate, numberToVietnameseWords } from '../utils/formatters';
import { exportQuotationToExcel } from '../utils/storage';
import { Printer, FileSpreadsheet, X, Building2, HardHat } from 'lucide-react';

interface QuotationPrintModalProps {
  quotation: Quotation | null;
  company: CompanyProfile;
  language: Language;
  onClose: () => void;
}

export const QuotationPrintModal: React.FC<QuotationPrintModalProps> = ({
  quotation,
  company,
  language,
  onClose
}) => {
  const t = getTranslation(language);

  if (!quotation) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    exportQuotationToExcel(quotation, company);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden my-auto print:shadow-none print:m-0 print:w-full print:max-w-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between p-4 bg-slate-900 text-white no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-400" />
            <h2 className="font-semibold text-sm md:text-base">
              Xem trước phiếu báo giá & In ấn chuẩn A4
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{t.exportExcel}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>{t.exportPdf} (In / PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 md:p-10 text-slate-900 bg-white font-sans print:p-0">
          {/* Header Zone: Company Letterhead */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b-2 border-slate-900">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0 mt-0.5">
                <HardHat className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-base md:text-lg font-bold text-slate-900 uppercase tracking-tight">
                  {company.name}
                </h1>
                <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                  <p><strong>Địa chỉ:</strong> {company.address}</p>
                  <p><strong>MST:</strong> {company.taxCode} | <strong>Hotline:</strong> {company.phone} | <strong>Email:</strong> {company.email}</p>
                  <p><strong>Tài khoản:</strong> {company.bankAccount} - {company.bankName}</p>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 font-mono text-xs self-end sm:self-start">
              <div className="font-bold text-blue-900 text-sm">{quotation.code}</div>
              <div className="text-slate-500">Ngày lập: {formatDate(quotation.quoteDate)}</div>
              <div className="text-slate-500">Hiệu lực đến: {formatDate(quotation.validUntil)}</div>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center my-6">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-wider">
              {t.companyQuotation}
            </h2>
            <p className="text-xs italic text-slate-500 mt-1">
              (Dự toán chi phí vật tư, nhân công & thiết bị thi công trọn gói)
            </p>
          </div>

          {/* Project & Client Information Grid */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6">
            <div>
              <span className="text-slate-500 font-semibold">{t.client}: </span>
              <strong className="text-slate-900">{quotation.customerName}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">{t.preparedBy}: </span>
              <strong className="text-slate-900">{quotation.preparedBy}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">{t.projectName}: </span>
              <strong className="text-slate-900">{quotation.projectName}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">{t.customerPhone}: </span>
              <span className="font-mono">{quotation.customerPhone || '-'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 font-semibold">{t.projectLocation}: </span>
              <span>{quotation.projectLocation} ({quotation.province})</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse border border-slate-300 text-xs">
              <thead className="bg-slate-100 text-slate-800 font-bold uppercase border-b border-slate-300">
                <tr>
                  <th className="border border-slate-300 py-2 px-2 text-center w-8">STT</th>
                  <th className="border border-slate-300 py-2 px-2 w-20 text-center">Mã VT</th>
                  <th className="border border-slate-300 py-2 px-3">Tên vật tư / Hạng mục</th>
                  <th className="border border-slate-300 py-2 px-2">Quy cách kỹ thuật</th>
                  <th className="border border-slate-300 py-2 px-2 text-center w-12">ĐVT</th>
                  <th className="border border-slate-300 py-2 px-2 text-right w-16">Khối lượng</th>
                  <th className="border border-slate-300 py-2 px-2 text-right w-24">Đơn giá bán (đ)</th>
                  <th className="border border-slate-300 py-2 px-2 text-right w-28">Thành tiền (đ)</th>
                  <th className="border border-slate-300 py-2 px-2">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {quotation.items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="border border-slate-300 py-1.5 px-2 text-center font-mono">
                      {index + 1}
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 text-center font-mono text-[11px] text-slate-600">
                      {item.code}
                    </td>
                    <td className="border border-slate-300 py-1.5 px-3 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 text-slate-600">
                      {item.spec || '-'}
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 text-center font-mono">
                      {item.unit}
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 text-right font-mono font-medium tabular-nums">
                      {item.quantity}
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 text-right font-mono tabular-nums">
                      {formatVND(item.sellingPrice)}
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatVND(item.amount)}
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 text-slate-500 text-[11px]">
                      {item.notes || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="font-semibold bg-slate-50 text-xs">
                <tr>
                  <td colSpan={7} className="border border-slate-300 py-2 px-3 text-right">
                    1. TỔNG GIÁ TRỊ VẬT TƯ:
                  </td>
                  <td className="border border-slate-300 py-2 px-2 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {formatVND(quotation.totalMaterialAmount)}
                  </td>
                  <td className="border border-slate-300"></td>
                </tr>
                <tr>
                  <td colSpan={7} className="border border-slate-300 py-1.5 px-3 text-right">
                    2. Chi phí nhân công xây dựng:
                  </td>
                  <td className="border border-slate-300 py-1.5 px-2 text-right font-mono tabular-nums">
                    {formatVND(quotation.laborCost)}
                  </td>
                  <td className="border border-slate-300"></td>
                </tr>
                <tr>
                  <td colSpan={7} className="border border-slate-300 py-1.5 px-3 text-right">
                    3. Chi phí máy móc thi công:
                  </td>
                  <td className="border border-slate-300 py-1.5 px-2 text-right font-mono tabular-nums">
                    {formatVND(quotation.machineryCost)}
                  </td>
                  <td className="border border-slate-300"></td>
                </tr>
                <tr>
                  <td colSpan={7} className="border border-slate-300 py-1.5 px-3 text-right">
                    4. Chi phí vận chuyển & bốc xếp:
                  </td>
                  <td className="border border-slate-300 py-1.5 px-2 text-right font-mono tabular-nums">
                    {formatVND(quotation.transportCost)}
                  </td>
                  <td className="border border-slate-300"></td>
                </tr>
                {quotation.contingencyCost > 0 && (
                  <tr>
                    <td colSpan={7} className="border border-slate-300 py-1.5 px-3 text-right">
                      5. Chi phí dự phòng phát sinh ({quotation.contingencyPercent}%):
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 text-right font-mono tabular-nums">
                      +{formatVND(quotation.contingencyCost)}
                    </td>
                    <td className="border border-slate-300"></td>
                  </tr>
                )}
                {quotation.discountAmount > 0 && (
                  <tr>
                    <td colSpan={7} className="border border-slate-300 py-1.5 px-3 text-right text-rose-700">
                      6. Chiết khấu thương mại ({quotation.discountPercent}%):
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 text-right font-mono tabular-nums text-rose-700">
                      -{formatVND(quotation.discountAmount)}
                    </td>
                    <td className="border border-slate-300"></td>
                  </tr>
                )}
                <tr className="bg-slate-100">
                  <td colSpan={7} className="border border-slate-300 py-2 px-3 text-right font-bold">
                    TỔNG CỘNG TRƯỚC THUẾ:
                  </td>
                  <td className="border border-slate-300 py-2 px-2 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {formatVND(quotation.subtotalBeforeVat)}
                  </td>
                  <td className="border border-slate-300"></td>
                </tr>
                <tr>
                  <td colSpan={7} className="border border-slate-300 py-1.5 px-3 text-right">
                    Thuế giá trị gia tăng (VAT {quotation.vatPercent}%):
                  </td>
                  <td className="border border-slate-300 py-1.5 px-2 text-right font-mono tabular-nums">
                    +{formatVND(quotation.vatAmount)}
                  </td>
                  <td className="border border-slate-300"></td>
                </tr>
                <tr className="bg-blue-50 text-slate-900">
                  <td colSpan={7} className="border border-slate-300 py-2.5 px-3 text-right text-sm font-black uppercase">
                    TỔNG GIÁ TRỊ BÁO GIÁ THANH TOÁN (SAU THUẾ):
                  </td>
                  <td className="border border-slate-300 py-2.5 px-2 text-right font-mono font-black text-sm md:text-base text-blue-900 tabular-nums">
                    {formatVND(quotation.totalAfterVat)}
                  </td>
                  <td className="border border-slate-300"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Amount In Words */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm mb-6">
            <span>Số tiền bằng chữ: </span>
            <strong className="italic text-slate-900">
              {numberToVietnameseWords(quotation.totalAfterVat)}
            </strong>
          </div>

          {/* Terms and Conditions */}
          {quotation.notesAndTerms && (
            <div className="mb-8 text-xs leading-relaxed text-slate-700 space-y-1 print-break-inside-avoid">
              <h3 className="font-bold text-slate-900 uppercase">
                ĐIỀU KHOẢN VÀ THỎA THUẬN THI CÔNG:
              </h3>
              <div className="whitespace-pre-line bg-slate-50/50 p-3 rounded border border-slate-200">
                {quotation.notesAndTerms}
              </div>
            </div>
          )}

          {/* 3 Signature Blocks */}
          <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs md:text-sm font-semibold text-slate-900 print-break-inside-avoid">
            <div>
              <p className="uppercase font-bold">ĐẠI DIỆN KHÁCH HÀNG</p>
              <p className="text-[11px] font-normal italic text-slate-500 mb-16">(Ký và ghi rõ họ tên)</p>
              <p className="font-bold text-slate-900">{quotation.customerName}</p>
            </div>

            <div>
              <p className="uppercase font-bold">KỸ SƯ LẬP DỰ TOÁN</p>
              <p className="text-[11px] font-normal italic text-slate-500 mb-16">(Ký và ghi rõ họ tên)</p>
              <p className="font-bold text-slate-900">{quotation.preparedBy}</p>
            </div>

            <div>
              <p className="uppercase font-bold">GIÁM ĐỐC CÔNG TY</p>
              <p className="text-[11px] font-normal italic text-slate-500 mb-16">(Ký tên và đóng dấu)</p>
              <p className="font-bold text-slate-900">{company.representative}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
