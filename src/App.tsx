import React, { useState, useEffect } from 'react';
import { 
  Material, 
  Supplier, 
  Quotation, 
  CompanyProfile, 
  ProvincialBenchmark, 
  Language, 
  BenchmarkMaterial 
} from './types';
import { 
  loadMaterials, 
  saveMaterials, 
  loadSuppliers, 
  saveSuppliers, 
  loadQuotations, 
  saveQuotations, 
  loadCompanyProfile, 
  saveCompanyProfile, 
  loadBenchmarks, 
  resetAllToSample 
} from './utils/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { MarketPricesView } from './components/MarketPricesView';
import { MaterialsView } from './components/MaterialsView';
import { SuppliersView } from './components/SuppliersView';
import { QuotationBuilderView } from './components/QuotationBuilderView';
import { QuotationHistoryView } from './components/QuotationHistoryView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { QuotationPrintModal } from './components/QuotationPrintModal';
import { QuickPriceFinder } from './components/QuickPriceFinder';

export default function App() {
  // Navigation & Language
  const [currentView, setCurrentView] = useState<string>('overview');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('daom_language_v1') as Language) || 'vi';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Core Data Entities
  const [materials, setMaterials] = useState<Material[]>(loadMaterials);
  const [suppliers, setSuppliers] = useState<Supplier[]>(loadSuppliers);
  const [quotations, setQuotations] = useState<Quotation[]>(loadQuotations);
  const [company, setCompany] = useState<CompanyProfile>(loadCompanyProfile);
  const [benchmarks, setBenchmarks] = useState<ProvincialBenchmark[]>(loadBenchmarks);

  // Selected Province
  const [selectedProvince, setSelectedProvince] = useState<string>(
    benchmarks[0]?.province || 'TP. Hồ Chí Minh'
  );

  // Quotation in builder state (for editing or cloning)
  const [activeQuotationForEdit, setActiveQuotationForEdit] = useState<Quotation | null>(null);

  // Quotation for print preview modal
  const [activeQuotationForPrint, setActiveQuotationForPrint] = useState<Quotation | null>(null);

  // Global keyboard shortcut '/' to quickly trigger Price Finder
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setCurrentView('quick_search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle adding an item directly from price lookup into active quotation
  const handleAddToQuotationFromSearch = (item: any) => {
    const lineItem = {
      id: `qi-find-${Date.now()}`,
      stt: (activeQuotationForEdit?.items?.length || 0) + 1,
      materialId: item.materialId,
      code: item.code || 'VT-TIM-KIEM',
      name: item.name,
      spec: item.spec || '',
      unit: item.unit || 'cái',
      quantity: item.quantity || 1,
      costPrice: item.costPrice || 0,
      sellingPrice: item.sellingPrice || item.price || 0,
      amount: (item.quantity || 1) * (item.sellingPrice || item.price || 0),
      profit: ((item.quantity || 1) * (item.sellingPrice || item.price || 0)) - ((item.quantity || 1) * (item.costPrice || 0)),
      notes: item.notes || ''
    };

    if (activeQuotationForEdit) {
      setActiveQuotationForEdit({
        ...activeQuotationForEdit,
        items: [...activeQuotationForEdit.items, lineItem]
      });
    } else {
      const currentYear = new Date().getFullYear();
      const newQuote: Quotation = {
        id: `quote-${Date.now()}`,
        code: `BG-${currentYear}-${String(Math.floor(Math.random() * 900) + 100)}`,
        customerName: 'Khách hàng',
        projectName: `Công trình xây dựng (${selectedProvince})`,
        projectLocation: selectedProvince,
        province: selectedProvince,
        quoteDate: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
        preparedBy: company.representative || 'Kỹ sư dự toán DAOM',
        status: 'draft',
        items: [lineItem],
        totalMaterialAmount: lineItem.amount,
        totalMaterialCost: lineItem.quantity * lineItem.costPrice,
        laborCost: 0,
        transportCost: 0,
        machineryCost: 0,
        contingencyPercent: 3,
        contingencyCost: Math.round(lineItem.amount * 0.03),
        discountPercent: 0,
        discountAmount: 0,
        markupPercent: 10,
        subtotalBeforeVat: lineItem.amount,
        vatPercent: 10,
        vatAmount: Math.round(lineItem.amount * 0.1),
        totalAfterVat: Math.round(lineItem.amount * 1.1),
        totalEstimatedCost: lineItem.quantity * lineItem.costPrice,
        netProfit: lineItem.amount - (lineItem.quantity * lineItem.costPrice),
        profitMarginPercent: lineItem.amount > 0 ? Number((((lineItem.amount - (lineItem.quantity * lineItem.costPrice)) / lineItem.amount) * 100).toFixed(2)) : 0,
        notesAndTerms: company.defaultTerms,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setActiveQuotationForEdit(newQuote);
    }

    setCurrentView('create_quote');
  };

  // Handle language change
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('daom_language_v1', lang);
  };

  // Materials CRUD
  const handleAddMaterial = (newMat: Material) => {
    const updated = [newMat, ...materials];
    setMaterials(updated);
    saveMaterials(updated);
  };

  const handleUpdateMaterial = (updatedMat: Material) => {
    const updated = materials.map(m => m.id === updatedMat.id ? updatedMat : m);
    setMaterials(updated);
    saveMaterials(updated);
  };

  const handleDeleteMaterial = (id: string) => {
    const updated = materials.filter(m => m.id !== id);
    setMaterials(updated);
    saveMaterials(updated);
  };

  // Quick import from Provincial Benchmark into company materials
  const handleAddMaterialFromBenchmark = (bm: BenchmarkMaterial, provinceName: string) => {
    const existing = materials.find(m => m.name.toLowerCase() === bm.name.toLowerCase());
    if (existing) {
      // Update price
      const updatedMat: Material = {
        ...existing,
        costPrice: Math.round(bm.marketPrice * 0.9),
        sellingPrice: bm.marketPrice,
        updatedAt: new Date().toISOString().split('T')[0],
        notes: `Cập nhật theo thị trường ${provinceName}`
      };
      handleUpdateMaterial(updatedMat);
      return;
    }

    const newMat: Material = {
      id: `mat-bm-${Date.now()}`,
      code: `VT-${bm.group.toUpperCase()}-${materials.length + 1}`,
      name: bm.name,
      group: bm.group,
      spec: bm.spec,
      unit: bm.unit,
      supplierId: suppliers[0]?.id || '',
      supplierName: suppliers[0]?.name || 'Nguồn thị trường',
      costPrice: Math.round(bm.marketPrice * 0.9),
      sellingPrice: bm.marketPrice,
      vatRate: 10,
      updatedAt: new Date().toISOString().split('T')[0],
      notes: `Đơn giá chuẩn khảo sát tại ${provinceName}`
    };
    handleAddMaterial(newMat);
  };

  // Suppliers CRUD
  const handleAddSupplier = (newSup: Supplier) => {
    const updated = [newSup, ...suppliers];
    setSuppliers(updated);
    saveSuppliers(updated);
  };

  const handleUpdateSupplier = (updatedSup: Supplier) => {
    const updated = suppliers.map(s => s.id === updatedSup.id ? updatedSup : s);
    setSuppliers(updated);
    saveSuppliers(updated);
  };

  const handleDeleteSupplier = (id: string) => {
    const updated = suppliers.filter(s => s.id !== id);
    setSuppliers(updated);
    saveSuppliers(updated);
  };

  // Quotations CRUD
  const handleSaveQuotation = (savedQuote: Quotation) => {
    const exists = quotations.some(q => q.id === savedQuote.id);
    let updated: Quotation[];
    if (exists) {
      updated = quotations.map(q => q.id === savedQuote.id ? savedQuote : q);
    } else {
      updated = [savedQuote, ...quotations];
    }
    setQuotations(updated);
    saveQuotations(updated);
    setActiveQuotationForEdit(null);
    setCurrentView('history');
  };

  const handleDeleteQuotation = (id: string) => {
    const updated = quotations.filter(q => q.id !== id);
    setQuotations(updated);
    saveQuotations(updated);
  };

  const handleDuplicateQuotation = (quote: Quotation) => {
    const currentYear = new Date().getFullYear();
    const newCode = `BG-${currentYear}-${String(Math.floor(Math.random() * 900) + 100)}`;
    const cloned: Quotation = {
      ...quote,
      id: `quote-${Date.now()}`,
      code: newCode,
      status: 'draft',
      projectName: `${quote.projectName} (Bản sao)`,
      quoteDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setActiveQuotationForEdit(cloned);
    setCurrentView('create_quote');
  };

  const handleEditQuotation = (quote: Quotation) => {
    setActiveQuotationForEdit(quote);
    setCurrentView('create_quote');
  };

  const handleCreateNewQuotation = () => {
    setActiveQuotationForEdit(null);
    setCurrentView('create_quote');
  };

  const handleUpdateCompany = (newCompany: CompanyProfile) => {
    setCompany(newCompany);
    saveCompanyProfile(newCompany);
  };

  const handleResetData = () => {
    resetAllToSample();
    setMaterials(loadMaterials());
    setSuppliers(loadSuppliers());
    setQuotations(loadQuotations());
    setCompany(loadCompanyProfile());
    setBenchmarks(loadBenchmarks());
  };

  const handleBulkAddMaterials = (newMaterials: Material[]) => {
    const existingCodes = new Set(materials.map(m => m.code));
    const toAdd = newMaterials.filter(m => !existingCodes.has(m.code));
    const updated = [...materials, ...toAdd];
    setMaterials(updated);
    saveMaterials(updated);
  };

  const provinceNames = benchmarks.map(b => b.province);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Left Enterprise Navigation Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'create_quote' && currentView !== 'create_quote') {
            setActiveQuotationForEdit(null);
          }
          setCurrentView(view);
        }}
        language={language}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        materialsCount={materials.length}
        quotationsCount={quotations.length}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          currentView={currentView}
          language={language}
          onLanguageChange={handleLanguageChange}
          onNavigate={(view) => {
            if (view === 'create_quote') {
              setActiveQuotationForEdit(null);
            }
            setCurrentView(view);
          }}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          selectedProvince={selectedProvince}
          onProvinceChange={setSelectedProvince}
          provinces={provinceNames}
        />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            {currentView === 'overview' && (
              <DashboardView
                materials={materials}
                quotations={quotations}
                benchmarks={benchmarks}
                currentProvince={selectedProvince}
                language={language}
                onNavigate={setCurrentView}
                onViewQuotation={handleEditQuotation}
                onPrintQuotation={setActiveQuotationForPrint}
              />
            )}

            {currentView === 'quick_search' && (
              <QuickPriceFinder
                materials={materials}
                benchmarks={benchmarks}
                currentProvince={selectedProvince}
                onProvinceChange={setSelectedProvince}
                language={language}
                onAddToQuotation={handleAddToQuotationFromSearch}
                onAddMaterialToCatalog={handleAddMaterial}
                onNavigate={setCurrentView}
              />
            )}

            {currentView === 'market_prices' && (
              <MarketPricesView
                benchmarks={benchmarks}
                currentProvince={selectedProvince}
                onProvinceChange={setSelectedProvince}
                language={language}
                onAddMaterialFromBenchmark={handleAddMaterialFromBenchmark}
              />
            )}

            {currentView === 'materials' && (
              <MaterialsView
                materials={materials}
                suppliers={suppliers}
                language={language}
                onAddMaterial={handleAddMaterial}
                onUpdateMaterial={handleUpdateMaterial}
                onDeleteMaterial={handleDeleteMaterial}
                onBulkAddMaterials={handleBulkAddMaterials}
              />
            )}

            {currentView === 'suppliers' && (
              <SuppliersView
                suppliers={suppliers}
                language={language}
                onAddSupplier={handleAddSupplier}
                onUpdateSupplier={handleUpdateSupplier}
                onDeleteSupplier={handleDeleteSupplier}
              />
            )}

            {currentView === 'create_quote' && (
              <QuotationBuilderView
                key={activeQuotationForEdit?.id || 'new-quote'}
                initialQuotation={activeQuotationForEdit}
                materials={materials}
                benchmarks={benchmarks}
                company={company}
                language={language}
                onSave={handleSaveQuotation}
                onBack={() => setCurrentView('history')}
                onPrint={setActiveQuotationForPrint}
              />
            )}

            {currentView === 'history' && (
              <QuotationHistoryView
                quotations={quotations}
                company={company}
                language={language}
                onEditQuotation={handleEditQuotation}
                onPrintQuotation={setActiveQuotationForPrint}
                onDuplicateQuotation={handleDuplicateQuotation}
                onDeleteQuotation={handleDeleteQuotation}
                onNewQuotation={handleCreateNewQuotation}
              />
            )}

            {currentView === 'reports' && (
              <ReportsView
                quotations={quotations}
                materials={materials}
                language={language}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                company={company}
                language={language}
                onUpdateCompany={handleUpdateCompany}
                onResetData={handleResetData}
              />
            )}
          </div>
        </main>
      </div>

      {/* Quotation Printable Layout Modal */}
      {activeQuotationForPrint && (
        <QuotationPrintModal
          quotation={activeQuotationForPrint}
          company={company}
          language={language}
          onClose={() => setActiveQuotationForPrint(null)}
        />
      )}
    </div>
  );
}
