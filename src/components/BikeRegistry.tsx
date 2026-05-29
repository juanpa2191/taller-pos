import React, { useState, useMemo } from 'react';
import { FileText, User, ShieldCheck, Camera, CheckCircle2, ChevronRight, AlertCircle, Wrench } from 'lucide-react';
import { Motorcycle } from '../types';
import { MOTORCYCLE_BRANDS, BIKE_MODELS_BY_BRAND } from '../data';

interface BikeRegistryProps {
  onRegisterBike: (bikeData: Omit<Motorcycle, 'id'>) => void;
}

export default function BikeRegistry({
  onRegisterBike
}: BikeRegistryProps) {
  // Client personal details inputs
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');

  // Bike specs inputs
  const [plate, setPlate] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(MOTORCYCLE_BRANDS[0]);
  const [selectedModel, setSelectedModel] = useState('');
  const [year, setYear] = useState('2022');
  const [mileage, setMileage] = useState('');
  
  // Dynamic generated issue details
  const [diagnosticsMemo, setDiagnosticsMemo] = useState('');
  
  // Diagnostics interactive checklist helper
  const [isCheckedList, setIsCheckedList] = useState<Record<string, boolean>>({
    engineNoise: false,
    fluidLeak: false,
    chainStretched: false,
    brakeLoose: false,
    suspensionBent: false,
    electricalFails: false
  });

  // Simulated image preview state array
  const mockIngressPhotos = [
    'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=500&auto=format&fit=crop&q=80'
  ];
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Auto populate available models based on selected brand
  const compatibleModels = useMemo(() => {
    return BIKE_MODELS_BY_BRAND[selectedBrand] || [];
  }, [selectedBrand]);

  // Set first model when brand changes
  React.useEffect(() => {
    if (compatibleModels.length > 0) {
      setSelectedModel(compatibleModels[0].model);
    }
  }, [selectedBrand, compatibleModels]);

  // Update written diagnosis based on checklists state
  const handleToggleChecklist = (key: string, label: string) => {
    setIsCheckedList(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      
      // Compile written string based on checked indicators
      const parts: string[] = [];
      if (updated.engineNoise) parts.push('Se reporta golpeteo metálico en válvulas durante ralentí.');
      if (updated.fluidLeak) parts.push('Pérdidas visibles de líquido refrigerante bajo radiador primario.');
      if (updated.chainStretched) parts.push('Cadena estirada al máximo sin margen de regulación, piñón afilado.');
      if (updated.brakeLoose) parts.push('Manillar delantero largo y esponjoso, requiere control de pistones.');
      if (updated.suspensionBent) parts.push('Dirección tirando hacia la izquierda tras caída amortiguada.');
      if (updated.electricalFails) parts.push('Testigo de inyección check engine se enciende superando 4000 RPM.');

      setDiagnosticsMemo(parts.join('\n'));
      return updated;
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !plate || !selectedModel || !mileage) {
      alert('Por favor completa los campos obligatorios (*) del ingreso.');
      return;
    }

    const matchedBikeSpec = compatibleModels.find(m => m.model === selectedModel);
    const calculatedCc = matchedBikeSpec ? matchedBikeSpec.cc : 250;

    onRegisterBike({
      plate: plate.toUpperCase(),
      brand: selectedBrand,
      model: selectedModel,
      year: parseInt(year) || 2022,
      cc: calculatedCc,
      mileage: parseInt(mileage) || 1000,
      ownerName,
      ownerPhone: ownerPhone || '+5491100000000',
      ownerEmail: ownerEmail || 'guest@motosaas.com',
      diagnostics: diagnosticsMemo || 'Ingresa por revisión general de kilometraje. Sin fallas mecánicas aparentes señaladas por el dueño.',
      entryDate: new Date().toISOString(),
      imageUrl: mockIngressPhotos[activePhotoIdx]
    });

    // Reset Form fields
    setOwnerName('');
    setOwnerPhone('');
    setOwnerEmail('');
    setPlate('');
    setMileage('');
    setDiagnosticsMemo('');
    setIsCheckedList({
      engineNoise: false,
      fluidLeak: false,
      chainStretched: false,
      brakeLoose: false,
      suspensionBent: false,
      electricalFails: false
    });
  };

  return (
    <div className="w-full blueprint-bg bg-matte-950 text-gray-100 min-h-screen pt-4 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Module Title Header header */}
        <div className="py-4 border-b border-matte-800">
          <div className="flex items-center gap-1.5 text-xs text-moto-red font-mono uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4 animate-bounce" />
            <span>Registro de Admisión Electrónica</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Ingresar Motocicleta al Taller</h1>
          <p className="text-gray-400 text-xs font-light">
            Crea la ficha del cliente, asocia los detalles técnicos del vehículo y genera de forma automática una nueva orden de servicio vinculada.
          </p>
        </div>

        {/* Master Registry Form block */}
        <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* L: Ingress Text Entries Panel */}
          <div className="md:col-span-8 bg-matte-900 border border-matte-800 rounded-2xl p-6 space-y-6 shadow-xl text-xs">
            
            {/* Subsection 1: Client details */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold text-moto-red uppercase tracking-wider flex items-center gap-1.5 border-b border-matte-800 pb-2">
                <User className="w-3.5 h-3.5" />
                1. Información del Propietario
              </span>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="reg-owner-name" className="text-gray-400 font-semibold block">Nombre Completo del Cliente *</label>
                  <input
                    type="text"
                    id="reg-owner-name"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Ej. Ignacio Garmendia"
                    className="w-full bg-matte-950 border border-matte-800 focus:border-moto-red text-white p-2.5 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="reg-owner-phone" className="text-gray-400 font-semibold block">Teléfono de contacto</label>
                    <input
                      type="tel"
                      id="reg-owner-phone"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="Ej. +54 9 11 6655 4433"
                      className="w-full bg-matte-950 border border-matte-800 focus:border-moto-red text-white p-2.5 rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="reg-owner-email" className="text-gray-400 font-semibold block">Correo electrónico</label>
                    <input
                      type="email"
                      id="reg-owner-email"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="Ej. ignacio@gmail.com"
                      className="w-full bg-matte-950 border border-matte-800 focus:border-moto-red text-white p-2.5 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Subsection 2: Bike details */}
            <div className="space-y-4 pt-2">
              <span className="text-[10px] font-mono font-bold text-moto-blue uppercase tracking-wider flex items-center gap-1.5 border-b border-matte-800 pb-2">
                <FileText className="w-3.5 h-3.5" />
                2. Especificaciones de la Motocicleta
              </span>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 1. Plate */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-bike-plate" className="text-gray-400 font-semibold block">Patente / Placa *</label>
                  <input
                    type="text"
                    id="reg-bike-plate"
                    required
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    placeholder="Ej. A078KLM"
                    className="w-full bg-matte-950 border border-matte-800 focus:border-moto-red text-white p-2.5 rounded-lg text-xs font-mono uppercase"
                  />
                </div>

                {/* 2. Brand */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-bike-brand" className="text-gray-400 font-semibold block">Marca Moto</label>
                  <select
                    id="reg-bike-brand"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-matte-950 border border-matte-800 text-gray-300 p-2.5 rounded-lg text-xs"
                  >
                    {MOTORCYCLE_BRANDS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Model based on brand selection */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-bike-model" className="text-gray-400 font-semibold block">Modelo *</label>
                  <select
                    id="reg-bike-model"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-matte-950 border border-matte-800 text-gray-300 p-2.5 rounded-lg text-xs"
                  >
                    {compatibleModels.map(m => (
                      <option key={m.model} value={m.model}>{m.model}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Year picker */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-bike-year" className="text-gray-400 font-semibold block">Año de Fabric.</label>
                  <select
                    id="reg-bike-year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-matte-950 border border-matte-800 text-gray-300 p-2.5 rounded-lg text-xs font-mono"
                  >
                    {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ingress Mileage */}
              <div className="space-y-1.5 max-w-xs">
                <label htmlFor="reg-bike-mileage" className="text-gray-400 font-semibold block">Kilometraje de Ingreso km *</label>
                <input
                  type="number"
                  id="reg-bike-mileage"
                  required
                  min="0"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="Ej. 18450"
                  className="w-full bg-matte-950 border border-matte-800 focus:border-moto-red text-white p-2.5 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            {/* Subsection 3: Diagnostic checklists & text summary description */}
            <div className="space-y-4 pt-2">
              <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-matte-800 pb-2">
                <AlertCircle className="w-3.5 h-3.5" />
                3. Peritaje de Diagnóstico Técnico Inicial
              </span>

              {/* Checklist helper grid */}
              <div className="grid grid-cols-2 gap-3 bg-matte-950/60 p-4 border border-matte-800 rounded-xl">
                <label className="flex items-center gap-2.5 cursor-pointer text-[11px] text-gray-300 select-none">
                  <input
                    type="checkbox"
                    id="chk-engine-noise"
                    checked={isCheckedList.engineNoise}
                    onChange={() => handleToggleChecklist('engineNoise', 'Ruido de válvulas')}
                    className="rounded text-moto-red bg-matte-900 border-gray-800 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Ruido extraño motor / golpeteo</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-[11px] text-gray-300 select-none">
                  <input
                    type="checkbox"
                    id="chk-fluid-leak"
                    checked={isCheckedList.fluidLeak}
                    onChange={() => handleToggleChecklist('fluidLeak', 'Pérdida de lubricación')}
                    className="rounded text-moto-red bg-matte-900 border-gray-800 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Pérdidas fluidos / refrigerante</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-[11px] text-gray-300 select-none">
                  <input
                    type="checkbox"
                    id="chk-chain"
                    checked={isCheckedList.chainStretched}
                    onChange={() => handleToggleChecklist('chainStretched', 'Transmisión estirada')}
                    className="rounded text-moto-red bg-matte-900 border-gray-800 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Cadena / piñón estirada crítica</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-[11px] text-gray-300 select-none">
                  <input
                    type="checkbox"
                    id="chk-brakes"
                    checked={isCheckedList.brakeLoose}
                    onChange={() => handleToggleChecklist('brakeLoose', 'Frenos esponjosos')}
                    className="rounded text-moto-red bg-matte-900 border-gray-800 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Manillar de freno largo / suelto</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-[11px] text-gray-300 select-none">
                  <input
                    type="checkbox"
                    id="chk-suspension"
                    checked={isCheckedList.suspensionBent}
                    onChange={() => handleToggleChecklist('suspensionBent', 'Barrales doblados')}
                    className="rounded text-moto-red bg-matte-900 border-gray-800 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Alineación barrales del. / caída</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-[11px] text-gray-300 select-none">
                  <input
                    type="checkbox"
                    id="chk-electrical"
                    checked={isCheckedList.electricalFails}
                    onChange={() => handleToggleChecklist('electricalFails', 'Inyección check engine')}
                    className="rounded text-moto-red bg-matte-900 border-gray-800 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Testigo tablero / código scanner</span>
                </label>
              </div>

              {/* Compiled diagnostics memo block */}
              <div className="space-y-1.5">
                <label htmlFor="reg-bike-diag-memo" className="text-gray-400 font-semibold block">Anotación de Diagnóstico (Detallado)</label>
                <textarea
                  id="reg-bike-diag-memo"
                  rows={4}
                  value={diagnosticsMemo}
                  onChange={(e) => setDiagnosticsMemo(e.target.value)}
                  placeholder="Redacta o edita libremente los comentarios de admisión del mecánico..."
                  className="w-full bg-matte-950 border border-matte-800 focus:border-moto-red text-white p-3 rounded-lg text-xs leading-relaxed font-sans placeholder-gray-600 focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* R: Image evidence and quick diagnostics tools */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Visual Attachment Photo simulation */}
            <div className="bg-matte-900 border border-matte-800 rounded-2xl p-5 shadow-xl space-y-4">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">Foto de Admisión (Control visual)</span>
              
              <div className="relative h-44 rounded-xl border border-matte-800 overflow-hidden bg-matte-950 group">
                <img 
                  src={mockIngressPhotos[activePhotoIdx]} 
                  alt="Vehículo ingresado"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105" 
                />
                
                {/* Overlay camera logo indication representing mobile snap */}
                <div className="absolute top-3 right-3 bg-matte-950/80 border border-matte-800 p-1.5 rounded-lg text-white">
                  <Camera className="w-4 h-4" />
                </div>

                <div className="absolute bottom-3 left-3 bg-matte-950/90 text-[10px] font-mono text-gray-400 px-2.5 py-0.5 rounded border border-matte-800 leading-none">
                  INGRESO_IMG_00{activePhotoIdx + 1}.RAW
                </div>
              </div>

              {/* Alt toggle trigger simulating uploading camera shots */}
              <button
                type="button"
                onClick={() => setActivePhotoIdx((prev) => (prev + 1) % mockIngressPhotos.length)}
                className="w-full py-2 bg-matte-950 hover:bg-matte-800 transition rounded-lg border border-matte-800 text-[11px] font-mono text-gray-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                📸 Sustituir foto de peritaje
              </button>
            </div>

            {/* Submit ticket summary info box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-matte-900 to-matte-950 border border-matte-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-matte-800 pb-3">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-tight">Efectos Colaterales ERP</span>
              </div>
              
              <ul className="space-y-3.5 text-[11px] leading-relaxed text-gray-400 font-light list-inside">
                <li className="flex items-start gap-1.5">
                  <span className="text-green-500 font-bold shrink-0">✔</span>
                  <span>Crea automáticamente un registro de vehículo en base de datos.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-green-500 font-bold shrink-0">✔</span>
                  <span>Inicializa una Orden de Servicio en estado <strong>Ingreso</strong>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-green-500 font-bold shrink-0">✔</span>
                  <span>Puebla un evento en el timeline con la firma electrónica del usuario.</span>
                </li>
              </ul>

              <button
                type="submit"
                id="reg-submit-btn"
                className="w-full py-3 bg-moto-red hover:bg-red-600 border border-transparent transition text-xs font-extrabold text-white rounded-lg flex items-center justify-center gap-1 cursor-pointer shadow-lg"
              >
                Registrar Ingreso de Motocicleta <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
