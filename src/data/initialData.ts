import { Material, Supplier, Quotation, ProvincialBenchmark, CompanyProfile } from '../types';
import { masterConstructionMaterials } from './constructionMaterialsLibrary';

export const initialCompanyProfile: CompanyProfile = {
  name: 'CÔNG TY CỔ PHẦN ĐẦU TƯ & XÂY DỰNG DAOM VIỆT NAM',
  brandName: 'DAOM CONSTRUCTION',
  taxCode: '0318992688',
  phone: '0908 123 456 - 028 3888 9999',
  email: 'contact@daom-construction.vn',
  address: 'Tầng 12, Tòa nhà Landmark, 561A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh',
  website: 'https://daom-construction.vn',
  bankAccount: '19036888999999',
  bankName: 'Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank) - Chi nhánh TP.HCM',
  representative: 'Đoàn Thị Trúc Đào',
  role: 'Tổng Giám Đốc',
  defaultValidityDays: 20,
  defaultVatRate: 10,
  defaultTerms: `1. Đơn giá trên đã bao gồm chi phí vận chuyển đến chân công trình trong phạm vi bán kính 15km.
2. Tiến độ thanh toán:
   - Đợt 1: Tạm ứng 30% ngay sau khi ký hợp đồng thi công.
   - Đợt 2: Thanh toán 40% sau khi hoàn thành phần thô công trình.
   - Đợt 3: Thanh toán 25% sau khi hoàn thiện bàn giao kỹ thuật.
   - Đợt 4: Thanh toán 5% còn lại sau thời gian bảo hành công trình (12 tháng).
3. Đơn giá có hiệu lực trong vòng 20 ngày kể từ ngày lập báo giá.
4. Trường hợp khối lượng phát sinh ngoài phạm vi hợp đồng, hai bên sẽ thỏa thuận ký phụ lục bằng văn bản trước khi thi công.`
};

export const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    code: 'NCC-01',
    name: 'Công ty Cổ phần Thép Hòa Phát',
    contactPerson: 'Nguyễn Văn Minh (Trưởng phòng KD)',
    phone: '0912 345 678',
    email: 'thep.hoaphat@sales.vn',
    address: 'KCN Phố Nối A, Văn Lâm, Hưng Yên (Kho phân phối toàn quốc)',
    suppliedCategories: ['Sắt thép xây dựng'],
    lastPurchasePriceInfo: 'Thép phi 10: 14.850 đ/kg (28/09/2026)',
    rating: 5,
    notes: 'Nhà cung cấp thép hàng đầu, giao hàng đúng cam kết, chứng chỉ CO/CQ đầy đủ'
  },
  {
    id: 'sup-2',
    code: 'NCC-02',
    name: 'Tổng Công ty Xi măng Hà Tiên 1',
    contactPerson: 'Trần Thị Thu Thảo',
    phone: '0903 888 222',
    email: 'hatien1@vicem.vn',
    address: 'Trạm nghiền Thủ Đức, TP. Thủ Đức, TP. Hồ Chí Minh',
    suppliedCategories: ['Xi măng & Vữa'],
    lastPurchasePriceInfo: 'Hà Tiên PCB40: 88.000 đ/bao (27/09/2026)',
    rating: 5,
    notes: 'Xi măng chất lượng cao chuyên dùng cho bê tông móng và kết cấu chịu lực'
  },
  {
    id: 'sup-3',
    code: 'NCC-03',
    name: 'Công ty TNHH Cát Đá Xây Dựng Miền Đông',
    contactPerson: 'Lê Hoàng Long',
    phone: '0937 555 777',
    email: 'vlxd.miendong@gmail.com',
    address: 'Mỏ đá Hóa An, TP. Biên Hòa, Tỉnh Đồng Nai',
    suppliedCategories: ['Cát xây dựng', 'Đá xây dựng'],
    lastPurchasePriceInfo: 'Đá 1x2 xanh: 340.000 đ/m3 (29/09/2026)',
    rating: 4,
    notes: 'Có đội xe ben chuyên chở 5-15 tấn, giao hàng 24/7'
  },
  {
    id: 'sup-4',
    code: 'NCC-04',
    name: 'Tổng Kho Thiết Bị Điện Nước Cadivi & Tiền Phong',
    contactPerson: 'Phạm Đức Thịnh',
    phone: '0984 666 999',
    email: 'thietbidiennuoc.sg@vnn.vn',
    address: '320 Tô Hiến Thành, Phường 14, Quận 10, TP.HCM',
    suppliedCategories: ['Điện & Nước'],
    lastPurchasePriceInfo: 'Dây 2x2.5mm2 Cadivi: 1.150.000 đ/cuộn 100m',
    rating: 5,
    notes: 'Chiết khấu cao cho nhà thầu (18-22% theo bảng giá catalogue niêm yết)'
  },
  {
    id: 'sup-5',
    code: 'NCC-05',
    name: 'Nhà Máy Gạch Tuynel & Bê Tông Nhẹ Khang Điền',
    contactPerson: 'Vũ Đức Trọng',
    phone: '0945 111 333',
    email: 'gachtuynel.kd@khangdien.vn',
    address: 'Cụm Công nghiệp Tân Uyên, Tỉnh Bình Dương',
    suppliedCategories: ['Gạch xây & ốp lát'],
    lastPurchasePriceInfo: 'Gạch 4 lỗ Tuynel: 1.150 đ/viên',
    rating: 4,
    notes: 'Gạch chuẩn quy cách nung nhiệt độ cao, tỷ lệ vỡ vụn dưới 1%'
  },
  {
    id: 'sup-6',
    code: 'NCC-06',
    name: 'Công ty TNHH Bê Tông Tươi Mekong & Rạch Chiếc',
    contactPerson: 'Hoàng Anh Tuấn',
    phone: '0918 777 222',
    email: 'betong.mekong@gmail.com',
    address: 'Xa lộ Hà Nội, Phường Hiệp Phú, TP. Thủ Đức, TP.HCM',
    suppliedCategories: ['Bê tông tươi'],
    lastPurchasePriceInfo: 'Bê tông M250 R28: 1.250.000 đ/m3',
    rating: 5,
    notes: 'Có xe bơm cần 37m - 52m, cấp bê tông liên tục bảo đảm tiêu chuẩn kỹ thuật'
  }
];

export const initialMaterials: Material[] = masterConstructionMaterials;

export const provincialBenchmarks: ProvincialBenchmark[] = [
  {
    province: 'TP. Hồ Chí Minh',
    region: 'Miền Nam',
    lastUpdated: '2026-09-30',
    materials: [
      { id: 'bm-1', name: 'Thép cuộn D6/D8 Hòa Phát CB240T', group: 'Sắt thép', spec: 'Cuộn tiêu chuẩn', unit: 'kg', marketPrice: 15400, previousPrice: 15100, trend: 'up', percentChange: 1.98, source: 'Sở Xây Dựng TP.HCM' },
      { id: 'bm-2', name: 'Thép vằn D10 Hòa Phát CB300V', group: 'Sắt thép', spec: 'Cây 11.7m', unit: 'cây', marketPrice: 118000, previousPrice: 115000, trend: 'up', percentChange: 2.6, source: 'Sở Xây Dựng TP.HCM' },
      { id: 'bm-3', name: 'Thép vằn D16 Hòa Phát CB400V', group: 'Sắt thép', spec: 'Cây 11.7m', unit: 'cây', marketPrice: 295000, previousPrice: 290000, trend: 'up', percentChange: 1.7, source: 'Sở Xây Dựng TP.HCM' },
      { id: 'bm-4', name: 'Xi măng Hà Tiên PCB40', group: 'Xi măng', spec: 'Bao 50kg', unit: 'bao', marketPrice: 94000, previousPrice: 94000, trend: 'stable', percentChange: 0.0, source: 'Vicem Hà Tiên' },
      { id: 'bm-5', name: 'Cát vàng hạt lớn bê tông', group: 'Cát', spec: 'Sàng sạch', unit: 'm3', marketPrice: 420000, previousPrice: 395000, trend: 'up', percentChange: 6.3, source: 'Khảo sát cảng quận 9' },
      { id: 'bm-6', name: 'Đá 1x2 xanh Hóa An', group: 'Đá', spec: 'Hạt 10x28mm', unit: 'm3', marketPrice: 375000, previousPrice: 370000, trend: 'up', percentChange: 1.35, source: 'Mỏ Hóa An' },
      { id: 'bm-7', name: 'Gạch 4 lỗ Tuynel', group: 'Gạch', spec: '8x8x18cm', unit: 'viên', marketPrice: 1300, previousPrice: 1350, trend: 'down', percentChange: -3.7, source: 'Nhà máy Tuynel' },
      { id: 'bm-8', name: 'Bê tông thương phẩm M250 R28', group: 'Bê tông tươi', spec: 'Độ sụt 12±2', unit: 'm3', marketPrice: 1380000, previousPrice: 1360000, trend: 'up', percentChange: 1.47, source: 'Trạm trộn Nam Sài Gòn' },
      { id: 'bm-9', name: 'Thép vằn D12 Pomina CB300V', group: 'Sắt thép', spec: 'Cây 11.7m', unit: 'cây', marketPrice: 172000, previousPrice: 168000, trend: 'up', percentChange: 2.38, source: 'Đại lý Thép Miền Nam' },
      { id: 'bm-10', name: 'Sơn nước nội thất Dulux EasyClean', group: 'Sơn', spec: 'Thùng 18L lau chùi', unit: 'thùng', marketPrice: 1750000, previousPrice: 1720000, trend: 'up', percentChange: 1.74, source: 'Đại lý Sơn Q10' },
      { id: 'bm-11', name: 'Ống PVC Tiền Phong D90 Class 2', group: 'Điện & Nước', spec: 'Cây 4m dày 3.0mm', unit: 'cây', marketPrice: 155000, previousPrice: 155000, trend: 'stable', percentChange: 0.0, source: 'Tổng kho Điện Nước' },
      { id: 'bm-12', name: 'Gạch lát nền Viglacera 60x60cm', group: 'Gạch', spec: 'Hộp 4 viên (1.44m2)', unit: 'm2', marketPrice: 155000, previousPrice: 155000, trend: 'stable', percentChange: 0.0, source: 'Showroom Tô Hiến Thành' }
    ],
    laborWages: [
      { id: 'lw-1', role: 'Thợ chính xây trát, ốp lát (bậc 3/7 - 4/7)', unit: 'ngày công (8h)', averageWage: 480000, rangeMin: 450000, rangeMax: 550000, trend: 'up', notes: 'Thợ có tay nghề cao, đã qua đào tạo thực tế' },
      { id: 'lw-2', role: 'Thợ phụ / Lao động phổ thông hiện trường', unit: 'ngày công (8h)', averageWage: 330000, rangeMin: 300000, rangeMax: 360000, trend: 'stable', notes: 'Trộn hồ, vận chuyển vật tư, phụ dọn dẹp' },
      { id: 'lw-3', role: 'Thợ cốp pha & sắt thép kết cấu', unit: 'ngày công (8h)', averageWage: 520000, rangeMin: 480000, rangeMax: 580000, trend: 'up', notes: 'Gia công cốt thép dầm sàn móng cột' },
      { id: 'lw-4', role: 'Thợ điện nước & cơ điện (M&E)', unit: 'ngày công (8h)', averageWage: 500000, rangeMin: 460000, rangeMax: 550000, trend: 'stable', notes: 'Lắp đặt hệ thống âm tường và thiết bị' },
      { id: 'lw-5', role: 'Kỹ sư giám sát công trường (Site Engineer)', unit: 'ngày công (8h)', averageWage: 750000, rangeMin: 650000, rangeMax: 950000, trend: 'stable', notes: 'Giám sát kỹ thuật, nghiệm thu vật tư' },
      { id: 'lw-6', role: 'Đơn giá khoán nhân công trọn gói nhà phố', unit: 'đ/m² sàn', averageWage: 1450000, rangeMin: 1350000, rangeMax: 1650000, trend: 'up', notes: 'Gồm nhân công xây thô + nhân công hoàn thiện' }
    ],
    machineryRates: [
      { id: 'mc-1', machine: 'Máy đào bánh xích 0.5m³ (kèm tài xế)', unit: 'ca (8h)', averageRate: 3500000, notes: 'Đã gồm dầu và tài xế kinh nghiệm' },
      { id: 'mc-2', machine: 'Ca bơm bê tông tĩnh / cần 37m', unit: 'ca bơm', averageRate: 2800000, notes: 'Bơm sàn hoặc móng khối lượng < 80m3' },
      { id: 'mc-3', machine: 'Máy đầm cóc / đầm bàn nén đất nền', unit: 'ngày thuê', averageRate: 250000, notes: 'Tự vận hành, chưa gồm xăng' }
    ]
  },
  {
    province: 'Hà Nội',
    region: 'Miền Bắc',
    lastUpdated: '2026-09-30',
    materials: [
      { id: 'bm-hn-1', name: 'Thép cuộn D6/D8 Hòa Phát CB240T', group: 'Sắt thép', spec: 'Cuộn tiêu chuẩn', unit: 'kg', marketPrice: 15150, previousPrice: 14900, trend: 'up', percentChange: 1.68, source: 'Sở Xây Dựng Hà Nội' },
      { id: 'bm-hn-2', name: 'Thép vằn D10 Hòa Phát CB300V', group: 'Sắt thép', spec: 'Cây 11.7m', unit: 'cây', marketPrice: 114000, previousPrice: 112000, trend: 'up', percentChange: 1.78, source: 'Kho Thép Đông Anh' },
      { id: 'bm-hn-3', name: 'Xi măng Nghi Sơn / Tam Điệp PCB40', group: 'Xi măng', spec: 'Bao 50kg', unit: 'bao', marketPrice: 91000, previousPrice: 91000, trend: 'stable', percentChange: 0.0, source: 'Công ty Xi Măng' },
      { id: 'bm-hn-4', name: 'Cát vàng Sông Lô hạt lớn', group: 'Cát', spec: 'Hạt to sạch', unit: 'm3', marketPrice: 410000, previousPrice: 380000, trend: 'up', percentChange: 7.9, source: 'Bến Cát Sông Hồng' },
      { id: 'bm-hn-5', name: 'Đá 1x2 xanh Hà Nam', group: 'Đá', spec: 'Hạt 10x28mm', unit: 'm3', marketPrice: 320000, previousPrice: 320000, trend: 'stable', percentChange: 0.0, source: 'Mỏ đá Kiện Khê' },
      { id: 'bm-hn-6', name: 'Gạch đỏ đặc Tuynel Thạch Thất', group: 'Gạch', spec: '40x80x180mm', unit: 'viên', marketPrice: 1400, previousPrice: 1350, trend: 'up', percentChange: 3.7, source: 'Nhà máy Thạch Thất' },
      { id: 'bm-hn-7', name: 'Bê tông tươi M250 R28', group: 'Bê tông tươi', spec: 'Độ sụt 12±2', unit: 'm3', marketPrice: 1320000, previousPrice: 1310000, trend: 'up', percentChange: 0.76, source: 'Trạm Việt Đức / Sông Đà' }
    ],
    laborWages: [
      { id: 'lw-hn-1', role: 'Thợ chính xây trát (bậc 3/7 - 4/7)', unit: 'ngày công (8h)', averageWage: 460000, rangeMin: 420000, rangeMax: 520000, trend: 'up', notes: 'Thợ vùng Phú Thọ, Vĩnh Phúc, Nam Định' },
      { id: 'lw-hn-2', role: 'Thợ phụ / Lao động công nhật', unit: 'ngày công (8h)', averageWage: 320000, rangeMin: 290000, rangeMax: 350000, trend: 'stable', notes: 'Hồ vữa, khuôn ván, dọn dẹp' },
      { id: 'lw-hn-3', role: 'Thợ cốt thép & cốp pha định hình', unit: 'ngày công (8h)', averageWage: 500000, rangeMin: 460000, rangeMax: 560000, trend: 'up', notes: 'Đan thép móng, cột dầm sàn' },
      { id: 'lw-hn-4', role: 'Thợ cơ điện ME & ống ngầm', unit: 'ngày công (8h)', averageWage: 480000, rangeMin: 440000, rangeMax: 530000, trend: 'stable', notes: 'Đi ống luồn dây điện, cấp thoát nước' },
      { id: 'lw-hn-5', role: 'Kỹ sư chỉ huy trưởng hiện trường', unit: 'ngày công (8h)', averageWage: 720000, rangeMin: 620000, rangeMax: 900000, trend: 'stable', notes: 'Kiểm soát hồ sơ thiết kế và tiến độ' },
      { id: 'lw-hn-6', role: 'Đơn giá khoán nhân công xây nhà phố Hà Nội', unit: 'đ/m² sàn', averageWage: 1400000, rangeMin: 1300000, rangeMax: 1550000, trend: 'up', notes: 'Bao gồm trọn gói thợ xây thô và hoàn thiện' }
    ],
    machineryRates: [
      { id: 'mc-hn-1', machine: 'Máy xúc đào 0.5m³ bánh xích', unit: 'ca (8h)', averageRate: 3400000, notes: 'Bao gồm nhiên liệu' },
      { id: 'mc-hn-2', machine: 'Xe ép cọc bê tông Neo / Tải', unit: 'm dài cọc', averageRate: 50000, notes: 'Giá công ép cọc 200x200 / 250x250' }
    ]
  },
  {
    province: 'Đà Nẵng',
    region: 'Miền Trung',
    lastUpdated: '2026-09-30',
    materials: [
      { id: 'bm-dn-1', name: 'Thép cuộn D6/D8 Hòa Phát CB240T', group: 'Sắt thép', spec: 'Cuộn tiêu chuẩn', unit: 'kg', marketPrice: 15250, previousPrice: 15000, trend: 'up', percentChange: 1.67, source: 'Sở Xây Dựng Đà Nẵng' },
      { id: 'bm-dn-2', name: 'Thép vằn D12 Hòa Phát CB300V', group: 'Sắt thép', spec: 'Cây 11.7m', unit: 'cây', marketPrice: 168000, previousPrice: 165000, trend: 'up', percentChange: 1.82, source: 'Kho Thép Liên Chiểu' },
      { id: 'bm-dn-3', name: 'Xi măng Kim Đỉnh / Hải Vân PCB40', group: 'Xi măng', spec: 'Bao 50kg', unit: 'bao', marketPrice: 92000, previousPrice: 92000, trend: 'stable', percentChange: 0.0, source: 'Nhà phân phối miền Trung' },
      { id: 'bm-dn-4', name: 'Cát vàng Đại Lộc loại 1', group: 'Cát', spec: 'Sạch, hạt to', unit: 'm3', marketPrice: 390000, previousPrice: 370000, trend: 'up', percentChange: 5.4, source: 'Cảng sông Cẩm Lệ' },
      { id: 'bm-dn-5', name: 'Đá 1x2 Hòa Nhơn', group: 'Đá', spec: '10x25mm', unit: 'm3', marketPrice: 310000, previousPrice: 310000, trend: 'stable', percentChange: 0.0, source: 'Mỏ đá Hòa Vang' },
      { id: 'bm-dn-6', name: 'Gạch 6 lỗ Tuynel Quảng Nam', group: 'Gạch', spec: '10x15x20cm', unit: 'viên', marketPrice: 2400, previousPrice: 2450, trend: 'down', percentChange: -2.0, source: 'Đại lý vật liệu' },
      { id: 'bm-dn-7', name: 'Bê tông thương phẩm M250 R28', group: 'Bê tông tươi', spec: 'Độ sụt 12±2', unit: 'm3', marketPrice: 1340000, previousPrice: 1330000, trend: 'up', percentChange: 0.75, source: 'Bê tông Dinco / Phước Yên' }
    ],
    laborWages: [
      { id: 'lw-dn-1', role: 'Thợ chính xây trát', unit: 'ngày công (8h)', averageWage: 440000, rangeMin: 400000, rangeMax: 490000, trend: 'stable', notes: 'Thợ tay nghề địa phương' },
      { id: 'lw-dn-2', role: 'Thợ phụ xây dựng', unit: 'ngày công (8h)', averageWage: 300000, rangeMin: 270000, rangeMax: 330000, trend: 'stable', notes: 'Lao động phổ thông' },
      { id: 'lw-dn-3', role: 'Thợ điện nước & ốp lát gạch', unit: 'ngày công (8h)', averageWage: 470000, rangeMin: 430000, rangeMax: 520000, trend: 'up', notes: 'Lắp đặt hoàn thiện' },
      { id: 'lw-dn-4', role: 'Đơn giá khoán nhân công xây nhà phố', unit: 'đ/m² sàn', averageWage: 1350000, rangeMin: 1250000, rangeMax: 1500000, trend: 'stable', notes: 'Khoán trọn gói theo m2 xây dựng' }
    ],
    machineryRates: [
      { id: 'mc-dn-1', machine: 'Máy xúc đào 0.5m³', unit: 'ca (8h)', averageRate: 3200000, notes: 'Có tài xế' }
    ]
  },
  {
    province: 'Bình Dương',
    region: 'Miền Nam',
    lastUpdated: '2026-09-30',
    materials: [
      { id: 'bm-bd-1', name: 'Thép vằn D10 Hòa Phát CB300V', group: 'Sắt thép', spec: 'Cây 11.7m', unit: 'cây', marketPrice: 117000, previousPrice: 115000, trend: 'up', percentChange: 1.74, source: 'Sở XD Bình Dương' },
      { id: 'bm-bd-2', name: 'Xi măng Hà Tiên PCB40', group: 'Xi măng', spec: 'Bao 50kg', unit: 'bao', marketPrice: 93000, previousPrice: 93000, trend: 'stable', percentChange: 0.0, source: 'Đại lý cấp 1' },
      { id: 'bm-bd-3', name: 'Cát vàng đổ bê tông', group: 'Cát', spec: 'Mô đun lớn', unit: 'm3', marketPrice: 400000, previousPrice: 380000, trend: 'up', percentChange: 5.26, source: 'Bến cát Dầu Tiếng' },
      { id: 'bm-bd-4', name: 'Đá 1x2 xanh mỏ Tân Mỹ', group: 'Đá', spec: '10x28mm', unit: 'm3', marketPrice: 330000, previousPrice: 330000, trend: 'stable', percentChange: 0.0, source: 'Mỏ đá Bắc Tân Uyên' },
      { id: 'bm-bd-5', name: 'Gạch Tuynel 4 lỗ Tân Uyên', group: 'Gạch', spec: '8x8x18cm', unit: 'viên', marketPrice: 1150, previousPrice: 1180, trend: 'down', percentChange: -2.54, source: 'Lò gạch Tân Uyên' },
      { id: 'bm-bd-6', name: 'Bê tông tươi M250 R28', group: 'Bê tông tươi', spec: 'Độ sụt 12±2', unit: 'm3', marketPrice: 1350000, previousPrice: 1340000, trend: 'up', percentChange: 0.75, source: 'Trạm trộn VSIP' }
    ],
    laborWages: [
      { id: 'lw-bd-1', role: 'Thợ chính xây tô', unit: 'ngày công (8h)', averageWage: 460000, rangeMin: 420000, rangeMax: 500000, trend: 'stable', notes: 'Gần khu công nghiệp' },
      { id: 'lw-bd-2', role: 'Thợ phụ công nhật', unit: 'ngày công (8h)', averageWage: 320000, rangeMin: 290000, rangeMax: 350000, trend: 'stable', notes: 'Lao động địa phương' },
      { id: 'lw-bd-3', role: 'Đơn giá khoán xây nhà phố / nhà xưởng', unit: 'đ/m² sàn', averageWage: 1380000, rangeMin: 1280000, rangeMax: 1550000, trend: 'stable', notes: 'Nhà dân dụng và văn phòng' }
    ],
    machineryRates: [
      { id: 'mc-bd-1', machine: 'Máy đào 0.5m³ bánh xích', unit: 'ca (8h)', averageRate: 3400000, notes: 'Có máy và tài xế' }
    ]
  },
  {
    province: 'Cần Thơ',
    region: 'Miền Nam',
    lastUpdated: '2026-09-30',
    materials: [
      { id: 'bm-ct-1', name: 'Thép cuộn D6/D8 CB240T', group: 'Sắt thép', spec: 'Cuộn tiêu chuẩn', unit: 'kg', marketPrice: 15600, previousPrice: 15300, trend: 'up', percentChange: 1.96, source: 'Sở XD Cần Thơ' },
      { id: 'bm-ct-2', name: 'Xi măng Tây Đô / Hà Tiên PCB40', group: 'Xi măng', spec: 'Bao 50kg', unit: 'bao', marketPrice: 95000, previousPrice: 95000, trend: 'stable', percentChange: 0.0, source: 'Xi Măng Tây Đô' },
      { id: 'bm-ct-3', name: 'Cát vàng miền Tây hạt lớn', group: 'Cát', spec: 'Đã sàng', unit: 'm3', marketPrice: 370000, previousPrice: 350000, trend: 'up', percentChange: 5.7, source: 'Bến cát sông Hậu' },
      { id: 'bm-ct-4', name: 'Đá 1x2 xanh vận chuyển từ miền Đông', group: 'Đá', spec: '10x28mm', unit: 'm3', marketPrice: 395000, previousPrice: 390000, trend: 'up', percentChange: 1.28, source: 'Cảng Cần Thơ' },
      { id: 'bm-ct-5', name: 'Gạch Tuynel 4 lỗ miền Tây', group: 'Gạch', spec: '8x8x18cm', unit: 'viên', marketPrice: 1250, previousPrice: 1250, trend: 'stable', percentChange: 0.0, source: 'Lò gạch Vĩnh Long' }
    ],
    laborWages: [
      { id: 'lw-ct-1', role: 'Thợ chính xây trát', unit: 'ngày công (8h)', averageWage: 430000, rangeMin: 390000, rangeMax: 470000, trend: 'stable', notes: 'Thợ lành nghề miền Tây' },
      { id: 'lw-ct-2', role: 'Thợ phụ công nhật', unit: 'ngày công (8h)', averageWage: 290000, rangeMin: 260000, rangeMax: 320000, trend: 'stable', notes: 'Lao động địa phương' },
      { id: 'lw-ct-3', role: 'Đơn giá khoán nhân công xây nhà', unit: 'đ/m² sàn', averageWage: 1300000, rangeMin: 1200000, rangeMax: 1450000, trend: 'stable', notes: 'Trọn gói hoàn thiện cơ bản' }
    ],
    machineryRates: [
      { id: 'mc-ct-1', machine: 'Máy xúc đào đất 0.5m³', unit: 'ca (8h)', averageRate: 3300000, notes: 'Có tài xế' }
    ]
  },
  {
    province: 'Hải Phòng',
    region: 'Miền Bắc',
    lastUpdated: '2026-09-30',
    materials: [
      { id: 'bm-hp-1', name: 'Thép vằn D10 Hòa Phát CB300V', group: 'Sắt thép', spec: 'Cây 11.7m', unit: 'cây', marketPrice: 114500, previousPrice: 112500, trend: 'up', percentChange: 1.77, source: 'Sở XD Hải Phòng' },
      { id: 'bm-hp-2', name: 'Xi măng Chinfon PCB40', group: 'Xi măng', spec: 'Bao 50kg', unit: 'bao', marketPrice: 90000, previousPrice: 90000, trend: 'stable', percentChange: 0.0, source: 'Xi Măng Chinfon Hải Phòng' },
      { id: 'bm-hp-3', name: 'Cát vàng hạt lớn bê tông', group: 'Cát', spec: 'Mô đun lớn', unit: 'm3', marketPrice: 410000, previousPrice: 385000, trend: 'up', percentChange: 6.49, source: 'Cảng bến vật liệu' },
      { id: 'bm-hp-4', name: 'Đá 1x2 Thủy Nguyên', group: 'Đá', spec: '10x28mm', unit: 'm3', marketPrice: 315000, previousPrice: 315000, trend: 'stable', percentChange: 0.0, source: 'Mỏ đá Thủy Nguyên' }
    ],
    laborWages: [
      { id: 'lw-hp-1', role: 'Thợ chính xây trát', unit: 'ngày công (8h)', averageWage: 460000, rangeMin: 420000, rangeMax: 510000, trend: 'up', notes: 'Thợ Hải Phòng và lân cận' },
      { id: 'lw-hp-2', role: 'Thợ phụ công nhật', unit: 'ngày công (8h)', averageWage: 310000, rangeMin: 280000, rangeMax: 340000, trend: 'stable', notes: 'Lao động phổ thông' }
    ],
    machineryRates: [
      { id: 'mc-hp-1', machine: 'Máy xúc đào 0.5m³', unit: 'ca (8h)', averageRate: 3400000, notes: 'Có tài xế' }
    ]
  },
  {
    province: 'Đồng Nai',
    region: 'Miền Nam',
    lastUpdated: '2026-09-30',
    materials: [
      { id: 'bm-dna-1', name: 'Thép vằn D10 Hòa Phát CB300V', group: 'Sắt thép', spec: 'Cây 11.7m', unit: 'cây', marketPrice: 116500, previousPrice: 114500, trend: 'up', percentChange: 1.74, source: 'Sở XD Đồng Nai' },
      { id: 'bm-dna-2', name: 'Đá 1x2 xanh Hóa An / Thạnh Phú', group: 'Đá', spec: '10x28mm', unit: 'm3', marketPrice: 325000, previousPrice: 325000, trend: 'stable', percentChange: 0.0, source: 'Mỏ đá tại chỗ Đồng Nai' },
      { id: 'bm-dna-3', name: 'Cát vàng bê tông hạt to', group: 'Cát', spec: 'Sàng sạch', unit: 'm3', marketPrice: 385000, previousPrice: 365000, trend: 'up', percentChange: 5.48, source: 'Bến sông Đồng Nai' }
    ],
    laborWages: [
      { id: 'lw-dna-1', role: 'Thợ chính xây trát', unit: 'ngày công (8h)', averageWage: 450000, rangeMin: 410000, rangeMax: 490000, trend: 'stable', notes: 'Khu vực Biên Hòa, Long Thành' }
    ],
    machineryRates: [
      { id: 'mc-dna-1', machine: 'Máy xúc đào 0.5m³', unit: 'ca (8h)', averageRate: 3350000, notes: 'Có tài xế' }
    ]
  },
  {
    province: 'Quảng Ninh',
    region: 'Miền Bắc',
    lastUpdated: '2026-09-30',
    materials: [
      { id: 'bm-qn-1', name: 'Thép vằn D10 Hòa Phát CB300V', group: 'Sắt thép', spec: 'Cây 11.7m', unit: 'cây', marketPrice: 115000, previousPrice: 113000, trend: 'up', percentChange: 1.77, source: 'Sở XD Quảng Ninh' },
      { id: 'bm-qn-2', name: 'Xi măng Hạ Long / Cẩm Phả PCB40', group: 'Xi măng', spec: 'Bao 50kg', unit: 'bao', marketPrice: 89000, previousPrice: 89000, trend: 'stable', percentChange: 0.0, source: 'Nhà máy Hạ Long' }
    ],
    laborWages: [
      { id: 'lw-qn-1', role: 'Thợ chính xây trát', unit: 'ngày công (8h)', averageWage: 470000, rangeMin: 430000, rangeMax: 530000, trend: 'up', notes: 'Thợ Hạ Long, Cẩm Phả' }
    ],
    machineryRates: [
      { id: 'mc-qn-1', machine: 'Máy xúc đào 0.5m³', unit: 'ca (8h)', averageRate: 3450000, notes: 'Có tài xế' }
    ]
  }
];

export const initialQuotations: Quotation[] = [
  {
    id: 'quote-1',
    code: 'BG-2026-001',
    customerName: 'Nguyễn Tuấn Khang',
    customerPhone: '0909 234 567',
    customerEmail: 'tuankhang.nguyen@gmail.com',
    customerAddress: 'Khu dân cư Phú Mỹ, Phường Phú Mỹ, Quận 7, TP.HCM',
    projectName: 'Xây dựng nhà phố 3 tầng 1 tum hiện đại (DT: 5x18m)',
    projectLocation: 'Số 42 Đường số 7, KDC Phú Mỹ, Quận 7, TP. Hồ Chí Minh',
    province: 'TP. Hồ Chí Minh',
    quoteDate: '2026-09-28',
    validUntil: '2026-10-18',
    preparedBy: 'KS. Trần Minh Quân',
    status: 'approved',
    items: [
      {
        id: 'qi-1',
        stt: 1,
        materialId: 'mat-1',
        code: 'THEP-HP-D10',
        name: 'Thép thanh vằn Hòa Phát D10',
        spec: 'CB300-V phi 10mm, L=11.7m',
        unit: 'cây',
        quantity: 280,
        costPrice: 106000,
        sellingPrice: 122000,
        amount: 34160000,
        profit: 4480000,
        notes: 'Thép sàn và cốt đai móng'
      },
      {
        id: 'qi-2',
        stt: 2,
        materialId: 'mat-2',
        code: 'THEP-HP-D12',
        name: 'Thép thanh vằn Hòa Phát D12',
        spec: 'CB300-V phi 12mm, L=11.7m',
        unit: 'cây',
        quantity: 220,
        costPrice: 153000,
        sellingPrice: 175000,
        amount: 38500000,
        profit: 4840000,
        notes: 'Thép dầm sàn tầng 1, 2, 3'
      },
      {
        id: 'qi-3',
        stt: 3,
        materialId: 'mat-3',
        code: 'THEP-HP-D16',
        name: 'Thép thanh vằn Hòa Phát D16',
        spec: 'CB400-V phi 16mm, L=11.7m',
        unit: 'cây',
        quantity: 160,
        costPrice: 272000,
        sellingPrice: 310000,
        amount: 49600000,
        profit: 6080000,
        notes: 'Thép chịu lực chính cột và móng băng'
      },
      {
        id: 'qi-4',
        stt: 4,
        materialId: 'mat-5',
        code: 'XM-HT-PCB40',
        name: 'Xi măng Hà Tiên 1 Đa dụng PCB40',
        spec: 'Bao 50kg TCVN',
        unit: 'bao',
        quantity: 450,
        costPrice: 88000,
        sellingPrice: 99000,
        amount: 44550000,
        profit: 4950000,
        notes: 'Xây trát và đúc lót'
      },
      {
        id: 'qi-5',
        stt: 5,
        materialId: 'mat-7',
        code: 'CAT-VANG-BT',
        name: 'Cát vàng hạt lớn đổ bê tông',
        spec: 'Sàng sạch tạp chất',
        unit: 'm3',
        quantity: 45,
        costPrice: 380000,
        sellingPrice: 440000,
        amount: 19800000,
        profit: 2700000,
        notes: 'Đổ kết cấu tại chỗ'
      },
      {
        id: 'qi-6',
        stt: 6,
        materialId: 'mat-8',
        code: 'CAT-XAY-TO',
        name: 'Cát vàng hạt mịn xây tô trát',
        spec: 'Mô đun 1.5 mịn',
        unit: 'm3',
        quantity: 60,
        costPrice: 280000,
        sellingPrice: 330000,
        amount: 19800000,
        profit: 3000000,
        notes: 'Tô trát tường trong ngoài'
      },
      {
        id: 'qi-7',
        stt: 7,
        materialId: 'mat-9',
        code: 'DA-1X2-XANH',
        name: 'Đá 1x2 xanh Đồng Nai (Hóa An)',
        spec: 'Hạt 10x28mm',
        unit: 'm3',
        quantity: 35,
        costPrice: 340000,
        sellingPrice: 395000,
        amount: 13825000,
        profit: 1925000,
        notes: 'Đá đổ bê tông móng'
      },
      {
        id: 'qi-8',
        stt: 8,
        materialId: 'mat-11',
        code: 'GACH-TN-4LO',
        name: 'Gạch Tuynel 4 lỗ Bình Dương',
        spec: '80x80x180mm',
        unit: 'viên',
        quantity: 22000,
        costPrice: 1150,
        sellingPrice: 1350,
        amount: 29700000,
        profit: 4400000,
        notes: 'Xây tường ngăn và tường bao'
      },
      {
        id: 'qi-9',
        stt: 9,
        materialId: 'mat-13',
        code: 'BT-TUOI-M250',
        name: 'Bê tông thương phẩm tươi M250 R28',
        spec: 'Độ sụt 12±2',
        unit: 'm3',
        quantity: 85,
        costPrice: 1250000,
        sellingPrice: 1420000,
        amount: 120700000,
        profit: 14450000,
        notes: 'Đổ toàn bộ sàn các tầng'
      }
    ],
    totalMaterialAmount: 370735000,
    totalMaterialCost: 328810000,
    laborCost: 185000000,
    transportCost: 15000000,
    machineryCost: 22000000,
    contingencyPercent: 3,
    contingencyCost: 17782050,
    discountPercent: 1.5,
    discountAmount: 9157755,
    markupPercent: 12,
    subtotalBeforeVat: 601359295,
    vatPercent: 10,
    vatAmount: 60135930,
    totalAfterVat: 661495225,
    totalEstimatedCost: 550810000,
    netProfit: 110685225,
    profitMarginPercent: 16.73,
    notesAndTerms: 'Bao gồm nhân công phần thô và hoàn thiện trọn gói. Đã bao gồm giàn giáo và trang thiết bị an toàn lao động.',
    createdAt: '2026-09-28T08:30:00.000Z',
    updatedAt: '2026-09-29T14:20:00.000Z'
  },
  {
    id: 'quote-2',
    code: 'BG-2026-002',
    customerName: 'Chị Hoàng Mai Anh',
    customerPhone: '0983 777 888',
    customerEmail: 'maianh.hoang@investcorp.vn',
    customerAddress: 'Khu đô thị Flamingo Riverside, Hà Nội',
    projectName: 'Cải tạo & nâng tầng biệt thự song lập (DT: 240m2)',
    projectLocation: 'Lô SL-18 Flamingo, Đông Anh, Hà Nội',
    province: 'Hà Nội',
    quoteDate: '2026-09-25',
    validUntil: '2026-10-15',
    preparedBy: 'KS. Vũ Quốc Huy',
    status: 'in_progress',
    items: [
      {
        id: 'qi-hn-1',
        stt: 1,
        materialId: 'mat-1',
        code: 'THEP-HP-D10',
        name: 'Thép thanh vằn Hòa Phát D10',
        spec: 'CB300-V phi 10mm, L=11.7m',
        unit: 'cây',
        quantity: 140,
        costPrice: 106000,
        sellingPrice: 120000,
        amount: 16800000,
        profit: 1960000,
        notes: 'Thép cấy sàn và đai gia cường'
      },
      {
        id: 'qi-hn-2',
        stt: 2,
        materialId: 'mat-6',
        code: 'XM-NS-PCB40',
        name: 'Xi măng Nghi Sơn PCB40',
        spec: 'Bao 50kg',
        unit: 'bao',
        quantity: 260,
        costPrice: 85000,
        sellingPrice: 96000,
        amount: 24960000,
        profit: 2860000,
        notes: 'Xây trát hoàn thiện'
      },
      {
        id: 'qi-hn-3',
        stt: 3,
        materialId: 'mat-8',
        code: 'CAT-XAY-TO',
        name: 'Cát vàng hạt mịn xây tô trát',
        spec: 'Mô đun 1.5',
        unit: 'm3',
        quantity: 40,
        costPrice: 280000,
        sellingPrice: 330000,
        amount: 13200000,
        profit: 2000000,
        notes: 'Trát tường siêu phẳng'
      },
      {
        id: 'qi-hn-4',
        stt: 4,
        materialId: 'mat-15',
        code: 'SON-DULUX-WEA',
        name: 'Sơn ngoại thất Dulux Weathershield',
        spec: 'Thùng 15L',
        unit: 'thùng',
        quantity: 12,
        costPrice: 2850000,
        sellingPrice: 3250000,
        amount: 39000000,
        profit: 4800000,
        notes: 'Sơn phủ toàn bộ mặt tiền'
      },
      {
        id: 'qi-hn-5',
        stt: 5,
        materialId: 'mat-16',
        code: 'SIKA-TOP-107',
        name: 'Vữa chống thấm Sikatop Seal 107',
        spec: 'Bộ 25kg',
        unit: 'bộ',
        quantity: 20,
        costPrice: 780000,
        sellingPrice: 910000,
        amount: 18200000,
        profit: 2600000,
        notes: 'Chống thấm sàn mái và ban công'
      }
    ],
    totalMaterialAmount: 112160000,
    totalMaterialCost: 97940000,
    laborCost: 95000000,
    transportCost: 8000000,
    machineryCost: 12000000,
    contingencyPercent: 5,
    contingencyCost: 11358000,
    discountPercent: 2,
    discountAmount: 4770360,
    markupPercent: 15,
    subtotalBeforeVat: 233747640,
    vatPercent: 10,
    vatAmount: 23374764,
    totalAfterVat: 257122404,
    totalEstimatedCost: 212940000,
    netProfit: 44182404,
    profitMarginPercent: 17.18,
    notesAndTerms: 'Công tác đập phá cải tạo và gia cố kết cấu chịu lực theo bản vẽ thẩm định số 104/KT-2026.',
    createdAt: '2026-09-25T10:15:00.000Z',
    updatedAt: '2026-09-26T16:00:00.000Z'
  },
  {
    id: 'quote-3',
    code: 'BG-2026-003',
    customerName: 'Công ty TNHH May Mặc Hưng Phát',
    customerPhone: '0274 382 1199',
    customerEmail: 'hungphat.garment@bd.vnn.vn',
    customerAddress: 'Khu công nghiệp VSIP 1, TP. Thuận An, Bình Dương',
    projectName: 'Thi công hoàn thiện sàn xưởng & hệ thống thoát nước (1500m2)',
    projectLocation: 'Đường số 6, KCN VSIP 1, Bình Dương',
    province: 'Bình Dương',
    quoteDate: '2026-09-29',
    validUntil: '2026-10-20',
    preparedBy: 'KS. Đoàn Văn Đạt',
    status: 'sent',
    items: [
      {
        id: 'qi-bd-1',
        stt: 1,
        materialId: 'mat-14',
        code: 'BT-TUOI-M300',
        name: 'Bê tông thương phẩm tươi M300 R28',
        spec: 'Độ sụt 12±2 mác cao',
        unit: 'm3',
        quantity: 180,
        costPrice: 1340000,
        sellingPrice: 1530000,
        amount: 275400000,
        profit: 34200000,
        notes: 'Đổ nền xưởng chịu tải xe nâng 3 tấn'
      },
      {
        id: 'qi-bd-2',
        stt: 2,
        materialId: 'mat-4',
        code: 'THEP-CUON-D6',
        name: 'Thép cuộn đai tròn phi 6 (D6)',
        spec: 'CB240-T đan lưới hàn',
        unit: 'kg',
        quantity: 3200,
        costPrice: 14800,
        sellingPrice: 16900,
        amount: 54080000,
        profit: 6720000,
        notes: 'Lưới thép chống nứt nền bê tông'
      },
      {
        id: 'qi-bd-3',
        stt: 3,
        materialId: 'mat-18',
        code: 'NUOC-TP-D90',
        name: 'Ống nhựa uPVC Tiền Phong D90 C2',
        spec: 'D90 C2 cây 4m',
        unit: 'cây',
        quantity: 80,
        costPrice: 185000,
        sellingPrice: 215000,
        amount: 17200000,
        profit: 2400000,
        notes: 'Thoát nước kỹ thuật sàn nhà xưởng'
      }
    ],
    totalMaterialAmount: 346680000,
    totalMaterialCost: 303360000,
    laborCost: 85000000,
    transportCost: 12000000,
    machineryCost: 28000000,
    contingencyPercent: 3,
    contingencyCost: 14150400,
    discountPercent: 1.0,
    discountAmount: 4858304,
    markupPercent: 10,
    subtotalBeforeVat: 480972096,
    vatPercent: 8,
    vatAmount: 38477768,
    totalAfterVat: 519449864,
    totalEstimatedCost: 428360000,
    netProfit: 91089864,
    profitMarginPercent: 17.53,
    notesAndTerms: 'Đã bao gồm chi phí máy xoa nền bê tông siêu phẳng Sika Chapdur màu xanh.',
    createdAt: '2026-09-29T11:00:00.000Z',
    updatedAt: '2026-09-29T11:00:00.000Z'
  }
];
