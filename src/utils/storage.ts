import { Material, Supplier, Quotation, CompanyProfile, ProvincialBenchmark } from '../types';
import { initialMaterials, initialSuppliers, initialQuotations, initialCompanyProfile, provincialBenchmarks } from '../data/initialData';
import { formatVND, numberToVietnameseWords } from './formatters';

const STORAGE_KEYS = {
  MATERIALS: 'daom_materials_v1',
  SUPPLIERS: 'daom_suppliers_v1',
  QUOTATIONS: 'daom_quotations_v1',
  COMPANY: 'daom_company_v1',
  BENCHMARKS: 'daom_benchmarks_v1',
  LANGUAGE: 'daom_language_v1'
};

export function loadMaterials(): Material[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    if (!data) return initialMaterials;
    const parsed: Material[] = JSON.parse(data);
    const existingCodes = new Set(parsed.map(m => m.code));
    const newItems = initialMaterials.filter(m => !existingCodes.has(m.code));
    if (newItems.length > 0) {
      const merged = [...parsed, ...newItems];
      saveMaterials(merged);
      return merged;
    }
    return parsed;
  } catch {
    return initialMaterials;
  }
}

export function saveMaterials(materials: Material[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  } catch (e) {
    console.error('Failed to save materials', e);
  }
}

export function loadSuppliers(): Supplier[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    return data ? JSON.parse(data) : initialSuppliers;
  } catch {
    return initialSuppliers;
  }
}

export function saveSuppliers(suppliers: Supplier[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  } catch (e) {
    console.error('Failed to save suppliers', e);
  }
}

export function loadQuotations(): Quotation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
    return data ? JSON.parse(data) : initialQuotations;
  } catch {
    return initialQuotations;
  }
}

export function saveQuotations(quotations: Quotation[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
  } catch (e) {
    console.error('Failed to save quotations', e);
  }
}

export function loadCompanyProfile(): CompanyProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMPANY);
    return data ? JSON.parse(data) : initialCompanyProfile;
  } catch {
    return initialCompanyProfile;
  }
}

export function saveCompanyProfile(profile: CompanyProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save company profile', e);
  }
}

export function loadBenchmarks(): ProvincialBenchmark[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BENCHMARKS);
    return data ? JSON.parse(data) : provincialBenchmarks;
  } catch {
    return provincialBenchmarks;
  }
}

export function resetAllToSample(): void {
  localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(initialMaterials));
  localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(initialSuppliers));
  localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(initialQuotations));
  localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(initialCompanyProfile));
  localStorage.setItem(STORAGE_KEYS.BENCHMARKS, JSON.stringify(provincialBenchmarks));
}

// Generate Excel-compatible (.xls) file with formatted styling and mathematical formulas
export function exportQuotationToExcel(quotation: Quotation, company: CompanyProfile): void {
  const rows = quotation.items.map((item, idx) => `
    <tr>
      <td style="text-align: center;">${idx + 1}</td>
      <td style="text-align: center; mso-number-format:'\\@';">${item.code}</td>
      <td>${item.name}</td>
      <td>${item.spec || '-'}</td>
      <td style="text-align: center;">${item.unit}</td>
      <td style="text-align: right; mso-number-format:'#,##0.00';">${item.quantity}</td>
      <td style="text-align: right; mso-number-format:'#,##0';">${item.costPrice}</td>
      <td style="text-align: right; mso-number-format:'#,##0';">${item.sellingPrice}</td>
      <td style="text-align: right; font-weight: bold; mso-number-format:'#,##0';">${item.amount}</td>
      <td style="text-align: right; color: #166534; mso-number-format:'#,##0';">${item.profit}</td>
      <td>${item.notes || ''}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; color: #1e293b; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #cbd5e1; padding: 6px 10px; }
        th { background-color: #0f172a; color: #ffffff; font-weight: bold; text-align: center; }
        .header-title { font-size: 16pt; font-weight: bold; color: #0f172a; text-align: center; }
        .company-name { font-size: 13pt; font-weight: bold; color: #1e3a8a; }
        .meta-label { font-weight: bold; width: 180px; }
        .summary-label { font-weight: bold; text-align: right; }
        .total-row { background-color: #f1f5f9; font-weight: bold; }
        .highlight { background-color: #e0e7ff; font-weight: bold; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="11" class="company-name">${company.name}</td>
        </tr>
        <tr>
          <td colspan="11">Địa chỉ: ${company.address}</td>
        </tr>
        <tr>
          <td colspan="11">Điện thoại: ${company.phone} | Email: ${company.email} | MST: ${company.taxCode}</td>
        </tr>
        <tr><td colspan="11" style="height: 15px; border: none;"></td></tr>
        <tr>
          <td colspan="11" class="header-title">BẢNG BÁO GIÁ THI CÔNG XÂY DỰNG & DỰ TOÁN CÔNG TRÌNH</td>
        </tr>
        <tr>
          <td colspan="11" style="text-align: center; font-style: italic; border: none;">Mã báo giá: ${quotation.code} | Ngày lập: ${quotation.quoteDate} | Hiệu lực đến: ${quotation.validUntil}</td>
        </tr>
        <tr><td colspan="11" style="height: 15px; border: none;"></td></tr>
        <tr>
          <td colspan="3" class="meta-label">Chủ đầu tư / Khách hàng:</td>
          <td colspan="4"><strong>${quotation.customerName}</strong></td>
          <td colspan="2" class="meta-label">Người lập báo giá:</td>
          <td colspan="2"><strong>${quotation.preparedBy}</strong></td>
        </tr>
        <tr>
          <td colspan="3" class="meta-label">Tên dự án / Công trình:</td>
          <td colspan="4"><strong>${quotation.projectName}</strong></td>
          <td colspan="2" class="meta-label">Số điện thoại:</td>
          <td colspan="2">${quotation.customerPhone || '-'}</td>
        </tr>
        <tr>
          <td colspan="3" class="meta-label">Địa điểm thi công:</td>
          <td colspan="4">${quotation.projectLocation} (${quotation.province})</td>
          <td colspan="2" class="meta-label">Email:</td>
          <td colspan="2">${quotation.customerEmail || '-'}</td>
        </tr>
        <tr><td colspan="11" style="height: 15px; border: none;"></td></tr>
        <thead>
          <tr>
            <th style="width: 40px;">STT</th>
            <th style="width: 120px;">Mã vật tư</th>
            <th style="width: 250px;">Tên vật tư / Quy cách</th>
            <th style="width: 180px;">Thông số kỹ thuật</th>
            <th style="width: 70px;">ĐVT</th>
            <th style="width: 90px;">Khối lượng</th>
            <th style="width: 110px;">Giá nhập (đ)</th>
            <th style="width: 110px;">Đơn giá bán (đ)</th>
            <th style="width: 130px;">Thành tiền (đ)</th>
            <th style="width: 120px;">Lợi nhuận (đ)</th>
            <th style="width: 160px;">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr class="total-row">
            <td colspan="8" class="summary-label">1. TỔNG GIÁ TRỊ VẬT TƯ:</td>
            <td style="text-align: right; mso-number-format:'#,##0';">${quotation.totalMaterialAmount}</td>
            <td style="text-align: right; color: #166534; mso-number-format:'#,##0';">${quotation.totalMaterialAmount - quotation.totalMaterialCost}</td>
            <td></td>
          </tr>
          <tr>
            <td colspan="8" class="summary-label">2. Chi phí nhân công thi công:</td>
            <td style="text-align: right; mso-number-format:'#,##0';">${quotation.laborCost}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td colspan="8" class="summary-label">3. Chi phí máy móc & ca bơm/đào:</td>
            <td style="text-align: right; mso-number-format:'#,##0';">${quotation.machineryCost}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td colspan="8" class="summary-label">4. Chi phí vận chuyển & bốc xếp:</td>
            <td style="text-align: right; mso-number-format:'#,##0';">${quotation.transportCost}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td colspan="8" class="summary-label">5. Chi phí dự phòng & phát sinh (${quotation.contingencyPercent}%):</td>
            <td style="text-align: right; mso-number-format:'#,##0';">${quotation.contingencyCost}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td colspan="8" class="summary-label">6. Chiết khấu khách hàng (${quotation.discountPercent}%):</td>
            <td style="text-align: right; color: #dc2626; mso-number-format:'#,##0';">-${quotation.discountAmount}</td>
            <td colspan="2"></td>
          </tr>
          <tr class="total-row">
            <td colspan="8" class="summary-label">TỔNG GIÁ TRỊ TRƯỚC THUẾ:</td>
            <td style="text-align: right; mso-number-format:'#,##0';">${quotation.subtotalBeforeVat}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td colspan="8" class="summary-label">Thuế GTGT (VAT ${quotation.vatPercent}%):</td>
            <td style="text-align: right; mso-number-format:'#,##0';">${quotation.vatAmount}</td>
            <td colspan="2"></td>
          </tr>
          <tr class="highlight">
            <td colspan="8" style="font-size: 12pt; text-align: right; color: #0f172a;">TỔNG GIÁ TRỊ BÁO GIÁ THANH TOÁN (SAU THUẾ):</td>
            <td style="font-size: 12pt; text-align: right; color: #0f172a; mso-number-format:'#,##0';">${quotation.totalAfterVat}</td>
            <td colspan="2" style="text-align: right; font-weight: bold; color: #15803d;">Lãi ròng: ${formatVND(quotation.netProfit)} (${quotation.profitMarginPercent}%)</td>
          </tr>
          <tr>
            <td colspan="11" style="font-style: italic; padding: 10px;">
              Số tiền bằng chữ: <strong>${numberToVietnameseWords(quotation.totalAfterVat)}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <br/>
      <div>
        <p><strong>ĐIỀU KHOẢN VÀ THỎA THUẬN THI CÔNG:</strong></p>
        <p>${quotation.notesAndTerms.replace(/\n/g, '<br/>')}</p>
      </div>
      <br/><br/>
      <table style="border: none;">
        <tr style="border: none;">
          <td colspan="3" style="text-align: center; border: none; font-weight: bold;">
            ĐẠI DIỆN KHÁCH HÀNG<br/><br/><br/><br/>
            (Ký và ghi rõ họ tên)
          </td>
          <td colspan="4" style="text-align: center; border: none; font-weight: bold;">
            KỸ SƯ LẬP DỰ TOÁN<br/><br/><br/><br/>
            ${quotation.preparedBy}
          </td>
          <td colspan="4" style="text-align: center; border: none; font-weight: bold;">
            GIÁM ĐỐC CÔNG TY<br/><br/><br/><br/>
            ${company.representative}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + htmlContent], {
    type: 'application/vnd.ms-excel;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Bao_Gia_${quotation.code}_${quotation.customerName.replace(/\s+/g, '_')}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
