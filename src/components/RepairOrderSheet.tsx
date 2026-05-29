import React, { useState, useMemo } from 'react';
import { Clock, CheckSquare, Plus, Trash, ShieldCheck, Download, Camera, ChevronRight, AlertCircle, PlayCircle, Clipboard, DollarSign } from 'lucide-react';
import { RepairOrder, Part, Motorcycle, RepairItem } from '../types';

interface RepairOrderSheetProps {
  repairsState: RepairOrder[];
  partsState: Part[];
  motorcyclesState: Motorcycle[];
  onUpdateRepairStatus: (id: string, status: RepairOrder['status']) => void;
  onAddRepairItem: (id: string, item: RepairItem) => void;
  onRemoveRepairItem: (id: string, itemIndex: number) => void;
  onAddTimelineEvent: (id: string, title: string, desc: string) => void;
  selectedRepairId: string | null;
  onSelectRepairOrder: (id: string) => void;
}

export default function RepairOrderSheet({
  repairsState,
  partsState,
  motorcyclesState,
  onUpdateRepairStatus,
  onAddRepairItem,
  onRemoveRepairItem,
  onAddTimelineEvent,
  selectedRepairId,
  onSelectRepairOrder
}: RepairOrderSheetProps) {

  // Selected Order
  const activeOrder = useMemo(() => {
    return repairsState.find(r => r.id === (selectedRepairId || repairsState[0]?.id));
  }, [repairsState, selectedRepairId]);

  // Selected Bike details linked
  const activeBike = useMemo(() => {
    if (!activeOrder) return null;
    return motorcyclesState.find(m => m.id === activeOrder.motorcycleId) || null;
  }, [activeOrder, motorcyclesState]);

  // Parts search autocomplete helper inside document sheet
  const [partQuery, setPartQuery] = useState('');
  const [showPartDropdown, setShowPartDropdown] = useState(false);

  // Filter parts search to matches in workshop
  const autocompletePartsList = useMemo(() => {
    if (!partQuery) return [];
    const queryLower = partQuery.toLowerCase();
    return partsState.filter(p => 
      p.stock > 0 && 
      (p.name.toLowerCase().includes(queryLower) || p.sku.toLowerCase().includes(queryLower) || p.brand.toLowerCase().includes(queryLower))
    );
  }, [partsState, partQuery]);

  // Labor task manual inputs
  const [laborName, setLaborName] = useState('');
  const [laborPrice, setLaborPrice] = useState('');

  // Custom timeline addition inputs
  const [timelineTitle, setTimelineTitle] = useState('');
  const [timelineDesc, setTimelineDesc] = useState('');

  // Diagnostic sub-tasks completion controls inside view
  const [completedSubtasks, setCompletedSubtasks] = useState<Record<string, boolean>>({
    diagnoseDone: true,
    oilChange: false,
    fluidsPurged: false,
    valvesAdjusted: false,
    testDriveOk: false
  });

  const toggleSubtask = (key: string) => {
    setCompletedSubtasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Add parts from autocomplete select
  const handleSelectAutocompletePart = (part: Part) => {
    if (!activeOrder) return;
    onAddRepairItem(activeOrder.id, {
      partId: part.id,
      name: part.name,
      quantity: 1,
      unitPrice: part.price,
      type: 'part'
    });
    setPartQuery('');
    setShowPartDropdown(false);
  };

  // Add custom labor item
  const handleAddCustomLabor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder || !laborName || !laborPrice) return;
    onAddRepairItem(activeOrder.id, {
      name: laborName,
      quantity: 1,
      unitPrice: Math.max(0, parseInt(laborPrice) || 0),
      type: 'labor'
    });
    setLaborName('');
    setLaborPrice('');
  };

  // Add custom manual timeline update log
  const handleAddTimelineUpdateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder || !timelineTitle || !timelineDesc) return;
    onAddTimelineEvent(activeOrder.id, timelineTitle, timelineDesc);
    setTimelineTitle('');
    setTimelineDesc('');
  };

  // Calculate totals
  const billingCalculations = useMemo(() => {
    if (!activeOrder) return { partsTotal: 0, laborTotal: 0, grandTotal: 0 };
    
    let partsTotal = 0;
    let laborTotal = 0;

    activeOrder.items.forEach(item => {
      const sum = item.unitPrice * item.quantity;
      if (item.type === 'part') partsTotal += sum;
      else laborTotal += sum;
    });

    const grandTotal = partsTotal + laborTotal;
    return { partsTotal, laborTotal, grandTotal };
  }, [activeOrder]);

  if (!activeOrder) {
    return (
      <div className="py-20 text-center text-gray-500 font-mono text-xs">
        <Clipboard className="w-12 h-12 mx-auto text-gray-700 mb-4 animate-pulse" />
        No hay órdenes de reparación registradas en el sistema.
      </div>
    );
  }

  // Predefined states metadata
  const STAT_NODES: { key: RepairOrder['status']; label: string; details: string; color: string }[] = [
    { key: 'ingress', label: 'Ingreso', details: 'Ficha creada', color: 'border-gray-800 text-gray-400' },
    { key: 'diagnosing', label: 'Diagnóstico', details: 'Scanner conectado', color: 'border-blue-900 text-sky-400' },
    { key: 'waiting_parts', label: 'Espera Repuestos', details: 'Trámite de stock', color: 'border-amber-900 text-amber-500' },
    { key: 'repairing', label: 'Reparación', details: 'Trabajo mecánico', color: 'border-red-900 text-moto-red' },
    { key: 'completed', label: 'Completo', details: 'Test ride aprobado', color: 'border-green-905 text-green-500' },
    { key: 'delivered', label: 'Entregado', details: 'Vehículo retirado', color: 'border-violet-900 text-violet-400' }
  ];

  return (
    <div className="w-full blueprint-bg bg-matte-950 text-gray-100 min-h-screen pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Master Selector tabs of active tickets */}
        <div className="bg-matte-900 border border-matte-800 rounded-2xl p-4 flex flex-wrap gap-2 items-center shadow-lg">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block pr-3">Órdenes Activas:</span>
          {repairsState.map((ro) => {
            const isSelected = ro.id === activeOrder.id;
            const b = motorcyclesState.find(m => m.id === ro.motorcycleId) || { plate: '???', brand: 'Desconocido', model: 'Moto' };
            return (
              <button
                key={ro.id}
                onClick={() => onSelectRepairOrder(ro.id)}
                id={`ro-tab-${ro.id}`}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition cursor-pointer flex items-center gap-2 ${
                  isSelected 
                    ? 'bg-matte-950 border-moto-red text-white font-bold' 
                    : 'border-matte-800 text-gray-500 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-moto-red' : 'bg-gray-600'}`}></span>
                {ro.orderNumber} • {b.brand} {b.model}
              </button>
            );
          })}
        </div>

        {/* Dynamic header order number showing progress state */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-3 border-b border-matte-800">
          <div>
            <span className="text-xs font-mono text-moto-red uppercase tracking-wider">{activeOrder.orderNumber} • Fichaje Técnico</span>
            <h2 className="text-2xl font-extrabold text-white">
              {activeBike ? `${activeBike.brand} ${activeBike.model} (${activeBike.year})` : 'Carga General O.R.'}
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Patente: <strong className="text-white font-mono">{activeBike?.plate}</strong> • Kilometraje: {activeBike?.mileage} km • Cliente: {activeOrder.clientName}
            </p>
          </div>

          <button
            onClick={() => alert('Generando PDF fiscal para orden ' + activeOrder.orderNumber + '...\nSe simula la descarga de la factura de forma exitosa.')}
            className="px-4 py-2 bg-matte-900 hover:bg-matte-800 border border-matte-800 font-semibold text-xs text-indigo-400 hover:text-indigo-300 rounded-lg cursor-pointer transition flex items-center gap-1.5 shadow"
          >
            <Download className="w-4 h-4" /> Comprobante PDF (SaaS)
          </button>
        </div>

        {/* 1. INTERACTIVE WORK FLOW STATUS TRACKER BAR */}
        <div className="bg-matte-900 border border-matte-800 rounded-2xl p-5 shadow-xl space-y-4">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block leading-none">
            Panel de Tránsito de Estado (Hacer clic sobre los nodos para transicionar)
          </span>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
            {STAT_NODES.map((node) => {
              const isActive = activeOrder.status === node.key;
              return (
                <button
                  key={node.key}
                  onClick={() => onUpdateRepairStatus(activeOrder.id, node.key)}
                  id={`stat-node-${node.key}`}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition duration-200 group-all relative overflow-hidden ${
                    isActive 
                      ? 'bg-matte-950 border-white text-white font-bold ring-2 ring-moto-blue' 
                      : 'border-matte-800 hover:border-gray-700 bg-matte-950/40 text-gray-500'
                  }`}
                >
                  {/* Selected accent bottom indicator bar */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-moto-red animate-pulse"></div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-moto-red animate-pulse' : 'bg-current'}`}></span>
                    <span className="text-xs transition-colors group-hover:text-white leading-none block">{node.label}</span>
                  </div>
                  <span className="text-[9px] font-mono font-normal text-gray-500 mt-1 block group-all:hover:text-gray-400">
                    {node.details}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Master columns split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Items additions and calculations totals */}
          <div className="lg:col-span-8 space-y-6">

            {/* Checklist items list detailed card */}
            <div className="bg-matte-900 border border-matte-800 rounded-2xl p-5 shadow-xl space-y-5">
              
              <div className="flex justify-between items-center border-b border-matte-800 pb-3">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-tight flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-moto-red" />
                  Garantía y Detalle de Conceptos Facturados
                </span>
                <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">{activeOrder.items.length} Conceptos</span>
              </div>

              {/* Autocomplete spare parts selection tool */}
              <div className="space-y-2 relative">
                <label className="text-[10.5px] font-mono font-bold text-gray-400 uppercase">Añadir repuestos del stock (Escribe palabra clave)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">🔍</span>
                  <input
                    type="text"
                    id="order-add-part-search"
                    placeholder="Escribe 'pastillas', 'filtro', 'aceite', 'bomba'..."
                    value={partQuery}
                    onChange={(e) => {
                      setPartQuery(e.target.value);
                      setShowPartDropdown(true);
                    }}
                    onFocus={() => setShowPartDropdown(true)}
                    className="w-full bg-matte-950 border border-matte-800 text-xs rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-moto-red"
                  />
                </div>

                {/* Autocomplete Dropdown list */}
                {showPartDropdown && autocompletePartsList.length > 0 && (
                  <div className="absolute z-20 top-full left-0 right-0 bg-matte-950 border border-matte-800 rounded-lg shadow-2xl overflow-hidden divide-y divide-matte-800 max-h-[160px] overflow-y-auto mt-1">
                    {autocompletePartsList.map((part) => (
                      <button
                        key={part.id}
                        onClick={() => handleSelectAutocompletePart(part)}
                        type="button"
                        className="w-full text-left px-3.5 py-3 hover:bg-matte-900 text-xs flex justify-between items-center transition-colors cursor-pointer"
                      >
                        <div className="space-y-0.5">
                          <p className="text-white font-bold">{part.name}</p>
                          <p className="text-[9px] text-gray-500 font-mono">
                            SKU {part.sku} • {part.shelfLocation} • Compatible: {part.compatibilityRange.brand}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-mono font-bold text-emerald-500 bg-green-950/20 px-2 py-0.5 rounded mr-2 shrink-0">
                            {part.stock} u.
                          </span>
                          <span className="font-mono font-bold text-white font-semibold">${part.price.toLocaleString('es-AR')}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bill Items Rows table */}
              <div className="divide-y divide-matte-800 text-xs">
                {activeOrder.items.length === 0 ? (
                  <div className="py-8 text-center text-gray-500 text-light italic">
                    Sin repuestos ni mano de obra cargados todavía. Utiliza el buscador superior para agregar consumibles.
                  </div>
                ) : (
                  activeOrder.items.map((item, index) => (
                    <div key={index} className="py-3 flex items-center justify-between gap-4 group">
                      <div className="flex items-start gap-2 max-w-[70%]">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border mt-0.5 uppercase shrink-0 font-bold ${
                          item.type === 'part' 
                            ? 'bg-blue-950/30 text-moto-blue border-blue-900/30' 
                            : 'bg-rose-950/30 text-moto-red border-rose-900/30'
                        }`}>
                          {item.type === 'part' ? 'Repuesto' : 'Mano Obra'}
                        </span>
                        
                        <div className="space-y-0.5">
                          <p className="text-white font-bold leading-snug">{item.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            {item.quantity} {item.quantity === 1 ? 'unidad' : 'unidades'} • unitario: ${item.unitPrice.toLocaleString('es-AR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-mono font-bold text-white text-xs">
                          ${(item.unitPrice * item.quantity).toLocaleString('es-AR')}
                        </span>
                        
                        <button
                          onClick={() => onRemoveRepairItem(activeOrder.id, index)}
                          className="text-gray-600 hover:text-rose-500 p-1 rounded transition opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Remover pieza de la órden de trabajo"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Manual labor cost element addition */}
              <form onSubmit={handleAddCustomLabor} className="pt-3.5 border-t border-matte-800 grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-7 space-y-1">
                  <label htmlFor="form-labor-name" className="text-[10px] font-mono text-gray-500 uppercase">Detalle Mano de obra / Tarea</label>
                  <input
                    type="text"
                    id="form-labor-name"
                    required
                    value={laborName}
                    onChange={(e) => setLaborName(e.target.value)}
                    placeholder="Ej. Control de reglaje de válvulas e inyectores"
                    className="w-full bg-matte-950 border border-matte-800 rounded-lg p-2 text-xs focus:ring-0 text-white"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label htmlFor="form-labor-price" className="text-[10px] font-mono text-gray-500 uppercase">Precio ARS</label>
                  <input
                    type="number"
                    id="form-labor-price"
                    required
                    min="0"
                    placeholder="12000"
                    value={laborPrice}
                    onChange={(e) => setLaborPrice(e.target.value)}
                    className="w-full bg-matte-950 border border-matte-800 rounded-lg p-2 text-xs focus:ring-0 text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 bg-matte-950 hover:bg-matte-800 text-white border border-matte-800 hover:border-gray-600 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-1 leading-none"
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={3} /> Añadir
                  </button>
                </div>
              </form>

            </div>

            {/* Ingress diagnostics text summary detailed checklist card */}
            <div className="bg-matte-900 border border-matte-800 rounded-2xl p-5 shadow-xl space-y-4">
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-tight block">
                Comentarios de Admisión & Notas del Taller
              </span>
              <p className="text-xs text-gray-300 bg-matte-950 rounded-xl p-4 border border-matte-800 font-sans leading-relaxed">
                {activeOrder.notes || 'No hay anotaciones mecánicas anexas cargadas para esta orden.'}
              </p>
              
              {/* Internal diagnostics validation process checkbox list */}
              <div className="grid grid-cols-2 csm:grid-cols-3 gap-2.5 pt-1 text-xs">
                {[
                  { key: 'diagnoseDone', label: 'Escanear Diagnóstico OK' },
                  { key: 'oilChange', label: 'Cambio de Aceite & Filtro' },
                  { key: 'fluidsPurged', label: 'Purgado Líquidos Completo' },
                  { key: 'valvesAdjusted', label: 'Calibrar Reglaje Válvulas' },
                  { key: 'testDriveOk', label: 'Test Ride de Calle Aprobado' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-400 select-none">
                    <input
                      type="checkbox"
                      checked={completedSubtasks[item.key] || false}
                      onChange={() => toggleSubtask(item.key)}
                      className="rounded text-moto-red bg-matte-950 border-gray-800 focus:ring-0 w-3.5 h-3.5"
                    />
                    <span className={completedSubtasks[item.key] ? 'line-through text-gray-600' : ''}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: High-fidelity vertical timeline & dynamic totals aggregate */}
          <div className="lg:col-span-4 space-y-6">

            {/* Invoice invoice billing totals widget panel */}
            <div className="bg-matte-900 border border-matte-800 rounded-2xl p-5 shadow-xl space-y-4">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block leading-none">
                Resumen Cobros ERP
              </span>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Repuestos Asignados</span>
                  <span className="font-mono">${billingCalculations.partsTotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Mano de obra (Calibrada)</span>
                  <span className="font-mono">${billingCalculations.laborTotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 font-mono text-[10px] border-t border-matte-800 pt-2">
                  <span>Impuestos Estimados (IVA 21%)</span>
                  <span>Incluido</span>
                </div>
                <div className="flex justify-between items-end border-t border-matte-800 pt-3">
                  <span className="text-white font-bold">Resumen TOTAL</span>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 font-mono block leading-none pb-1">Pesos Argentinos</span>
                    <span className="text-lg font-extrabold text-white font-mono leading-none">
                      ${billingCalculations.grandTotal.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive vertical timeline */}
            <div className="bg-matte-900 border border-matte-800 rounded-2xl p-5 shadow-xl space-y-4">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block leading-none mb-1">
                Línea de Tiempo de Reparación ({activeOrder.timeline.length})
              </span>

              {/* Vertical feed graphics */}
              <div className="relative pl-3.5 border-l border-matte-800 space-y-4 max-h-[200px] overflow-y-auto pr-1">
                {activeOrder.timeline.map((event) => (
                  <div key={event.id} className="relative text-xs space-y-1">
                    {/* Ring indicator */}
                    <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full border border-matte-900 bg-moto-red"></span>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-gray-500 font-mono">
                      <span>{new Date(event.date).toLocaleDateString('es-AR')} {new Date(event.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-moto-blue text-[8px] uppercase">R_BY {event.updatedBy}</span>
                    </div>
                    
                    <h5 className="font-bold text-white text-[11px] leading-tight">{event.title}</h5>
                    <p className="text-gray-400 font-light text-[10px] leading-relaxed">{event.description}</p>
                  </div>
                ))}
              </div>

              {/* Event poster logger form */}
              <form onSubmit={handleAddTimelineUpdateLog} className="pt-3 border-t border-matte-800 space-y-2.5 text-xs">
                <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Publicar Avance Tecnológico</p>
                
                <input
                  type="text"
                  required
                  placeholder="Título breve del hito (ej. Limpieza inyección)"
                  value={timelineTitle}
                  onChange={(e) => setTimelineTitle(e.target.value)}
                  className="w-full bg-matte-950 border border-matte-800 rounded-lg p-2 text-xs focus:ring-0 text-white"
                />

                <textarea
                  required
                  rows={2}
                  placeholder="Descripción detallada de pruebas de comportamiento..."
                  value={timelineDesc}
                  onChange={(e) => setTimelineDesc(e.target.value)}
                  className="w-full bg-matte-950 border border-matte-800 rounded-lg p-2 text-xs focus:ring-0 text-white leading-relaxed"
                />

                <button
                  type="submit"
                  className="w-full py-2 bg-matte-950 hover:bg-matte-800 text-moto-red border border-matte-800 hover:border-gray-500 rounded-lg font-bold text-xs cursor-pointer transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} /> Registrar Avance Digital
                </button>
              </form>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
