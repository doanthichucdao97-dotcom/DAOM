import React from 'react';
import { Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { FilePlus2, Globe, Menu, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (view: string) => void;
  onToggleSidebar: () => void;
  selectedProvince: string;
  onProvinceChange: (province: string) => void;
  provinces: string[];
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  language,
  onLanguageChange,
  onNavigate,
  onToggleSidebar,
  selectedProvince,
  onProvinceChange,
  provinces
}) => {
  const t = getTranslation(language);

  const getViewTitle = () => {
    switch (currentView) {
      case 'overview': return t.navOverview;
      case 'quick_search': return t.navQuickPriceSearch;
      case 'market_prices': return t.navMarketPrices;
      case 'materials': return t.navMaterials;
      case 'suppliers': return t.navSuppliers;
      case 'create_quote': return t.navCreateQuote;
      case 'history': return t.navHistory;
      case 'reports': return t.navReports;
      case 'settings': return t.navSettings;
      default: return t.navOverview;
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-200 no-print gap-3">
      {/* Zone 1: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-600 rounded-lg hover:bg-slate-100 md:hidden"
          title="Toggle Menu"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 tracking-tight text-base md:text-lg">
            {t.appShort}
          </span>
          <span className="text-slate-300 font-light">/</span>
          <h1 className="text-sm md:text-base font-medium text-slate-700 truncate max-w-[140px] sm:max-w-[180px] md:max-w-xs">
            {getViewTitle()}
          </h1>
        </div>
      </div>

      {/* Zone 2: Quick Material Price Search Trigger & Province */}
      <div className="flex items-center gap-2 flex-1 max-w-md mx-2">
        <button
          onClick={() => onNavigate('quick_search')}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer group"
          title="Tra cứu giá vật tư nhanh"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="text-blue-600 font-bold">🔍</span>
            <span className="truncate group-hover:text-slate-800">
              Tra cứu nhanh giá vật tư...
            </span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-300 rounded text-slate-400">
            /
          </kbd>
        </button>

        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs shrink-0">
          <span className="text-slate-500">{t.province}:</span>
          <select
            value={selectedProvince}
            onChange={(e) => onProvinceChange(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" title="Giá hôm nay" />
        </div>
      </div>

      {/* Zone 3: Actions & Language Switcher */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Language selector */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
          <div className="pl-1.5 pr-1 text-slate-500 hidden sm:block">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <button
            onClick={() => onLanguageChange('vi')}
            className={`px-2 py-1 text-xs font-semibold rounded ${
              language === 'vi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            VI
          </button>
          <button
            onClick={() => onLanguageChange('ko')}
            className={`px-2 py-1 text-xs font-semibold rounded ${
              language === 'ko' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            KO
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 text-xs font-semibold rounded ${
              language === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EN
          </button>
        </div>

        {/* Quick Create Quotation Button */}
        <button
          onClick={() => onNavigate('create_quote')}
          className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <FilePlus2 className="w-4 h-4" />
          <span className="hidden sm:inline">{t.quickCreateQuote}</span>
          <span className="sm:hidden">{t.add}</span>
        </button>
      </div>
    </header>
  );
};
