import React, { useState } from 'react';
import { Search, Wrench, ShieldCheck, MapPin, TrendingUp, ChevronRight, Star, Layers, Settings, ArrowRight } from 'lucide-react';
import { SPARE_PART_CATEGORIES, INITIAL_WORKSHOPS } from '../data';

interface LandingPageProps {
  onSearch: (searchTerm: string, category: string) => void;
  onNavigateToWorkshops: () => void;
  onNavigateToWorkshopProfile: (id: string) => void;
  onEnterERP: () => void;
}

export default function LandingPage({
  onSearch,
  onNavigateToWorkshops,
  onNavigateToWorkshopProfile,
  onEnterERP
}: LandingPageProps) {
  const [fastQuery, setFastQuery] = useState('');
  const [fastCategory, setFastCategory] = useState('');

  const handleFastSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(fastQuery, fastCategory);
  };

  return (
    <div className="w-full blueprint-bg bg-matte-950 text-gray-100 min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 border-b border-matte-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-moto-red/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-moto-blue/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Info */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left transition-all duration-700">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-matte-900 border border-matte-800 text-xs font-mono font-medium tracking-wider text-moto-red uppercase shadow-lg">
                <span className="w-2 h-2 rounded-full bg-red-500 glow-active"></span>
                SaaS ERP + Moto Marketplace v1.4
              </div>

              {/* Title */}
              <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none">
                La plataforma inteligente para <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-moto-red to-orange-400">
                  Talleres & Repuestos
                </span>
                <br />de Motocicletas.
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
                Revolucionamos la postventa de motos. Control de inventario ERP de vanguardia, 
                órdenes de servicio en tiempo real con evidencia multimedia y un buscador público geolocalizado 
                que conecta talleres con motociclistas buscando repuestos con stock real.
              </p>

              {/* Fast Form Search Engine */}
              <form onSubmit={handleFastSearchSubmit} className="max-w-2xl mx-auto lg:mx-0">
                <div className="p-2.5 rounded-2xl bg-matte-900/90 border border-matte-800 shadow-2xl flex flex-col sm:flex-row gap-2.5 items-stretch">
                  <div className="relative flex-1 flex items-center">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      type="text"
                      id="hero-search-input"
                      value={fastQuery}
                      onChange={(e) => setFastQuery(e.target.value)}
                      placeholder="Bujía Iridium, pastillas Brembo, cadena DID..."
                      className="w-full bg-transparent pl-11 pr-4 py-3 border-0 rounded-xl focus:ring-1 focus:ring-moto-red text-white placeholder-gray-500 text-sm focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex gap-2.5">
                    <select
                      id="hero-category-select"
                      value={fastCategory}
                      onChange={(e) => setFastCategory(e.target.value)}
                      className="bg-matte-950 border border-matte-800 rounded-xl px-3 text-sm text-gray-400 focus:outline-none focus:border-moto-red"
                    >
                      <option value="">Categorías</option>
                      {SPARE_PART_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      id="hero-search-btn"
                      className="bg-moto-red hover:bg-red-600 transition-all duration-300 px-6 py-3 rounded-xl font-medium text-white text-sm whitespace-nowrap shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      Buscar Fuerte
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>

              {/* CTA Acceso a ERP / Taller demo toggle */}
              <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4">
                <button
                  onClick={onEnterERP}
                  id="cta-enter-erp"
                  className="px-6 py-3.5 rounded-xl text-white font-medium bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 border border-neutral-700 transition-all shadow-xl flex items-center gap-2 cursor-pointer group hover:border-moto-blue"
                >
                  <Settings className="w-5 h-5 text-moto-blue group-hover:rotate-45 transition-transform" />
                  <span>Acceso Demo Taller (ERP)</span>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
                
                <button
                  onClick={onNavigateToWorkshops}
                  id="cta-view-workshops"
                  className="px-6 py-3.5 rounded-xl font-medium text-gray-300 hover:text-white transition group flex items-center gap-1 cursor-pointer"
                >
                  Ver Talleres Cercanos
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Hero Right Visuals (High-fidelity interactive element) */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0 max-w-md mx-auto w-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-moto-red/20 to-transparent blur-2xl rounded-3xl"></div>
              
              <div className="relative glass-effect rounded-2xl border border-matte-800 p-6 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-matte-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  </div>
                  <span className="font-mono text-xs text-gray-500">LIVE WORKSHOP MONITORS</span>
                </div>

                {/* Simulated live repair card */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-mono text-moto-red bg-red-950/40 px-2 py-0.5 rounded border border-red-900/30">ORDEN EN PROGRESO</span>
                      <h4 className="text-white font-semibold mt-1.5 text-sm">Yamaha MT-07 • A078KLM</h4>
                      <p className="text-xs text-gray-400">Cliente: Ignacio G. • 18,450 km</p>
                    </div>
                    <span className="text-sm font-mono text-white font-bold">$179,200 ARS</span>
                  </div>

                  {/* Progress steps mini bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-gray-400">Servicio general e Inyección</span>
                      <span className="text-moto-red">85% Completo</span>
                    </div>
                    <div className="h-1.5 bg-matte-950 rounded-full overflow-hidden">
                      <div className="h-full bg-moto-red rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  {/* Evidence attachment sample */}
                  <div className="p-3 bg-matte-950 rounded-xl border border-matte-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src="https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=80&auto=format&fit=crop&q=80" 
                        alt="Repuesto"
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded-lg border border-matte-800"
                      />
                      <div>
                        <p className="text-xs font-medium text-white">Aceite Motul + Filtro K&N</p>
                        <p className="text-[10px] text-gray-500 font-mono">Asignado con stock real</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-green-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> OK
                    </span>
                  </div>
                </div>

                {/* Simulated KPI widgets inside right panel */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-matte-950/60 rounded-xl border border-matte-800 text-center">
                    <span className="text-[10px] font-mono text-gray-500 block uppercase">Eficiencia</span>
                    <span className="text-lg font-bold text-white font-mono">98.4%</span>
                  </div>
                  <div className="p-3 bg-matte-950/60 rounded-xl border border-matte-800 text-center">
                    <span className="text-[10px] font-mono text-gray-500 block uppercase">Espera Promedio</span>
                    <span className="text-lg font-bold text-white font-mono">24 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Statistics Strip */}
      <section className="bg-matte-900 border-b border-matte-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <span className="text-3xl font-extrabold text-white font-mono block">250+</span>
              <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Talleres Adheridos</span>
            </div>
            <div className="text-center">
              <span className="text-3xl font-extrabold text-white font-mono block">15,000+</span>
              <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Repuestos Catalogados</span>
            </div>
            <div className="text-center">
              <span className="text-3xl font-extrabold text-white font-mono block">42,000+</span>
              <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Reparaciones Exitosas</span>
            </div>
            <div className="text-center">
              <span className="text-3xl font-extrabold text-white font-mono block">&lt; 15 min</span>
              <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Búsqueda & Compra</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefit Stack */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold uppercase text-moto-red tracking-wider">Ecosistema Integral</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Diseñado para la eficiencia mecánica extrema</h2>
          <p className="text-gray-400 font-light text-sm">
            Unificamos la oferta pública con la demanda de repuestos y las herramientas operativas internas de los talleres.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Item 1 */}
          <div className="bento-card p-6 space-y-4 shadow-lg group hover:border-moto-red/30">
            <div className="w-12 h-12 rounded-xl bg-matte-950 flex items-center justify-center border border-matte-800 group-hover:border-moto-red/50 transition">
              <Wrench className="w-6 h-6 text-moto-red" />
            </div>
            <h3 className="text-lg font-bold text-white">ERP Taller & Ordenes</h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              Administración refinada de órdenes de servicio, estado de reparaciones con checklists rigurosos y registro inmediato de motos con placa, km and diagnóstico pericial.
            </p>
          </div>

          {/* Item 2 */}
          <div className="bento-card p-6 space-y-4 shadow-lg group hover:border-moto-blue/30">
            <div className="w-12 h-12 rounded-xl bg-matte-950 flex items-center justify-center border border-matte-800 group-hover:border-moto-blue/50 transition">
              <Layers className="w-6 h-6 text-moto-blue" />
            </div>
            <h3 className="text-lg font-bold text-white">Control de Inventario</h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              Control total en estantería física. Alertas de stock mínimo bajo criterio inteligente, SKU rastreable e integración automática con la orden de reparación que descuenta directo al usarlo.
            </p>
          </div>

          {/* Item 3 */}
          <div className="bento-card p-6 space-y-4 shadow-lg group hover:border-emerald-500/30">
            <div className="w-12 h-12 rounded-xl bg-matte-950 flex items-center justify-center border border-matte-800 group-hover:border-emerald-500/50 transition">
              <MapPin className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-white">Marketplace & Georouting</h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              Exposición instantánea del catálogo a usuarios cercanos. Tus consumibles o piezas clave aparecen geolocalizados por distancia con ruteo directo y enlace a WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="py-16 bg-matte-900/40 border-y border-matte-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest block">CATÁLOGO ABIERTO</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Busca repuestos por su categoría madre</h2>
            </div>
            <button 
              onClick={() => onSearch('', '')}
              className="text-sm font-medium text-moto-red hover:text-red-400 transition-all duration-200 flex items-center gap-1 cursor-pointer"
            >
              Ver todo el stock interactivo <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SPARE_PART_CATEGORIES.map((category, index) => {
              const bgColors = [
                'hover:border-red-500/30 hover:bg-red-500/5',
                'hover:border-blue-500/30 hover:bg-blue-500/5',
                'hover:border-amber-500/30 hover:bg-amber-500/5',
                'hover:border-purple-500/30 hover:bg-purple-500/5',
                'hover:border-emerald-500/30 hover:bg-emerald-500/5',
                'hover:border-pink-500/30 hover:bg-pink-500/5',
                'hover:border-cyan-500/30 hover:bg-cyan-500/5',
              ];

              return (
                <button
                  key={category}
                  onClick={() => onSearch('', category)}
                  id={`cat-card-${index}`}
                  className={`p-5 bento-card text-left space-y-4 shadow cursor-pointer group ${bgColors[index % bgColors.length]}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-matte-950 flex items-center justify-center font-bold text-gray-500 font-mono text-sm group-hover:text-white transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-white transition">{category}</h4>
                    <span className="text-[11px] text-gray-500 font-mono font-medium block mt-1">Ver disponibilidad</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Workshops */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold uppercase text-moto-blue tracking-wider">COBERTURA PREMIUM</span>
          <h2 className="text-3xl font-extrabold text-white">Nuestros talleres destacados de la semana</h2>
          <p className="text-gray-400 font-light text-sm">
            Talleres con nivel técnico certificado por auditoría externa y puntuaciones excepcionales por motociclistas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INITIAL_WORKSHOPS.map((workshop) => (
            <div 
              key={workshop.id}
              className="bg-matte-900 border border-matte-800 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-matte-700 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Banner */}
                <div className="relative h-44 w-full">
                  <img 
                    src={workshop.banner} 
                    alt={workshop.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-matte-900 via-matte-900/40 to-transparent"></div>
                  
                  {/* Badge Rating inside image */}
                  <div className="absolute bottom-4 left-4 bg-matte-950/90 border border-matte-800 px-2.5 py-1 rounded-lg text-xs font-semibold text-yellow-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" /> {workshop.rating}
                    <span className="text-gray-400 text-[10px] font-normal">({workshop.reviewsCount} reviews)</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <img 
                      src={workshop.avatar} 
                      alt={workshop.name} 
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-lg border border-matte-700" 
                    />
                    <div>
                      <h3 className="text-base font-bold text-white">{workshop.name}</h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-moto-red" /> {workshop.address}, {workshop.city}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 font-light line-clamp-3 leading-relaxed pt-2">
                    {workshop.description}
                  </p>
                </div>
              </div>

              {/* Footer action buttons */}
              <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => onNavigateToWorkshopProfile(workshop.id)}
                  className="w-full py-2 bg-matte-950 hover:bg-matte-800 transition rounded-lg border border-matte-800 text-xs font-semibold text-gray-300 hover:text-white cursor-pointer"
                >
                  Perfil & Reseñas
                </button>
                <a
                  href={workshop.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-green-950/50 hover:bg-green-900 border border-green-800/60 transition rounded-lg text-xs font-semibold text-green-400 hover:text-green-300 flex items-center justify-center gap-1 cursor-pointer"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Startup Professional Testimonial */}
      <section className="py-20 bg-matte-900 max-w-7xl mx-auto rounded-3xl border border-matte-800 px-6 sm:px-12 relative overflow-hidden my-12">
        <div className="absolute top-0 right-0 w-80 h-80 bg-moto-red/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-moto-blue/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-6">
            <span className="text-xs font-mono font-bold text-moto-red uppercase tracking-wider block">TESTIMONIO LÍDER</span>
            <p className="text-lg md:text-xl text-gray-200 font-light italic leading-relaxed">
              "MotoSaaS cambió radicalmente cómo operamos el taller. Antes, el cliente nos llamaba cada dos horas preguntando por su moto. Hoy, simplemente miran las fotos de evidencia en su orden digital y ven cómo avanza el timeline de reparación. Además, vendemos un 30% más de pastillas de frenos y consumibles porque la gente del barrio ve nuestro stock real publicado en el buscador."
            </p>
            <div>
              <h4 className="text-base font-bold text-white">Marcos Galiano</h4>
              <p className="text-xs text-moto-red font-mono">Fundador de Galiano GP Motors - Cliente Partner</p>
            </div>
          </div>
          
          <div className="lg:col-span-4 rounded-2xl bg-matte-950 p-6 border border-matte-800 space-y-4">
            <h4 className="text-sm font-semibold text-white border-b border-matte-800 pb-2.5 font-mono">REGISTRA TU TALLER</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              ¿Eres dueño de un taller de motos? Multiplica tus ingresos integrando tu control de stock al marketplace nacional de repuestos.
            </p>
            <button
              onClick={onEnterERP}
              className="w-full bg-moto-red hover:bg-red-600 font-semibold py-2.5 text-xs text-white rounded-lg cursor-pointer transition shadow"
            >
              Comenzar Auditoría Gratis
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 border-t border-matte-800 bg-matte-950 py-12 text-gray-500 font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-moto-red flex items-center justify-center font-bold text-white">
              M
            </div>
            <span className="text-white font-bold font-sans">MotoSaaS Platform</span>
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
            <span className="hover:text-gray-300 cursor-pointer">Soporte Técnico</span>
            <span className="hover:text-gray-300 cursor-pointer">Seguridad de Datos</span>
            <span className="hover:text-gray-300 cursor-pointer">Políticas de Privacidad</span>
            <span className="hover:text-gray-300 cursor-pointer">Términos de Servicio (SaaS)</span>
          </div>
          <p>© 2026 MotoSaaS. Optimización del asfalto.</p>
        </div>
      </footer>
    </div>
  );
}
