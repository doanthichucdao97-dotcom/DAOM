import React, { useState } from 'react';
import { CompanyProfile, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { 
  Settings, 
  Building2, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  FileText 
} from 'lucide-react';

interface SettingsViewProps {
  company: CompanyProfile;
  language: Language;
  onUpdateCompany: (company: CompanyProfile) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  company,
  language,
  onUpdateCompany,
  onResetData
}) => {
  const t = getTranslation(language);
  const [formData, setFormData] = useState<CompanyProfile>({ ...company });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportJSON = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      company: formData,
      materials: localStorage.getItem('daom_materials_v1') ? JSON.parse(localStorage.getItem('daom_materials_v1')!) : [],
      quotations: localStorage.getItem('daom_quotations_v1') ? JSON.parse(localStorage.getItem('daom_quotations_v1')!) : [],
      suppliers: localStorage.getItem('daom_suppliers_v1') ? JSON.parse(localStorage.getItem('daom_suppliers_v1')!) : []
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DAOM_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.materials) localStorage.setItem('daom_materials_v1', JSON.stringify(json.materials));
        if (json.quotations) localStorage.setItem('daom_quotations_v1', JSON.stringify(json.quotations));
        if (json.suppliers) localStorage.setItem('daom_suppliers_v1', JSON.stringify(json.suppliers));
        if (json.company) {
          localStorage.setItem('daom_company_v1', JSON.stringify(json.company));
          setFormData(json.company);
          onUpdateCompany(json.company);
        }
        alert('Phục hồi dữ liệu thành công! Ứng dụng sẽ tự động tải lại.');
        window.location.reload();
      } catch (err) {
        alert('File JSON không hợp lệ hoặc bị lỗi định dạng.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('CẢNH BÁO: Thao tác này sẽ đặt lại toàn bộ danh mục vật tư, nhà cung cấp và báo giá về dữ liệu ban đầu. Bạn có chắc chắn không?')) {
      onResetData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      {/* Top Banner */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <span>{t.navSettings}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Cấu hình thông tin pháp lý doanh nghiệp, mẫu in báo giá và quản lý sao lưu dữ liệu
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>{t.companySettings}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.companyName} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.taxCode} *
              </label>
              <input
                type="text"
                required
                value={formData.taxCode}
                onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.companyPhone} *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.companyEmail} *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.companyWebsite}
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.companyAddress} *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.bankAccount}
              </label>
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.bankName}
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.representativeName} (Ký đóng dấu báo giá)
              </label>
              <input
                type="text"
                value={formData.representative}
                onChange={(e) => setFormData({ ...formData, representative: e.target.value })}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.representativeRole}
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Quotation Defaults */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Mẫu điều khoản mặc định cho báo giá</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thời hạn hiệu lực mặc định của báo giá (Số ngày)
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={formData.defaultValidityDays}
                onChange={(e) => setFormData({ ...formData, defaultValidityDays: parseInt(e.target.value) || 20 })}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thuế VAT mặc định (%)
              </label>
              <select
                value={formData.defaultVatRate}
                onChange={(e) => setFormData({ ...formData, defaultVatRate: parseInt(e.target.value) || 10 })}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono"
              >
                <option value={0}>0%</option>
                <option value={8}>8%</option>
                <option value={10}>10%</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.defaultTerms}
              </label>
              <textarea
                rows={5}
                value={formData.defaultTerms}
                onChange={(e) => setFormData({ ...formData, defaultTerms: e.target.value })}
                className="w-full p-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg leading-relaxed font-sans"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Đã lưu thành công!' : t.save}</span>
          </button>
        </div>
      </form>

      {/* Backup and Restore Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Quản lý cơ sở dữ liệu & Sao lưu
        </h3>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportBackup}</span>
          </button>

          <label className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>{t.importBackup}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg cursor-pointer transition-colors sm:ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.resetData}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
