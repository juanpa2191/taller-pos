import React, { useMemo } from 'react';
import { TrendingUp, Wrench, ShieldAlert, CheckCircle2, Plus, Clock, FileText, Bell, ChevronRight, HelpCircle, Package, ArrowUpRight, Check } from 'lucide-react';
import { Part, RepairOrder, Motorcycle, SystemNotification } from '../types';

interface DashboardProps {
  partsState: Part[];
  repairsState: RepairOrder[];
  motorcyclesState: Motorcycle[];
  notifications: SystemNotification[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onNavigateToView: (viewName: 'inventory' | 'bike_registry' | 'repairs') => void;
  onSelectRepairOrder: (id: string) => void;
}

export default function Dashboard({
  partsState,
  repairsState,
  motorcyclesState,
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications,
  onNavigateToView,
  onSelectRepairOrder
}: DashboardProps) {

  // Dynamic Statistics Calculations based on true ongoing state
  const stats = useMemo(() => {
    // 1. Total active repairs
    const activeTasksCount = repairsState.filter(r => r.status !== 'delivered').length;

    // 2. Low stock count
    const lowStockCount = partsState.filter(p => p.stock <= p.minStock).length;

    // 3. Completed services
    const completedServicesCount = repairsState.filter(r => r.status === 'completed' || r.status === 'delivered').length;

    // 4. Monthly simulated revenue (including labor costs + part costs used in repairs)
    let totalRevenue = 485000; // base offset
    repairsState.forEach(repair => {
      repair.items.forEach(item => {
        totalRevenue += (item.unitPrice * item.quantity);
      });
    });

    return {
      activeTasksCount,
      lowStockCount,
      completedServicesCount,
      totalRevenue
    };
  }, [partsState, repairsState]);

  // Unread notifications calculation
  const unreadNotifications = useMemo(() => {
    return notifications.filter(n => !n.read);
  }, [notifications]);

  return (
    <div className="w-full blueprint-bg bg-matte-950 text-gray-100 min-h-screen pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Dashboard Title Greetings Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4 border-b border-matte-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Workshop Control Center (ERP)</h1>
            <p className="text-gray-400 text-xs font-light">
              Bienvenido de nuevo, <strong className="text-white">Admin Santiago</strong> • Sucursal Mototek Precision Lab
            </p>
          </div>
          
          {/* Quick Actions Header Shortcut Strip */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigateToView('bike_registry')}
              id="dash-quick-reg"
              className="px-4 py-2 bg-moto-red hover:bg-red-600 font-semibold text-xs text-white rounded-lg cursor-pointer transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Ingresar Moto
            </button>
            <button
              onClick={() => onNavigateToView('inventory')}
              id="dash-quick-inv"
              className="px-4 py-2 bg-matte-900 hover:bg-matte-800 border border-matte-800 font-semibold text-xs text-gray-300 hover:text-white rounded-lg cursor-pointer transition flex items-center gap-1.5"
            >
              <Package className="w-4 h-4 text-moto-blue" /> Ver Inventario
            </button>
          </div>
        </div>

        {/* 1. KPI FOUR-GRID METRICS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Revenue Metric Block */}
          <div className="bento-card p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Caja Estimada Mensual</span>
              <span className="text-[10px] font-mono text-emerald-500 bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                +14.8% <ArrowUpRight className="w-2.5 h-2.5" />
              </span>
            </div>
            <div className="mt-3.5 space-y-1">
              <span className="text-xl md:text-2xl font-extrabold text-white font-mono leading-none block">
                ${stats.totalRevenue.toLocaleString('es-AR')}
              </span>
              <span className="text-[10px] text-gray-500 font-mono block">ARS Facturación real / asignada</span>
            </div>
          </div>

          {/* Active repairs / orders metric */}
          <div className="bento-card p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-moto-red/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Motos en Reparación</span>
              <span className="w-2 h-2 rounded-full bg-red-500 glow-active mt-1"></span>
            </div>
            <div className="mt-3.5 space-y-1">
              <span className="text-xl md:text-2xl font-extrabold text-white font-mono leading-none block">
                {stats.activeTasksCount}
              </span>
              <span className="text-[10px] text-gray-500 font-mono block">En taller (Ingreso/Mecánico/Espera)</span>
            </div>
          </div>

          {/* Low Stocks warning alerts block */}
          <div className="bento-card p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Alertas de Repuestos</span>
              {stats.lowStockCount > 0 ? (
                <span className="text-[10px] font-mono text-amber-500 bg-amber-950/40 border border-amber-900/30 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  CRÍTICO
                </span>
              ) : (
                <span className="text-[10px] font-mono text-green-500 bg-green-950/20 px-1.5 py-0.5 rounded">OK</span>
              )}
            </div>
            <div className="mt-3.5 space-y-1">
              <span className={`text-xl md:text-2xl font-extrabold font-mono leading-none block ${stats.lowStockCount > 0 ? 'text-amber-500' : 'text-white'}`}>
                {stats.lowStockCount}
              </span>
              <span className="text-[10px] text-gray-500 font-mono block">Artículos con stock ≤ mínimo</span>
            </div>
          </div>

          {/* Completed service records aggregate metric */}
          <div className="bento-card p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-moto-blue/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Servicios Completados</span>
              <span className="text-[10px] font-mono text-moto-blue bg-blue-950/40 border border-blue-900/30 px-1.5 py-0.5 rounded">100% SATISFACCIÓN</span>
            </div>
            <div className="mt-3.5 space-y-1">
              <span className="text-xl md:text-2xl font-extrabold text-white font-mono leading-none block">
                {stats.completedServicesCount}
              </span>
              <span className="text-[10px] text-gray-500 font-mono block">Historial de egresos exitosos</span>
            </div>
          </div>

        </div>

        {/* 2. CHARTS AREA: Interactive Premium vector representation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Vector SVGs Monthly Revenue line chart (Stripe-Style) */}
          <div className="lg:col-span-8 bento-card p-5 space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Historial Financiero</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">Evolución de Ingresos ERP (Semanal)</h3>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-moto-red rounded-full"></span> Repuestos</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-gray-500 rounded-full"></span> Mano de Obra</span>
              </div>
            </div>

            {/* Pure SVG Line Chart (Fully responsive design representation) */}
            <div className="relative pt-2">
              <svg viewBox="0 0 500 180" className="w-full h-44 md:h-56 select-none overflow-visible">
                {/* Horizontal guide lines */}
                <line x1="30" y1="20" x2="480" y2="20" stroke="#1b1e22" strokeDasharray="3" />
                <line x1="30" y1="60" x2="480" y2="60" stroke="#1b1e22" strokeDasharray="3" />
                <line x1="30" y1="100" x2="480" y2="100" stroke="#1b1e22" strokeDasharray="3" />
                <line x1="30" y1="140" x2="480" y2="140" stroke="#1b1e22" strokeDasharray="3" />
                <line x1="30" y1="170" x2="480" y2="170" stroke="#2a2f35" />

                {/* Vertical guides corresponding to weeks */}
                <line x1="50" y1="20" x2="50" y2="170" stroke="#1b1e22" opacity="0.4" />
                <line x1="150" y1="20" x2="150" y2="170" stroke="#1b1e22" opacity="0.4" />
                <line x1="250" y1="20" x2="250" y2="170" stroke="#1b1e22" opacity="0.4" />
                <line x1="350" y1="20" x2="350" y2="170" stroke="#1b1e22" opacity="0.4" />
                <line x1="450" y1="20" x2="450" y2="170" stroke="#1b1e22" opacity="0.4" />

                {/* Area Gradient */}
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ea2b2b" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#ea2b2b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Fill Area representing trendline */}
                <path 
                  d="M 50 170 Q 150 125, 250 85 T 450 40 L 450 170 Z" 
                  fill="url(#chartGrad)" 
                />

                {/* SVG Spline Trendline */}
                <path 
                  d="M 50 170 Q 150 125, 250 85 T 450 40" 
                  fill="none" 
                  stroke="#ea2b2b" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />

                {/* Interactive Points on Spline */}
                <circle cx="50" cy="170" r="4.5" fill="#ea2b2b" stroke="#121417" strokeWidth="1.5" />
                <circle cx="150" cy="125" r="4.5" fill="#ea2b2b" stroke="#121417" strokeWidth="1.5" />
                <circle cx="250" cy="85" r="4.5" fill="#ea2b2b" stroke="#121417" strokeWidth="1.5" />
                <circle cx="350" cy="100" r="4.5" fill="#ea2b2b" stroke="#121417" strokeWidth="1.5" />
                <circle cx="450" cy="40" r="4.5" fill="#ea2b2b" stroke="#121417" strokeWidth="1.5" />

                {/* Text Values along Y-Axis */}
                <text x="5" y="24" fill="#525c68" className="font-mono" style={{ fontSize: '9px' }}>$500k</text>
                <text x="5" y="64" fill="#525c68" className="font-mono" style={{ fontSize: '9px' }}>$350k</text>
                <text x="5" y="104" fill="#525c68" className="font-mono" style={{ fontSize: '9px' }}>$200k</text>
                <text x="5" y="144" fill="#525c68" className="font-mono" style={{ fontSize: '9px' }}>$80k</text>
                <text x="5" y="174" fill="#525c68" className="font-mono" style={{ fontSize: '9px' }}>0</text>

                {/* Text labels along X-Axis */}
                <text x="50" y="186" fill="#8d9ea5" className="font-mono text-center" style={{ fontSize: '9px', textAnchor: 'middle' }}>Semana 1</text>
                <text x="150" y="186" fill="#8d9ea5" className="font-mono text-center" style={{ fontSize: '9px', textAnchor: 'middle' }}>Semana 2</text>
                <text x="250" y="186" fill="#8d9ea5" className="font-mono text-center" style={{ fontSize: '9px', textAnchor: 'middle' }}>Semana 3</text>
                <text x="350" y="186" fill="#8d9ea5" className="font-mono text-center" style={{ fontSize: '9px', textAnchor: 'middle' }}>Semana 4</text>
                <text x="450" y="186" fill="#8d9ea5" className="font-mono text-center" style={{ fontSize: '9px', textAnchor: 'middle' }}>Semana 5 (Hoy)</text>
              </svg>
            </div>
          </div>

          {/* Parts Category Utilization vertical chart */}
          <div className="lg:col-span-4 bento-card p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-0.5 border-b border-white/[0.06] pb-2.5">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Estocaje & Demanda</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">Ocupación por Categoría</h3>
            </div>

            {/* Custom visual progress list showing simulated stock densities */}
            <div className="space-y-3.5">
              {[
                { name: 'Sistemas de Lubricantes', count: 50, color: 'bg-moto-red', percentage: '64%' },
                { name: 'Frenos y Transmisiones', count: 22, color: 'bg-moto-blue', percentage: '48%' },
                { name: 'Electrónica y Luces', count: 35, color: 'bg-amber-500', percentage: '32%' },
                { name: 'Neumáticos y Ruedas', count: 6, color: 'bg-emerald-500', percentage: '12%' },
                { name: 'Accesorios y Carenaje', count: 14, color: 'bg-purple-500', percentage: '18%' }
              ].map((cat, ind) => (
                <div key={ind} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-gray-300 font-sans truncate pr-2">{cat.name}</span>
                    <span className="text-gray-500 shrink-0">{cat.count} u. ({cat.percentage})</span>
                  </div>
                  <div className="h-1.5 bg-matte-950 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.percentage }}></div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onNavigateToView('inventory')}
              className="w-full text-center py-2 rounded-xl bg-matte-950 hover:bg-matte-800 border border-matte-800 text-[11px] font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Consultar Tabla de Control
            </button>
          </div>

        </div>

        {/* 3. DYNAMIC REPAIRS WORKFLOW TICKETS & ALERTS COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Active Job repairs progress checklist ticker */}
          <div className="lg:col-span-8 bento-card p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-2.5">
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Control Diario</span>
                <h3 className="text-sm font-bold text-white">Órdenes de Trabajo Activas ({repairsState.length})</h3>
              </div>
              <button
                onClick={() => onNavigateToView('repairs')}
                className="text-[11px] font-mono text-moto-red hover:text-red-400 flex items-center gap-0.5 cursor-pointer leading-none"
              >
                Ver todo <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-matte-800">
              {repairsState.slice(0, 3).map((job) => {
                // Find matching bike
                const bike = motorcyclesState.find(m => m.id === job.motorcycleId) || { plate: '???', brand: 'Desconocido', model: 'Moto' };
                
                // Color codes based on status rules
                const statusStyles: Record<string, { label: string; bg: string; text: string; border: string }> = {
                  ingress: { label: 'INGRESADO', bg: 'bg-neutral-950/40', text: 'text-neutral-400', border: 'border-neutral-800' },
                  diagnosing: { label: 'DIAGNÓSTICO', bg: 'bg-blue-950/40', text: 'text-sky-400', border: 'border-blue-900/30' },
                  waiting_parts: { label: 'FALTA REPUES.', bg: 'bg-amber-950/40', text: 'text-amber-500', border: 'border-amber-900/30' },
                  repairing: { label: 'MERCED PROG.', bg: 'bg-red-950/40', text: 'text-moto-red', border: 'border-red-900/40' },
                  completed: { label: 'COMPLETO', bg: 'bg-green-950/40', text: 'text-green-500', border: 'border-green-900/30' },
                  delivered: { label: 'ENTREGADO', bg: 'bg-gray-950/40', text: 'text-gray-400', border: 'border-gray-800' }
                };
                const style = statusStyles[job.status] || statusStyles.ingress;

                // Sum prices
                const totalCalculated = job.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

                return (
                  <div 
                    key={job.id}
                    onClick={() => onSelectRepairOrder(job.id)}
                    className="py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-matte-950/40 px-2 rounded-xl transition duration-150 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-moto-red transition-colors">
                          {bike.brand} {bike.model}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 bg-matte-950 px-1.5 py-0.2 rounded border border-matte-800">
                          {bike.plate}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-gray-400 font-light pr-4 leading-relaxed">
                        <Clock className="w-3 h-3 text-gray-500 shrink-0" />
                        <span>Estimado: {new Date(job.estimatedDelivery).toLocaleDateString('es-AR')}</span>
                        <span className="text-gray-600">•</span>
                        <span className="line-clamp-1 truncate max-w-[280px]">Mecánicos: Carlos & Santi</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs font-mono font-bold text-white">${totalCalculated.toLocaleString('es-AR')}</span>
                      
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}>
                        {style.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Notification alerts center side panel */}
          <div className="lg:col-span-4 bento-card p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-moto-red" />
                <span className="text-sm font-bold text-white">Notificaciones ({unreadNotifications.length})</span>
              </div>
              {unreadNotifications.length > 0 && (
                <button
                  onClick={onClearAllNotifications}
                  className="text-[10px] font-mono text-gray-500 hover:text-white transition cursor-pointer leading-none"
                >
                  Marcar leídas
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-xs text-light space-y-1">
                <span>✓ Sin pendientes</span>
                <p className="text-[10px] text-gray-600 font-mono">El ERP se encuentra totalmente sincronizado</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
                {notifications.map((n) => {
                  const themeMap = {
                    alert: 'bg-red-500/10 border-red-900/30 text-rose-400',
                    warning: 'bg-amber-500/10 border-amber-900/30 text-amber-400',
                    success: 'bg-green-500/10 border-green-905/30 text-green-400',
                    info: 'bg-blue-500/10 border-blue-900/30 text-sky-400'
                  };

                  return (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl border flex gap-3 transition-opacity duration-300 relative group text-xs ${
                        themeMap[n.type] || themeMap.info
                      } ${n.read ? 'opacity-40' : 'opacity-100'}`}
                    >
                      <div className="space-y-0.5 flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-white block pr-4 leading-tight">{n.title}</span>
                          {!n.read && (
                            <button
                              onClick={() => onMarkNotificationRead(n.id)}
                              className="absolute top-2.5 right-2 text-gray-500 hover:text-white transition cursor-pointer"
                              title="Marcar leída"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-gray-400 font-light leading-snug">{n.description}</p>
                        <span className="text-[9px] font-mono text-gray-600 block pt-1">{n.time}</span>
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
  );
}
