export type Language = 'vi' | 'ko' | 'en';

export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'in_progress' | 'completed' | 'rejected';

export type MaterialGroup = 
  | 'Sắt thép & Kim khí'
  | 'Xi măng & Vữa'
  | 'Cát xây dựng'
  | 'Đá xây dựng'
  | 'Gạch xây & ốp lát'
  | 'Bê tông tươi & Cọc móng'
  | 'Sơn, Bột bả & Chống thấm'
  | 'Thiết bị Điện & Chiếu sáng'
  | 'Cấp thoát nước & Phụ kiện'
  | 'Gỗ, Cửa & Thạch cao'
  | 'Thiết bị vệ sinh & Nhà bếp'
  | 'Vật tư phụ & Bảo hộ'
  | 'Khác';

export interface Material {
  id: string;
  code: string;
  name: string;
  group: MaterialGroup | string;
  spec: string;
  unit: string;
  supplierId: string;
  supplierName: string;
  costPrice: number; // Giá nhập
  sellingPrice: number; // Đơn giá bán
  vatRate: number; // 0, 8, 10 (%)
  updatedAt: string;
  notes: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  suppliedCategories: string[];
  lastPurchasePriceInfo?: string;
  rating: number; // 1 to 5
  notes: string;
}

export interface QuotationItem {
  id: string;
  stt: number;
  materialId?: string;
  code: string;
  name: string;
  spec: string;
  unit: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  amount: number; // quantity * sellingPrice
  profit: number; // amount - (quantity * costPrice)
  notes?: string;
}

export interface Quotation {
  id: string;
  code: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  projectName: string;
  projectLocation: string;
  province: string;
  quoteDate: string;
  validUntil: string;
  preparedBy: string;
  status: QuotationStatus;
  items: QuotationItem[];
  
  // Cost breakdown & calculations
  totalMaterialAmount: number; // Tổng giá trị vật tư bán
  totalMaterialCost: number;   // Tổng giá trị vật tư nhập
  laborCost: number;           // Chi phí nhân công
  transportCost: number;       // Chi phí vận chuyển
  machineryCost: number;       // Chi phí máy móc
  contingencyPercent: number;  // Tỷ lệ phát sinh %
  contingencyCost: number;     // Chi phí phát sinh (VND)
  discountPercent: number;     // Chiết khấu %
  discountAmount: number;      // Chiết khấu (VND)
  markupPercent: number;       // Tỷ lệ lợi nhuận định mức %
  
  subtotalBeforeVat: number;   // Tổng trước thuế
  vatPercent: number;          // VAT % (thường 8% hoặc 10%)
  vatAmount: number;           // Tiền thuế VAT
  totalAfterVat: number;       // Tổng giá trị báo giá sau thuế
  
  totalEstimatedCost: number;  // Tổng chi phí (vật tư nhập + nhân công + máy móc + vận chuyển + phát sinh)
  netProfit: number;           // Lợi nhuận = (Tổng trước thuế - chiết khấu) - Tổng chi phí
  profitMarginPercent: number; // Tỷ suất lợi nhuận (%)
  
  notesAndTerms: string;
  createdAt: string;
  updatedAt: string;
}

export interface BenchmarkMaterial {
  id: string;
  name: string;
  group: string;
  spec: string;
  unit: string;
  marketPrice: number;
  previousPrice: number;
  trend: 'up' | 'down' | 'stable';
  percentChange: number;
  source: string;
}

export interface BenchmarkLaborWage {
  id: string;
  role: string;
  unit: string; // ngày công / m2
  averageWage: number;
  rangeMin: number;
  rangeMax: number;
  trend: 'up' | 'down' | 'stable';
  notes: string;
}

export interface BenchmarkMachinery {
  id: string;
  machine: string;
  unit: string; // ca / giờ
  averageRate: number;
  notes: string;
}

export interface ProvincialBenchmark {
  province: string;
  region: 'Miền Bắc' | 'Miền Trung' | 'Miền Nam';
  lastUpdated: string;
  materials: BenchmarkMaterial[];
  laborWages: BenchmarkLaborWage[];
  machineryRates: BenchmarkMachinery[];
}

export interface CompanyProfile {
  name: string;
  brandName: string;
  taxCode: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  bankAccount: string;
  bankName: string;
  representative: string;
  role: string;
  defaultValidityDays: number;
  defaultVatRate: number;
  defaultTerms: string;
}
