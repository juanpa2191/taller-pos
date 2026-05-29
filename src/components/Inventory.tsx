import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Package, Edit, Trash2, ArrowUpRight, Grid, List, ShieldAlert, BadgeInfo, CheckCircle, X, ShoppingBag } from 'lucide-react';
import { Part } from '../types';
import { SPARE_PART_CATEGORIES, MOTORCYCLE_BRANDS, BIKE_MODELS_BY_BRAND } from '../data';

interface InventoryProps {
  partsState: Part[];
  onAddPart: (part: Omit<Part, 'id'>) => void;
  onModifyStock: (id: string, newStock: number) => void;
  onDeletePart: (id: string) => void;
}

export default function Inventory({
  partsState,
  onAddPart,
  onModifyStock,
  onDeletePart
}: InventoryProps) {
  // Filters & layout modes
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Trigger for stock adding slide panel drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: '',
    category: SPARE_PART_CATEGORIES[0],
    price: '',
    stock: '',
    minStock: '',
    shelfLocation: '',
    compatibilityBrand: MOTORCYCLE_BRANDS[0],
    compatibilityModels: [] as string[],
    imageUrl: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=300&auto=format&fit=crop&q=80'
  });

  const availableModelsForSelectedBrand = useMemo(() => {
    return BIKE_MODELS_BY_BRAND[formData.compatibilityBrand] || [];
  }, [formData.compatibilityBrand]);

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = e.target.value;
    setFormData(prev => ({
      ...prev,
      compatibilityBrand: brand,
      compatibilityModels: []
    }));
  };

  const handleModelCheckboxToggle = (model: string) => {
    setFormData(prev => {
      const current = [...prev.compatibilityModels];
      if (current.includes(model)) {
        return { ...prev, compatibilityModels: current.filter(m => m !== model) };
      } else {
        return { ...prev, compatibilityModels: [...current, model] };
      }
    });
  };

  // Filter processes
  const filteredParts = useMemo(() => {
    return partsState.filter(part => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = part.name.toLowerCase().includes(searchLower) ||
                            part.sku.toLowerCase().includes(searchLower) ||
                            part.brand.toLowerCase().includes(searchLower);
      const matchesCategory = selectedCategory ? part.category === selectedCategory : true;
      const matchesLowStock = showOnlyLowStock ? part.stock <= part.minStock : true;

      return matchesSearch && matchesCategory && matchesLowStock;
    });
  }, [partsState, searchTerm, selectedCategory, showOnlyLowStock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.price || !formData.stock) {
      alert('Por favor completa todos los campos requeridos (*)');
      return;
    }

    onAddPart({
      name: formData.name,
      sku: formData.sku,
      brand: formData.brand || 'Genérico',
      modelCompatibility: formData.compatibilityModels.length > 0 ? formData.compatibilityModels : ['Multimarca'],
      compatibilityRange: {
        brand: formData.compatibilityBrand,
        model: formData.compatibilityModels[0] || 'Genérico',
        yearStart: 2018,
        yearEnd: 2026,
        cc: BIKE_MODELS_BY_BRAND[formData.compatibilityBrand]?.[0]?.cc || 300
      },
      price: Math.max(0, parseInt(formData.price) || 0),
      stock: Math.max(0, parseInt(formData.stock) || 0),
      minStock: Math.max(0, parseInt(formData.minStock) || 2),
      category: formData.category,
      shelfLocation: formData.shelfLocation || 'Estante G-0',
      imageUrl: formData.imageUrl,
      workshopId: 'W-01' // Registered as owner sucursal
    });

    // Reset Form
    setFormData({
      name: '',
      sku: '',
      brand: '',
      category: SPARE_PART_CATEGORIES[0],
      price: '',
      stock: '',
      minStock: '',
      shelfLocation: '',
      compatibilityBrand: MOTORCYCLE_BRANDS[0],
      compatibilityModels: [],
      imageUrl: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=300&auto=format&fit=crop&q=80'
    });

    setIsDrawerOpen(false);
  };

  return (
    <div className="w-full blueprint-bg bg-matte-950 text-gray-100 min-h-screen pt-4 pb-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Module Title Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 border-b border-matte-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-moto-blue font-mono uppercase tracking-wider mb-1">
              <Package className="w-4 h-4" />
              <span>Módulo de Control Fiscal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Inventario ERP de Repuestos</h1>
            <p className="text-gray-400 text-xs font-light">
              Administra el stock del almacén, vincula ubicaciones físicas en estantería y configura alarmas automáticas de bajo stock.
            </p>
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            id="inv-open-drawer"
            className="px-4 py-2.5 bg-moto-red hover:bg-red-600 font-semibold text-xs text-white rounded-lg cursor-pointer transition flex items-center gap-1.5 shadow-lg shrink-0"
          >
            <Plus className="w-4 h-4" /> Catalogar Repuesto
          </button>
        </div>

        {/* Filters and Views Selection Strip */}
        <div className="bg-matte-900 border border-matte-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow">
          {/* Filters left */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search Input bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                id="inv-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por repuesto, SKU o marca..."
                className="w-full bg-matte-950 border border-matte-800 focus:border-moto-red rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none text-white focus:ring-0"
              />
            </div>

            {/* Category Select box */}
            <select
              id="inv-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-matte-950 border border-matte-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-moto-red shrink-0"
            >
              <option value="">Todas las categorías</option>
              {SPARE_PART_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Quick controls right */}
          <div className="flex items-center gap-4 justify-between md:justify-end shrink-0">
            <label className="flex items-center gap-2 text-xs font-mono text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                id="inv-checkbox-lowstock"
                checked={showOnlyLowStock}
                onChange={(e) => setShowOnlyLowStock(e.target.checked)}
                className="rounded text-moto-red bg-matte-950 border-gray-800 focus:ring-0 w-4 h-4"
              />
              <span>Sólo Stock Bajo</span>
            </label>

            <div className="flex items-center gap-1.5 border border-matte-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('table')}
                id="inv-toggle-table"
                className={`p-1.5 rounded transition ${
                  viewMode === 'table' ? 'bg-matte-800 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
                title="Vista de Tabla"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                id="inv-toggle-cards"
                className={`p-1.5 rounded transition ${
                  viewMode === 'cards' ? 'bg-matte-800 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
                title="Vista de Tarjetas"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* DATA PRESENTATION */}
        {filteredParts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-matte-900 border border-matte-800 space-y-4 max-w-md mx-auto relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-matte-950 border border-matte-800 mx-auto flex items-center justify-center">
              <Package className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Sin repuestos correspondientes</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">
                Ninguna pieza almacenada con stock activo coincide con los criterios de filtrado actuales del almacén.
              </p>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          
          /* VIEW 1: DATA SHEET TABLE (Ideal for PCs/Desktop) */
          <div className="bg-matte-900 border border-matte-800 rounded-2xl shadow-xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-matte-800 font-mono text-[10px] text-gray-400 bg-matte-950/40 uppercase">
                  <th className="py-3 px-5">Detalle Repuesto</th>
                  <th className="py-3 px-5">SKU / Marca</th>
                  <th className="py-3 px-5">Categoría / Estante</th>
                  <th className="py-3 px-5 text-right">Precio unitario</th>
                  <th className="py-3 px-5 text-center">Unidades Stock</th>
                  <th className="py-3 px-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-matte-800 text-xs">
                {filteredParts.map((part) => {
                  const isLowStock = part.stock <= part.minStock;

                  return (
                    <tr key={part.id} className="hover:bg-matte-950/20 transition-colors group">
                      {/* Name & Img */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img 
                            src={part.imageUrl} 
                            alt={part.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 object-cover rounded-lg border border-matte-800" 
                          />
                          <div className="space-y-0.5">
                            <span className="font-bold text-white block leading-snug group-hover:text-moto-red transition-all pr-4">{part.name}</span>
                            <div className="flex gap-1.5 flex-wrap">
                              {part.modelCompatibility.slice(0, 2).map((model, idx) => (
                                <span key={idx} className="text-[9px] font-mono bg-matte-950 border border-matte-800 px-1.5 py-0.2 rounded text-gray-400">
                                  {model}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU & Brand */}
                      <td className="py-3.5 px-5 font-mono">
                        <span className="text-gray-300 font-semibold block">{part.brand}</span>
                        <span className="text-[10px] text-gray-500">{part.sku}</span>
                      </td>

                      {/* Category & Physical Location */}
                      <td className="py-3.5 px-5">
                        <span className="text-gray-400 block">{part.category}</span>
                        <span className="text-[10px] font-mono text-gray-500 bg-matte-950/80 px-1.5 py-0.2 rounded border border-matte-800 mt-1 inline-block">
                          {part.shelfLocation}
                        </span>
                      </td>

                      {/* Unit Price */}
                      <td className="py-3.5 px-5 text-right font-mono font-bold text-white text-sm">
                        ${part.price.toLocaleString('es-AR')}
                      </td>

                      {/* Stocks adjustment and indicators */}
                      <td className="py-3.5 px-5">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <div className="flex items-center gap-2">
                            {/* Decrement Stock */}
                            <button
                              onClick={() => onModifyStock(part.id, part.stock - 1)}
                              className="w-6 h-6 rounded bg-matte-950 border border-matte-800 hover:border-gray-600 text-gray-400 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer"
                              title="Restar 1 unidad"
                            >
                              -
                            </button>
                            <span className="font-mono font-extrabold text-white text-sm w-8 text-center">{part.stock}</span>
                            {/* Increment Stock */}
                            <button
                              onClick={() => onModifyStock(part.id, part.stock + 1)}
                              className="w-6 h-6 rounded bg-matte-950 border border-matte-800 hover:border-gray-600 text-gray-400 hover:text-white flex items-center justify-center font-bold text-sm transition cursor-pointer"
                              title="Sumar 1 unidad"
                            >
                              +
                            </button>
                          </div>

                          {isLowStock ? (
                            <span className="text-[9px] font-mono text-amber-500 flex items-center gap-1 shrink-0 bg-amber-950/20 border border-amber-900/30 px-1.5 py-0.2 rounded animate-pulse">
                              <ShieldAlert className="w-3 h-3" /> STOCK MÍN{part.minStock}
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-green-500 bg-green-950/20 px-1.5 py-0.2 rounded">Suficiente</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => onDeletePart(part.id)}
                          className="p-1.5 rounded text-gray-500 hover:text-rose-500 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/30 transition shadow cursor-pointer"
                          title="Eliminar repuesto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          
          /* VIEW 2: CARDS GRID (Ideal for mobile displays) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredParts.map((part) => {
              const isLowStock = part.stock <= part.minStock;

              return (
                <div 
                  key={part.id}
                  className="bento-card p-5 shadow-lg flex flex-col justify-between hover:border-matte-600 space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">{part.category}</span>
                      <span className="text-[10px] font-mono text-gray-400 bg-matte-950 px-2 py-0.5 rounded border border-matte-800">
                        {part.shelfLocation}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <img 
                        src={part.imageUrl} 
                        alt={part.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-xl border border-matte-800 shrink-0" 
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">{part.name}</h4>
                        <p className="text-[10px] font-mono text-gray-500 mt-1">{part.brand} • SKU {part.sku}</p>
                      </div>
                    </div>

                    {/* Stock status readout */}
                    <div className="flex justify-between items-center bg-matte-950/40 p-2.5 rounded-xl border border-matte-800">
                      <div>
                        <span className="text-[9px] font-mono text-gray-500 block uppercase">Almacén</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-white text-sm">{part.stock} unidades</span>
                          {isLowStock && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => onModifyStock(part.id, part.stock - 1)}
                          className="w-7 h-7 rounded bg-matte-900 border border-matte-800 hover:border-gray-500 text-white flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <button
                          onClick={() => onModifyStock(part.id, part.stock + 1)}
                          className="w-7 h-7 rounded bg-matte-900 border border-matte-800 hover:border-gray-500 text-white flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-matte-800 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 block">PRECIO FISCAL</span>
                      <span className="font-mono font-bold text-white text-sm">${part.price.toLocaleString('es-AR')}</span>
                    </div>
                    
                    <button
                      onClick={() => onDeletePart(part.id)}
                      className="text-xs text-gray-500 hover:text-rose-500 px-3 py-1.5 rounded hover:bg-rose-950/25 transition cursor-pointer"
                    >
                      Remover Ficha
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 4. SLIDE-OUT DRAWER PANEL: REGISTER PRODUCT FORM */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-matte-950/80 backdrop-blur-sm flex justify-end transition-opacity duration-300">
          
          {/* Drawer backdrop escape trigger */}
          <div className="absolute inset-0" onClick={() => setIsDrawerOpen(false)}></div>
          
          {/* Drawer sheet content */}
          <div className="relative w-full max-w-lg bg-matte-950 border-l border-matte-800 h-full overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              
              {/* Drawer header */}
              <div className="flex justify-between items-start border-b border-matte-800 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white">Catalogar Nuevo Repuesto</h3>
                  <p className="text-xs text-gray-400 font-light mt-1">Registra consumibles o refacciones directo en el ERP fiscal.</p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-lg bg-matte-900 border border-matte-800 text-gray-500 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form elements */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* 1. Name */}
                <div className="space-y-1.5">
                  <label htmlFor="form-part-name" className="text-[11px] font-mono text-gray-400 uppercase block font-semibold">Nombre del repuesto *</label>
                  <input
                    type="text"
                    id="form-part-name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej. Correa de Transmisión Reforzada Gates"
                    className="w-full bg-matte-900 border border-matte-800 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-moto-red"
                  />
                </div>

                {/* 2. SKU and Brand */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="form-part-sku" className="text-[11px] font-mono text-gray-400 uppercase block font-semibold">Código SKU / Nro Parte *</label>
                    <input
                      type="text"
                      id="form-part-sku"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                      placeholder="Ej. GT-520-XSD"
                      className="w-full bg-matte-900 border border-matte-800 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-moto-red"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="form-part-brand" className="text-[11px] font-mono text-gray-400 uppercase block font-semibold">Fabricante / Marca *</label>
                    <input
                      type="text"
                      id="form-part-brand"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      placeholder="Ej. Brembo, Motul, Gates"
                      className="w-full bg-matte-900 border border-matte-800 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-moto-red"
                    />
                  </div>
                </div>

                {/* 3. Category & Shelf Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="form-part-cat" className="text-[11px] font-mono text-gray-400 uppercase block font-semibold font-mono">Categoría de repuestos</label>
                    <select
                      id="form-part-cat"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-matte-900 border border-matte-800 rounded-lg px-3 py-2.5 text-gray-300 focus:outline-none focus:border-moto-red"
                    >
                      {SPARE_PART_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="form-part-shelf" className="text-[11px] font-mono text-gray-400 uppercase block font-semibold">Ubicación Física Almacén</label>
                    <input
                      type="text"
                      id="form-part-shelf"
                      value={formData.shelfLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, shelfLocation: e.target.value }))}
                      placeholder="Ej. Estante B-4, Pasillo C"
                      className="w-full bg-matte-900 border border-matte-800 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-moto-red"
                    />
                  </div>
                </div>

                {/* 4. Prices, stock, limit values */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="form-part-price" className="text-[11px] font-mono text-gray-400 uppercase block font-semibold">Precio ARS *</label>
                    <input
                      type="number"
                      id="form-part-price"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="95000"
                      className="w-full bg-matte-900 border border-matte-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-moto-red"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="form-part-stock" className="text-[11px] font-mono text-gray-400 uppercase block font-semibold">Stock Inicial *</label>
                    <input
                      type="number"
                      id="form-part-stock"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                      placeholder="10"
                      className="w-full bg-matte-900 border border-matte-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-moto-red"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="form-part-min" className="text-[11px] font-mono text-gray-400 uppercase block font-semibold">Alerta Mínimo</label>
                    <input
                      type="number"
                      id="form-part-min"
                      min="0"
                      value={formData.minStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, minStock: e.target.value }))}
                      placeholder="2"
                      className="w-full bg-matte-900 border border-matte-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-moto-red"
                    />
                  </div>
                </div>

                {/* 5. Advanced compatibility builder selector tags */}
                <div className="p-3.5 bg-matte-900 border border-matte-800 rounded-xl space-y-3">
                  <span className="text-[10px] font-mono text-gray-400 font-bold uppercase block">Asistente de Compatibilidad Mecánica</span>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="form-part-comp-brand" className="text-[10px] font-mono text-gray-400 uppercase">Marca Primaria</label>
                    <select
                      id="form-part-comp-brand"
                      value={formData.compatibilityBrand}
                      onChange={handleBrandChange}
                      className="w-full bg-matte-950 border border-matte-800 rounded-lg px-2.5 py-1.5 text-gray-300 focus:outline-none text-xs"
                    >
                      {MOTORCYCLE_BRANDS.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-gray-400 uppercase">Modelos Compatibles de {formData.compatibilityBrand}</p>
                    <div className="grid grid-cols-2 gap-2 max-h-[100px] overflow-y-auto p-1.5 bg-matte-950 rounded border border-matte-800">
                      {availableModelsForSelectedBrand.map(bike => {
                        const isChecked = formData.compatibilityModels.includes(bike.model);
                        return (
                          <label key={bike.model} className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-300 select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleModelCheckboxToggle(bike.model)}
                              className="rounded text-moto-red bg-matte-900 border-gray-800 focus:ring-0 w-3.5 h-3.5"
                            />
                            <span>{bike.model} ({bike.cc}cc)</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </form>

            </div>

            {/* Submit block bottom */}
            <div className="pt-4 border-t border-matte-800 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-1/3 py-3 rounded-lg border border-matte-800 text-gray-400 hover:text-white transition font-medium text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                id="inv-submit-part"
                className="w-2/3 py-3 rounded-lg bg-moto-red hover:bg-red-600 text-white font-bold text-xs transition cursor-pointer shadow-lg"
              >
                Agregar al Almacén
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
