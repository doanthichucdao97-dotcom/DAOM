import React from 'react';
import { Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Boxes, 
  Building2, 
  FileSpreadsheet, 
  History, 
  BarChart3, 
  Settings,
  HardHat,
  X,
  Search
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  materialsCount: number;
  quotationsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  language,
  isOpen,
  onClose,
  materialsCount,
  quotationsCount
}) => {
  const t = getTranslation(language);

  const menuItems = [
    {
      id: 'overview',
      label: t.navOverview,
      icon: LayoutDashboard,
    },
    {
      id: 'quick_search',
      label: t.navQuickPriceSearch,
      icon: Search,
      badge: 'Hot'
    },
    {
      id: 'market_prices',
      label: t.navMarketPrices,
      icon: TrendingUp,
      badge: 'Real-time'
    },
    {
      id: 'materials',
      label: t.navMaterials,
      icon: Boxes,
      count: materialsCount
    },
    {
      id: 'suppliers',
      label: t.navSuppliers,
      icon: Building2,
    },
    {
      id: 'create_quote',
      label: t.navCreateQuote,
      icon: FileSpreadsheet,
    },
    {
      id: 'history',
      label: t.navHistory,
      icon: History,
      count: quotationsCount
    },
    {
      id: 'reports',
      label: t.navReports,
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: t.navSettings,
      icon: Settings,
    },
  ];

  const handleSelect = (viewId: string) => {
    onNavigate(viewId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 md:w-68 bg-slate-900 text-white flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Lockup */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-wider text-white">DAOM</span>
              <span className="text-[10px] block text-slate-400 font-medium uppercase tracking-wider">
                Construction ERP
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md md:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.count !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono tabular-nums ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}

                {item.badge && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Quick Info & Market Pulse */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">{t.dailyUpdated}</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live 63 Tỉnh
            </span>
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            Dữ liệu giá vật tư và đơn giá nhân công theo tiêu chuẩn Bộ Xây Dựng 2026.
          </div>
        </div>
      </aside>
    </>
  );
};
