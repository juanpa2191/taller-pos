import React, { useState, useMemo } from 'react';
import { Search, MapPin, Filter, SlidersHorizontal, Grid, List, Phone, MessageSquare, Compass, ExternalLink, ShieldAlert, Star, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Workshop, Part } from '../types';
import { INITIAL_WORKSHOPS, INITIAL_PARTS, SPARE_PART_CATEGORIES, MOTORCYCLE_BRANDS, BIKE_MODELS_BY_BRAND } from '../data';

interface MarketplaceProps {
  initialSearchTerm?: string;
  initialCategory?: string;
  onNavigateToWorkshop: (id: string) => void;
  workshopsState: Workshop[];
  partsState: Part[];
}

export default function Marketplace({
  initialSearchTerm = '',
  initialCategory = '',
  onNavigateToWorkshop,
  workshopsState,
  partsState
}: MarketplaceProps) {
  // Filters States
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCc, setSelectedCc] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Layout View Controls
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Selected Map Pin / Workshop Highlights
  const [selectedMapWorkshop, setSelectedMapWorkshop] = useState<string | null>(workshopsState[0]?.id || null);

  // Available models based on brand selection
  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    return BIKE_MODELS_BY_BRAND[selectedBrand] || [];
  }, [selectedBrand]);

  // Handle Brand Switch (resets model)
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
    setSelectedModel('');
  };

  // Filter Parts Logic
  const filteredParts = useMemo(() => {
    return partsState.filter(part => {
      // 1. Text Search matches part name, brand, or SKU
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm ? (
        part.name.toLowerCase().includes(searchLower) ||
        part.brand.toLowerCase().includes(searchLower) ||
        part.sku.toLowerCase().includes(searchLower)
      ) : true;

      // 2. Category Filter
      const matchesCategory = selectedCategory ? part.category === selectedCategory : true;

      // 3. Moto Brand Compatibility
      const matchesBrand = selectedBrand ? (
        part.compatibilityRange.brand === selectedBrand ||
        part.modelCompatibility.some(model => {
          const compatibleBikeSpecs = BIKE_MODELS_BY_BRAND[selectedBrand]?.find(b => b.model === model);
          return !!compatibleBikeSpecs;
        })
      ) : true;

      // 4. Moto Model Compatibility
      const matchesModel = selectedModel ? (
        part.compatibilityRange.model === selectedModel ||
        part.modelCompatibility.includes(selectedModel)
      ) : true;

      // 5. Engine CC Filter Range
      let matchesCc = true;
      if (selectedCc) {
        const partCc = part.compatibilityRange.cc;
        if (selectedCc === 'low') matchesCc = partCc <= 250;
        else if (selectedCc === 'mid') matchesCc = partCc > 250 && partCc <= 500;
        else if (selectedCc === 'high') matchesCc = partCc > 500;
      }

      // 6. Year Filter Range
      let matchesYear = true;
      if (selectedYear) {
        const yearInt = parseInt(selectedYear);
        const { yearStart, yearEnd } = part.compatibilityRange;
        // Check if year matches inside the compatibility start/end bounds
        matchesYear = (yearInt >= yearStart && yearInt <= yearEnd);
      }

      return matchesSearch && matchesCategory && matchesBrand && matchesModel && matchesCc && matchesYear;
    });
  }, [partsState, searchTerm, selectedCategory, selectedBrand, selectedModel, selectedCc, selectedYear]);

  // Reset all filters easily
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedCc('');
    setSelectedYear('');
    setSelectedCategory('');
  };

  // Map representation of target coordinates
  const currentSelectedWorkshopCoordinates = useMemo(() => {
    const workshopObj = workshopsState.find(w => w.id === selectedMapWorkshop);
    return workshopObj ? { name: workshopObj.name, address: workshopObj.address } : null;
  }, [selectedMapWorkshop, workshopsState]);

  return (
    <div className="w-full blueprint-bg bg-matte-950 text-gray-100 min-h-screen pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Title */}
        <div className="space-y-1.5 py-4 border-b border-matte-800">
          <div className="flex items-center gap-2 text-xs font-mono text-moto-red uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Marketplace Geolocalizado</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Catálogo Público de Repuestos con Stock Real</h1>
          <p className="text-gray-400 text-xs font-light max-w-3xl">
            Filtra repuestos compatibles con tu motocicleta por año y cilindraje exacto. Visualiza los talleres mecánicos más cercanos y ordénalos por distancia o precio.
          </p>
        </div>

        {/* Master Filters Sidebar & Content Area split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Multi-Filters Panel */}
          <div className="lg:col-span-3 bg-matte-900 border border-matte-800 rounded-2xl p-5 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-matte-800 pb-3">
              <span className="text-xs font-mono font-bold text-gray-300 flex items-center gap-1.5 uppercase">
                <SlidersHorizontal className="w-4 h-4 text-moto-red" />
                Filtrar Repuestos
              </span>
              <button
                onClick={resetFilters}
                className="text-[11px] font-mono hover:text-moto-red text-gray-500 transition-colors cursor-pointer"
              >
                Limpiar todo
              </button>
            </div>

            {/* Keyword search filter */}
            <div className="space-y-1.5">
              <label htmlFor="filter-keyword" className="text-[11px] font-mono text-gray-400 uppercase">Buscar pieza</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  id="filter-keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ej. Bujía, Brembo..."
                  className="w-full pl-9 pr-3 py-2 bg-matte-950 border border-matte-800 focus:border-moto-red text-white placeholder-gray-500 rounded-lg text-xs focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* Brand filter category */}
            <div className="space-y-1.5">
              <label htmlFor="filter-brand" className="text-[11px] font-mono text-gray-400 uppercase">Marca Moto</label>
              <select
                id="filter-brand"
                value={selectedBrand}
                onChange={handleBrandChange}
                className="w-full bg-matte-950 border border-matte-800 px-3 py-2 rounded-lg text-xs text-gray-300 focus:outline-none focus:border-moto-red"
              >
                <option value="">Todas las marcas</option>
                {MOTORCYCLE_BRANDS.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Model filter based on brand */}
            <div className="space-y-1.5">
              <label htmlFor="filter-model" className="text-[11px] font-mono text-gray-400 uppercase">Modelo Compatible</label>
              <select
                id="filter-model"
                value={selectedModel}
                disabled={!selectedBrand}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-matte-950 border border-matte-800 px-3 py-2 rounded-lg text-xs text-gray-300 focus:outline-none focus:border-moto-red disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="">{selectedBrand ? 'Todos los modelos' : 'Selecciona marca primero'}</option>
                {availableModels.map(bike => (
                  <option key={bike.model} value={bike.model}>{bike.model}</option>
                ))}
              </select>
            </div>

            {/* CC displacement category query */}
            <div className="space-y-1.5">
              <label htmlFor="filter-cc" className="text-[11px] font-mono text-gray-400 uppercase">Cilindraje (CC)</label>
              <select
                id="filter-cc"
                value={selectedCc}
                onChange={(e) => setSelectedCc(e.target.value)}
                className="w-full bg-matte-950 border border-matte-800 px-3 py-2 rounded-lg text-xs text-gray-300 focus:outline-none focus:border-moto-red"
              >
                <option value="">Todos los CC</option>
                <option value="low">Motores Chicos (≤ 250cc)</option>
                <option value="mid">Motores Medianos (251cc - 500cc)</option>
                <option value="high">Alta Cilindrada (&gt; 500cc)</option>
              </select>
            </div>

            {/* Year slider compatibility */}
            <div className="space-y-1.5">
              <label htmlFor="filter-year" className="text-[11px] font-mono text-gray-400 uppercase">Año Moto</label>
              <select
                id="filter-year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-matte-950 border border-matte-800 px-3 py-2 rounded-lg text-xs text-gray-300 focus:outline-none focus:border-moto-red"
              >
                <option value="">Cualquier año</option>
                {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            {/* Spare Part Category Selector */}
            <div className="space-y-1.5">
              <label htmlFor="filter-part-category" className="text-[11px] font-mono text-gray-400 uppercase">Categoría Repuesto</label>
              <select
                id="filter-part-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-matte-950 border border-matte-800 px-3 py-2 rounded-lg text-xs text-gray-300 focus:outline-none focus:border-moto-red"
              >
                <option value="">Cualquier tipo</option>
                {SPARE_PART_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Small info block */}
            <div className="p-3.5 bg-matte-950 rounded-xl border border-matte-800 text-[11px] text-gray-400 leading-normal font-light space-y-1">
              <span className="font-semibold text-white block">Aviso de Compatibilidad:</span>
              <span>Todos los precios mostrados representan cotizaciones estimadas brutas provistas en tiempo real por el sistema ERP del taller.</span>
            </div>
          </div>

          {/* MAIN COLUMN: Search Map (HUD) & Parts Listing */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* 1. HUD DYNAMIC BLUEPRINT MAP TALLER SELECTOR */}
            <div className="bg-matte-900 border border-matte-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-matte-800 flex justify-between items-center bg-matte-900/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 glow-active"></span>
                  <span className="text-xs font-mono font-medium text-white uppercase">Radar de Talleres Cercanos</span>
                </div>
                {currentSelectedWorkshopCoordinates && (
                  <div className="text-[10px] font-mono text-gray-400 flex items-center gap-2">
                    <span>Foco: <strong className="text-white">{currentSelectedWorkshopCoordinates.name}</strong></span>
                    <span className="text-gray-600">|</span>
                    <span className="text-moto-red">{currentSelectedWorkshopCoordinates.address}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* Visual Map Render (Vector Canvas styled as Blueprint grid) */}
                <div className="md:col-span-8 h-64 md:h-80 bg-matte-950 border-r border-matte-800 relative select-none overflow-hidden flex items-center justify-center">
                  
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 blueprint-bg opacity-30 pointer-events-none"></div>

                  {/* Concentric Radar Circles */}
                  <div className="absolute w-[350px] h-[350px] rounded-full border border-gray-800/20 flex items-center justify-center animate-pulse pointer-events-none">
                    <div className="w-[200px] h-[200px] rounded-full border border-gray-800/40 flex items-center justify-center">
                      <div className="w-[100px] h-[100px] rounded-full border border-gray-800/60"></div>
                    </div>
                  </div>

                  {/* Axis Crosshairs */}
                  <div className="absolute w-full h-[1px] bg-gray-800/25 pointer-events-none"></div>
                  <div className="absolute w-[1px] h-full bg-gray-800/25 pointer-events-none"></div>

                  {/* Interactive Workshop Pulsating Pins */}
                  {workshopsState.map((w, index) => {
                    // Predefined aesthetic coordinate shifts around center offsets
                    // W-01: center (x: 45%, y: 40%)
                    // W-02: left-down (x: 20%, y: 65%)
                    // W-03: right-up (x: 75%, y: 25%)
                    const positions = [
                      { x: '45%', y: '40%', color: 'border-moto-red text-moto-red' },
                      { x: '20%', y: '65%', color: 'border-moto-blue text-moto-blue' },
                      { x: '75%', y: '25%', color: 'border-amber-500 text-amber-500' }
                    ];
                    const pos = positions[index % positions.length];
                    const isSelected = selectedMapWorkshop === w.id;

                    return (
                      <button
                        key={w.id}
                        onClick={() => setSelectedMapWorkshop(w.id)}
                        className="absolute group transition-transform duration-300"
                        style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
                      >
                        {/* Selected outline wave radiating */}
                        {isSelected && (
                          <span className="absolute -inset-4 rounded-full border border-white/10 bg-white/2 animate-ping" style={{ animationDuration: '3s' }}></span>
                        )}

                        <div className={`p-1.5 rounded-lg border bg-matte-950 shadow-2xl flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected ? 'border-white ring-2 ring-moto-red scale-110 z-20' : 'border-matte-800 hover:border-gray-500'
                        }`}>
                          <div className={`w-2.5 h-2.5 rounded-full animate-pulse bg-current ${pos.color}`}></div>
                          <span className="text-[10px] font-mono font-bold text-white max-w-[90px] truncate">{w.name.split(' ')[0]}</span>
                        </div>

                        {/* Drop Pins Tooltip */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-matte-900 border border-matte-800 shadow-2xl px-2 py-1 rounded text-[9px] font-mono opacity-0 group-hover:opacity-100 transition pointer-events-none z-30 space-y-0.5">
                          <p className="text-white font-bold">{w.name}</p>
                          <p className="text-gray-400">Distancia: {w.distance}</p>
                          <p className="text-yellow-500 text-[8px]">★ {w.rating} • {w.reviewsCount} reviews</p>
                        </div>
                      </button>
                    );
                  })}

                  {/* Floating Map Hud Indicator */}
                  <div className="absolute top-3 left-3 bg-matte-900/90 border border-matte-800 shadow px-2.5 py-1 rounded text-[10px] font-mono pointer-events-none flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-moto-red animate-spin" style={{ animationDuration: '8s' }} />
                    <span>GPS LAT: 34.58° S | LON: 58.43° W</span>
                  </div>
                </div>

                {/* Workshops List Sidebar within Map widget */}
                <div className="md:col-span-4 max-h-[320px] overflow-y-auto divide-y divide-matte-800 bg-matte-900/60">
                  <div className="p-3 bg-matte-950 border-b border-matte-800 font-mono text-[10px] text-gray-500 uppercase tracking-widest leading-none">
                    Talleres mecánicos
                  </div>
                  {workshopsState.map((w) => {
                    const isSelected = selectedMapWorkshop === w.id;
                    return (
                      <button
                        key={w.id}
                        onClick={() => setSelectedMapWorkshop(w.id)}
                        className={`w-full text-left p-3.5 space-y-1.5 transition-colors block cursor-pointer ${
                          isSelected ? 'bg-matte-950 font-medium' : 'hover:bg-matte-900'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white line-clamp-1">{w.name}</span>
                          <span className="text-[10px] font-mono text-moto-red font-semibold shrink-0 bg-red-950/20 px-1.5 py-0.5 rounded border border-red-900/30">
                            {w.distance}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 line-clamp-1 font-light leading-none">{w.address}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] font-mono text-yellow-500 flex items-center gap-px shrink-0">
                            ★ {w.rating}
                          </span>
                          <span className="text-[9px] font-mono text-gray-500">({w.reviewsCount} reseñas)</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* 2. PARTS INVENTORY GRID OR LIST RESULTS */}
            <div className="space-y-4">
              
              {/* List stats header control */}
              <div className="flex justify-between items-center">
                <div className="text-xs font-mono text-gray-400">
                  Encontrados <strong className="text-white">{filteredParts.length}</strong> repuestos con stock coincidente
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg border transition ${
                      viewMode === 'grid' ? 'bg-matte-800 border-matte-700 text-white' : 'border-matte-800 text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg border transition ${
                      viewMode === 'list' ? 'bg-matte-800 border-matte-700 text-white' : 'border-matte-800 text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* EMPTY STATE CASE */}
              {filteredParts.length === 0 && (
                <div className="p-12 text-center rounded-2xl bg-matte-900 border border-matte-800 space-y-4 transition-all max-w-xl mx-auto">
                  <div className="w-12 h-12 bg-matte-950 border border-matte-800 rounded-xl flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-6 h-6 text-moto-red" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">Sin correlaciones de stock</h3>
                    <p className="text-xs text-gray-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                      No encontramos repuestos que cumplan con la marca, modelo, CC o palabra clave introducida. Intenta ampliar tus filtros.
                    </p>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-matte-950 hover:bg-matte-800 border border-matte-800 hover:border-matte-700 transition rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Ver Todo el Stock
                  </button>
                </div>
              )}

              {/* GRID MODE PRESENTATION */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredParts.map((part) => {
                    const sellingWorkshop = workshopsState.find(w => w.id === part.workshopId) || workshopsState[0];
                    const isLowStock = part.stock <= part.minStock;

                    return (
                      <div 
                        key={part.id}
                        id={`part-card-${part.id}`}
                        className="bento-card p-5 shadow-xl flex flex-col justify-between hover:border-matte-700 space-y-4"
                      >
                        <div className="space-y-3">
                          {/* Part Heading Brand badge */}
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">{part.category}</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              isLowStock 
                                ? 'bg-amber-950/40 text-amber-500 border-amber-900/30' 
                                : 'bg-green-950/30 text-green-500 border-green-900/20'
                            }`}>
                              {part.stock} disp.
                            </span>
                          </div>

                          {/* Image and Name */}
                          <div className="flex items-start gap-3">
                            <img 
                              src={part.imageUrl} 
                              alt={part.name}
                              referrerPolicy="no-referrer"
                              className="w-14 h-14 object-cover rounded-xl border border-matte-800 shrink-0" 
                            />
                            <div>
                              <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">{part.name}</h4>
                              <p className="text-[10px] font-mono text-gray-500 mt-1">SKU: {part.sku}</p>
                            </div>
                          </div>

                          {/* Compatibility Badge List */}
                          <div className="pt-1.5 space-y-1">
                            <span className="text-[9px] font-mono text-gray-500 uppercase block">Compatibilidad:</span>
                            <div className="flex flex-wrap gap-1">
                              {part.modelCompatibility.map(model => (
                                <span key={model} className="text-[9px] font-mono bg-matte-950 border border-matte-800 text-gray-300 px-1.5 py-0.5 rounded">
                                  {model}
                                </span>
                              ))}
                              <span className="text-[9px] font-mono bg-red-950/30 border border-red-900/20 text-moto-red px-1.5 py-0.5 rounded">
                                {part.compatibilityRange.brand} {part.compatibilityRange.yearStart}-{part.compatibilityRange.yearEnd}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action section: Price and shop contact */}
                        <div className="pt-2 border-t border-matte-800 space-y-3">
                          
                          {/* Workshop Details selling it */}
                          <button
                            onClick={() => onNavigateToWorkshop(sellingWorkshop.id)}
                            className="w-full text-left p-2.5 rounded-xl bg-matte-950 border border-matte-800/80 hover:border-matte-600 transition flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <img 
                                src={sellingWorkshop.avatar} 
                                alt={sellingWorkshop.name}
                                referrerPolicy="no-referrer"
                                className="w-6 h-6 object-cover rounded" 
                              />
                              <div>
                                <p className="text-xs font-semibold text-white group-hover:text-moto-red transition-colors">{sellingWorkshop.name}</p>
                                <p className="text-[10px] text-gray-500">{sellingWorkshop.address} • {sellingWorkshop.distance}</p>
                              </div>
                            </div>
                            <ExternalLink className="w-3 h-3 text-gray-500" />
                          </button>

                          <div className="flex justify-between items-center gap-2">
                            <div>
                              <span className="text-[10px] font-mono text-gray-500 block">PRECIO STOCK ERP</span>
                              <span className="text-base font-extrabold text-white font-mono">${part.price.toLocaleString('es-AR')} ARS</span>
                            </div>

                            <a
                              href={`${sellingWorkshop.whatsapp}&text=Hola!%20Busco%20la%20pieza%20${encodeURIComponent(part.name)}%20(SKU:%20${part.sku})%20en%20su%20sucursal%20de%20${encodeURIComponent(sellingWorkshop.address)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-green-950 hover:bg-green-900 border border-green-800/70 text-green-400 font-semibold text-xs flex items-center gap-1 cursor-pointer transition shadow"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              WSP
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                
                /* LIST PRESENTATION MODE */
                <div className="bg-matte-900 border border-matte-800 rounded-2xl overflow-hidden shadow-lg divide-y divide-matte-800">
                  {filteredParts.map((part) => {
                    const sellingWorkshop = workshopsState.find(w => w.id === part.workshopId) || workshopsState[0];
                    const isLowStock = part.stock <= part.minStock;

                    return (
                      <div 
                        key={part.id}
                        className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-matte-950/65 transition duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <img 
                            src={part.imageUrl} 
                            alt={part.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded-xl border border-matte-800 shrink-0" 
                          />
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-xs font-bold text-white">{part.name}</h4>
                              <span className="text-[9px] font-mono bg-matte-950 text-gray-500 px-1.5 py-0.2 rounded border border-matte-800">
                                {part.sku}
                              </span>
                              <span className="text-[9px] font-mono text-gray-400 bg-matte-800 px-1.5 rounded">
                                {part.category}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 items-center">
                              <span className="text-[9px] font-mono text-gray-500">Motos compatibles:</span>
                              <span className="text-[9px] font-mono text-moto-red">{part.compatibilityRange.brand}</span>
                              {part.modelCompatibility.slice(0, 3).map(model => (
                                <span key={model} className="text-[9px] font-mono bg-matte-950 text-gray-400 px-1.5 rounded border border-matte-800">
                                  {model}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end shrink-0 border-t md:border-0 border-matte-800 pt-2.5 md:pt-0">
                          {/* Workshop info */}
                          <div className="text-left md:text-right">
                            <button
                              onClick={() => onNavigateToWorkshop(sellingWorkshop.id)}
                              className="text-xs font-semibold text-white hover:text-moto-red transition block"
                            >
                              📍 {sellingWorkshop.name}
                            </button>
                            <span className="text-[10px] text-gray-500 block">{sellingWorkshop.address} • {sellingWorkshop.distance}</span>
                          </div>

                          <div className="space-y-0.5 text-center">
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded block ${
                              isLowStock ? 'bg-amber-950/40 text-amber-500' : 'bg-green-950/20 text-green-500'
                            }`}>
                              {part.stock} disp.
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-sm font-extrabold text-white font-mono">${part.price.toLocaleString('es-AR')}</span>
                            <a
                              href={`${sellingWorkshop.whatsapp}&text=Hola!%20Busco%20${encodeURIComponent(part.name)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg bg-green-950 hover:bg-green-900 border border-green-800 text-green-400 flex items-center justify-center cursor-pointer transition shadow"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
