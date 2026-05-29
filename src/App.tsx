import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  Settings, 
  Layers, 
  MessageSquare, 
  Bell, 
  User, 
  FileText, 
  Compass, 
  MapPin, 
  TrendingUp, 
  Package, 
  ChevronDown, 
  Check, 
  X,
  Menu
} from 'lucide-react';

import { Workshop, Part, Motorcycle, RepairOrder, SystemNotification, Review, RepairItem } from './types';
import { INITIAL_WORKSHOPS, INITIAL_PARTS, INITIAL_MOTORCYCLES, INITIAL_REPAIR_ORDERS } from './data';

// Import Modular Sub-Views
import LandingPage from './components/LandingPage';
import Marketplace from './components/Marketplace';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import BikeRegistry from './components/BikeRegistry';
import RepairOrderSheet from './components/RepairOrderSheet';
import WorkshopProfile from './components/WorkshopProfile';

export default function App() {
  // --- DATABASE STATES (FULLY COORDINATED STATE HYDRATING BOTH ROLES) ---
  const [workshopsState, setWorkshopsState] = useState<Workshop[]>(INITIAL_WORKSHOPS);
  const [partsState, setPartsState] = useState<Part[]>(INITIAL_PARTS);
  const [motorcyclesState, setMotorcyclesState] = useState<Motorcycle[]>(INITIAL_MOTORCYCLES);
  const [repairsState, setRepairsState] = useState<RepairOrder[]>(INITIAL_REPAIR_ORDERS);
  
  // Custom alerts dashboard feed
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'N-1',
      title: 'Reserva Stock Crítico',
      description: 'El consumible "Filtro de Aceite K&N Premium KN-204" acusa escasas 2 unidades. Reabastecer.',
      type: 'warning',
      time: 'Hace 10 min',
      read: false
    },
    {
      id: 'N-2',
      title: 'Yamaha MT-07 Lista',
      description: 'Yamaha MT-07 patente [A078KLM] aprobó pruebas finales de inyección. Lista para retiro.',
      type: 'success',
      time: 'Hace 2 horas',
      read: false
    },
    {
      id: 'N-3',
      title: 'Admisión Ingress Express',
      description: 'Honda CB500X patente [A153STB] ingresó a reparación de barrales delanteros.',
      type: 'info',
      time: 'Hace 4 horas',
      read: false
    }
  ]);

  // --- NAVIGATION SYSTEM ---
  // Core Roles: 'public' (For final client searches) vs 'erp' (For inner workshop workers)
  const [activeRole, setActiveRole] = useState<'public' | 'erp'>('public');

  // Sub-navigation triggers
  const [activePublicView, setActivePublicView] = useState<'landing' | 'marketplace' | 'profile'>('landing');
  const [activeErpView, setActiveErpView] = useState<'dashboard' | 'inventory' | 'bike_registry' | 'repairs'>('dashboard');

  // Detailed selected records
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>('W-01');
  const [selectedRepairId, setSelectedRepairId] = useState<string | null>(null);

  // Filter pass-through values (from Landing directly to Marketplace)
  const [initialMarketplaceSearch, setInitialMarketplaceSearch] = useState('');
  const [initialMarketplaceCategory, setInitialMarketplaceCategory] = useState('');

  // Mobile navigation trigger state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- SYSTEM UTILS: NOTIFICATION ENGINE ---
  const pushNotification = (type: SystemNotification['type'], title: string, description: string) => {
    const newNotif: SystemNotification = {
      id: 'N-' + Date.now(),
      title,
      description,
      type,
      time: 'Ahora',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // --- SYSTEM HANDLERS: PARTS & ERP INVENTORY ---
  const handleAddPart = (partData: Omit<Part, 'id'>) => {
    const newPart: Part = {
      ...partData,
      id: 'P-' + (partsState.length + 1)
    };
    setPartsState(prev => [newPart, ...prev]);
    pushNotification('success', 'Catálogo Sincronizado', `La pieza "${partData.name}" SKU ${partData.sku} se indexó en el ERP.`);
  };

  const handleModifyStock = (skuOrId: string, newStock: number) => {
    setPartsState(prev => prev.map(p => {
      if (p.id === skuOrId) {
        const updatedStock = Math.max(0, newStock);
        if (updatedStock <= p.minStock && updatedStock < p.stock) {
          pushNotification('warning', 'Alerta Stock Reserva', `El repuesto "${p.name}" SKU ${p.sku} tiene un stock crítico de ${updatedStock} unidades.`);
        }
        return { ...p, stock: updatedStock };
      }
      return p;
    }));
  };

  const handleDeletePart = (id: string) => {
    setPartsState(prev => {
      const deletedPart = prev.find(p => p.id === id);
      if (deletedPart) {
        pushNotification('info', 'Ficha Descatalogada', `El repuesto "${deletedPart.name}" SKU ${deletedPart.sku} fue removido del ERP.`);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  // --- SYSTEM HANDLERS: BIKE ADMISSIONS ---
  const handleRegisterBike = (bikeData: Omit<Motorcycle, 'id'>) => {
    const newBike: Motorcycle = {
      ...bikeData,
      id: 'M-' + (motorcyclesState.length + 1)
    };
    setMotorcyclesState(prev => [newBike, ...prev]);

    // Create active repair order linked to bike
    const newRO: RepairOrder = {
      id: 'RO-' + (repairsState.length + 1),
      orderNumber: `RO-2026-00${repairsState.length + 1}`,
      motorcycleId: newBike.id,
      workshopId: 'W-01',
      clientName: bikeData.ownerName,
      clientPhone: bikeData.ownerPhone,
      status: 'ingress',
      items: [],
      notes: bikeData.diagnostics,
      evidencePhotos: bikeData.imageUrl ? [bikeData.imageUrl] : [],
      timeline: [
        {
          id: 'T-' + Date.now(),
          status: 'ingress',
          title: 'Admisión Electrónica',
          description: `Ingreso peritado. Diagnóstico inicial: ${bikeData.diagnostics}. Odómetro acusa: ${bikeData.mileage} km. Válido por Santiago (admin).`,
          date: new Date().toISOString(),
          updatedBy: 'Santi (admin)',
          isCompleted: true
        }
      ],
      startedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3*24*60*60*1000).toISOString() // 3 days
    };

    setRepairsState(prev => [newRO, ...prev]);
    setSelectedRepairId(newRO.id);

    pushNotification('success', 'Registro Exitoso', `Ficha creada para la moto [${newBike.plate}]. Se inicializó la Orden de Trabajo.`);
    
    // Auto-navigate to Repair Sheets to experience the flow!
    setActiveErpView('repairs');
  };

  // --- SYSTEM HANDLERS: REPAIR ORDER WORKBOOK ---
  const handleUpdateRepairStatus = (roId: string, status: RepairOrder['status']) => {
    setRepairsState(prev => prev.map(ro => {
      if (ro.id === roId) {
        const labels: Record<string, string> = {
          ingress: 'Vehículo Ingresado',
          diagnosing: 'Diagnóstico en Proceso',
          waiting_parts: 'Falta Repuestos Críticos',
          repairing: 'Trabajo Mecánico de Altura',
          completed: 'Pruebas Certificadas Completas',
          delivered: 'Entregado y Facturado'
        };

        const newEvent = {
          id: 'T-' + Date.now(),
          status,
          title: `Avance Operativo: ${labels[status]}`,
          description: `Servicio de revisión ${ro.orderNumber} sufrió un cambio operativo validado por el Líder mecánico.`,
          date: new Date().toISOString(),
          updatedBy: 'Carlos (Líder mecánico)',
          isCompleted: true
        };

        pushNotification('info', `Orden ${ro.orderNumber}`, `Estado operativo actualizado: ${labels[status]}.`);
        
        return {
          ...ro,
          status,
          timeline: [...ro.timeline, newEvent]
        };
      }
      return ro;
    }));
  };

  const handleAddRepairItem = (roId: string, item: RepairItem) => {
    setRepairsState(prev => prev.map(ro => {
      if (ro.id === roId) {
        return {
          ...ro,
          items: [...ro.items, item]
        };
      }
      return ro;
    }));

    // Deduct stock if item is a part
    if (item.type === 'part' && item.partId) {
      setPartsState(prev => prev.map(p => {
        if (p.id === item.partId) {
          const newStock = Math.max(0, p.stock - 1);
          if (newStock <= p.minStock) {
            pushNotification('warning', 'Alerta Stock Reserva', `Consumible "${p.name}" SKU ${p.sku} ha entrado en stock crítico (${newStock} u.)`);
          }
          return { ...p, stock: newStock };
        }
        return p;
      }));
      pushNotification('success', 'Pieza Deductiva', `Se vinculó "${item.name}" al ticket. Stock físico reducido.`);
    } else {
      pushNotification('success', 'Tarea Facturada', `Mano de obra "${item.name}" añadida.`);
    }
  };

  const handleRemoveRepairItem = (roId: string, itemIndex: number) => {
    setRepairsState(prev => prev.map(ro => {
      if (ro.id === roId) {
        const itemToRemove = ro.items[itemIndex];
        
        // Return 1 unit back to inventory
        if (itemToRemove && itemToRemove.type === 'part' && itemToRemove.partId) {
          setPartsState(prevParts => prevParts.map(p => {
            if (p.id === itemToRemove.partId) {
              return { ...p, stock: p.stock + 1 };
            }
            return p;
          }));
        }

        const updatedItems = [...ro.items];
        updatedItems.splice(itemIndex, 1);
        return {
          ...ro,
          items: updatedItems
        };
      }
      return ro;
    }));
    pushNotification('info', 'Folleto Modificado', 'Se quitó el concepto del ticket de la reparación de forma exitosa.');
  };

  const handleAddTimelineEvent = (roId: string, title: string, desc: string) => {
    setRepairsState(prev => prev.map(ro => {
      if (ro.id === roId) {
        const newEvent = {
          id: 'T-' + Date.now(),
          status: ro.status,
          title,
          description: desc,
          date: new Date().toISOString(),
          updatedBy: 'Carlos (Líder mecánico)',
          isCompleted: true
        };
        return {
          ...ro,
          timeline: [...ro.timeline, newEvent]
        };
      }
      return ro;
    }));
    pushNotification('success', 'Timeline Actualizado', 'Se añadió un nuevo evento de avance operativo en la orden.');
  };

  // Fast search link from Landing Page
  const handleFastSearchFromLanding = (searchTerm: string, category: string) => {
    setInitialMarketplaceSearch(searchTerm);
    setInitialMarketplaceCategory(category);
    setActivePublicView('marketplace');
  };

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  return (
    <div className="min-h-screen bg-matte-950 font-sans text-gray-300 antialiased flex flex-col justify-between">
      
      {/* GLOBAL TOP SaaS NAVBAR HEADER WITH ROLE ACCENT SWITCH */}
      <header className="sticky top-0 z-40 bg-matte-950/90 backdrop-blur-md border-b border-matte-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-18">
            
            {/* Logo Brand Header Block */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-moto-red flex items-center justify-center font-black text-white text-base shadow-lg">
                M
              </div>
              <div>
                <span className="text-white font-black text-sm tracking-tight block">MotoSaaS</span>
                <span className="text-[9px] font-mono text-gray-500 tracking-wider block">PREMIUM WORKSPACE v1.4</span>
              </div>
            </div>

            {/* Core Role Toggle Switch (Public vs ERP Worker Mode) */}
            <div className="hidden md:flex bg-matte-900 border border-matte-850 p-1 rounded-xl shadow-inner gap-1">
              <button
                onClick={() => {
                  setActiveRole('public');
                  setIsMobileMenuOpen(false);
                }}
                id="role-switch-public"
                className={`px-4.5 py-1.5 rounded-lg font-bold text-xs transition duration-200 cursor-pointer ${
                  activeRole === 'public' 
                    ? 'bg-moto-red text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                🌐 Rol Público (Buscador & Perfil)
              </button>
              <button
                onClick={() => {
                  setActiveRole('erp');
                  setIsMobileMenuOpen(false);
                }}
                id="role-switch-erp"
                className={`px-4.5 py-1.5 rounded-lg font-bold text-xs transition duration-200 cursor-pointer ${
                  activeRole === 'erp' 
                    ? 'bg-moto-blue text-white shadow-md animate-all' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                🛠 Rol Taller (ERP Consola)
              </button>
            </div>

            {/* Menu indicator with quick alerts badge */}
            <div className="flex items-center gap-3">
              
              {/* Alert notifications indicator bell with simulated dropdown trigger */}
              <div className="relative">
                <button
                  onClick={() => {
                    setActiveRole('erp');
                    setActiveErpView('dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  id="notif-indicator-bell"
                  className="p-2 rounded-lg bg-matte-900/60 border border-matte-800 hover:border-gray-500 text-gray-400 hover:text-white transition relative cursor-pointer"
                  title="Consola de Alertas"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-[9px] font-mono font-bold text-white w-4.5 h-4.5 rounded-full flex items-center justify-center border border-matte-950 animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Role Switch trigger drawer button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                id="mobile-nav-toggle"
                className="md:hidden p-2 rounded-lg bg-matte-900 border border-matte-800 text-gray-400 hover:text-white transition shrink-0 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER EXPANSION */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-matte-800 bg-matte-950 px-4 py-4 space-y-4 animate-all">
            <div className="flex bg-matte-900 border border-matte-800 p-1 rounded-xl gap-1">
              <button
                onClick={() => {
                  setActiveRole('public');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-1/2 py-2 rounded-lg font-bold text-xs transition cursor-pointer text-center ${
                  activeRole === 'public' ? 'bg-moto-red text-white' : 'text-gray-500'
                }`}
              >
                🌐 Público
              </button>
              <button
                onClick={() => {
                  setActiveRole('erp');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-1/2 py-2 rounded-lg font-bold text-xs transition cursor-pointer text-center ${
                  activeRole === 'erp' ? 'bg-moto-blue text-white' : 'text-gray-500'
                }`}
              >
                🛠 ERP Taller
              </button>
            </div>

            {/* Sub menus responsive list based on role */}
            <div className="space-y-1">
              {activeRole === 'public' ? (
                <>
                  <button
                    onClick={() => {
                      setActivePublicView('landing');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
                      activePublicView === 'landing' ? 'bg-matte-900 text-white border-l-2 border-moto-red' : 'text-gray-400'
                    }`}
                  >
                    Inicio / Startup
                  </button>
                  <button
                    onClick={() => {
                      setActivePublicView('marketplace');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
                      activePublicView === 'marketplace' ? 'bg-matte-900 text-white border-l-2 border-moto-red' : 'text-gray-400'
                    }`}
                  >
                    Buscador & Stock Radar
                  </button>
                  <button
                    onClick={() => {
                      setActivePublicView('profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
                      activePublicView === 'profile' ? 'bg-matte-900 text-white border-l-2 border-moto-red' : 'text-gray-400'
                    }`}
                  >
                    Perfil del Taller
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setActiveErpView('dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
                      activeErpView === 'dashboard' ? 'bg-matte-900 text-white border-l-2 border-moto-blue' : 'text-gray-400'
                    }`}
                  >
                    Consola KPI (Dashboard)
                  </button>
                  <button
                    onClick={() => {
                      setActiveErpView('inventory');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
                      activeErpView === 'inventory' ? 'bg-matte-900 text-white border-l-2 border-moto-blue' : 'text-gray-400'
                    }`}
                  >
                    Inventario ERP (Almacén)
                  </button>
                  <button
                    onClick={() => {
                      setActiveErpView('bike_registry');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
                      activeErpView === 'bike_registry' ? 'bg-matte-900 text-white border-l-2 border-moto-blue' : 'text-gray-400'
                    }`}
                  >
                    Admisión Moto (Ingresos)
                  </button>
                  <button
                    onClick={() => {
                      setActiveErpView('repairs');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
                      activeErpView === 'repairs' ? 'bg-matte-900 text-white border-l-2 border-moto-blue' : 'text-gray-400'
                    }`}
                  >
                    Control Técnico (Ordenes)
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* SECONDARY SUB-NAVBAR FOR PC CONTROLS */}
      <nav className="hidden md:block bg-matte-900 border-b border-matte-800 py-3 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          <div className="flex items-center gap-6 font-semibold">
            {activeRole === 'public' ? (
              <>
                <button
                  onClick={() => setActivePublicView('landing')}
                  id="subnav-public-landing"
                  className={`transition hover:text-white cursor-pointer ${activePublicView === 'landing' ? 'text-moto-red border-b border-moto-red pb-1' : 'text-gray-400'}`}
                >
                  Inicio / Startup
                </button>
                <button
                  onClick={() => {
                    setInitialMarketplaceSearch('');
                    setInitialMarketplaceCategory('');
                    setActivePublicView('marketplace');
                  }}
                  id="subnav-public-market"
                  className={`transition hover:text-white cursor-pointer ${activePublicView === 'marketplace' ? 'text-moto-red border-b border-moto-red pb-1' : 'text-gray-400'}`}
                >
                  Buscador & Stock Radar
                </button>
                <button
                  onClick={() => setActivePublicView('profile')}
                  id="subnav-public-profile"
                  className={`transition hover:text-white cursor-pointer ${activePublicView === 'profile' ? 'text-moto-red border-b border-moto-red pb-1' : 'text-gray-400'}`}
                >
                  Perfil de Talleres
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveErpView('dashboard')}
                  id="subnav-erp-dash"
                  className={`transition hover:text-white cursor-pointer ${activeErpView === 'dashboard' ? 'text-moto-blue border-b border-moto-blue pb-1' : 'text-gray-400'}`}
                >
                  Consola KPI (Dashboard)
                </button>
                <button
                  onClick={() => setActiveErpView('inventory')}
                  id="subnav-erp-inventory"
                  className={`transition hover:text-white cursor-pointer ${activeErpView === 'inventory' ? 'text-moto-blue border-b border-moto-blue pb-1' : 'text-gray-400'}`}
                >
                  Inventario ERP (Almacén)
                </button>
                <button
                  onClick={() => setActiveErpView('bike_registry')}
                  id="subnav-erp-registry"
                  className={`transition hover:text-white cursor-pointer ${activeErpView === 'bike_registry' ? 'text-moto-blue border-b border-moto-blue pb-1' : 'text-gray-400'}`}
                >
                  Admisión Moto (Ingresos)
                </button>
                <button
                  onClick={() => setActiveErpView('repairs')}
                  id="subnav-erp-repairs"
                  className={`transition hover:text-white cursor-pointer ${activeErpView === 'repairs' ? 'text-moto-blue border-b border-moto-blue pb-1' : 'text-gray-400'}`}
                >
                  Control Técnico (Ordenes)
                </button>
              </>
            )}
          </div>

          {/* Current selected role breadcrumb */}
          <div className="text-[10px] uppercase font-mono text-gray-500">
            Vista: {activeRole === 'public' ? 'Módulo público motociclista' : 'Módulo Mecánico Taller'}
          </div>

        </div>
      </nav>

      {/* CORE RENDER FRAMEWORK (LOADS SELECTED SUB-MODULE BASED ON SELECTED NAV STATES) */}
      <main className="flex-1">
        {activeRole === 'public' ? (
          
          /* PUBLIC MODE CHANGER */
          <>
            {activePublicView === 'landing' && (
              <LandingPage
                onSearch={handleFastSearchFromLanding}
                onNavigateToWorkshops={() => {
                  setInitialMarketplaceSearch('');
                  setInitialMarketplaceCategory('');
                  setActivePublicView('marketplace');
                }}
                onNavigateToWorkshopProfile={(id) => {
                  setSelectedWorkshopId(id);
                  setActivePublicView('profile');
                }}
                onEnterERP={() => {
                  setActiveRole('erp');
                  setActiveErpView('dashboard');
                }}
              />
            )}

            {activePublicView === 'marketplace' && (
              <Marketplace
                initialSearchTerm={initialMarketplaceSearch}
                initialCategory={initialMarketplaceCategory}
                onNavigateToWorkshop={(id) => {
                  setSelectedWorkshopId(id);
                  setActivePublicView('profile');
                }}
                workshopsState={workshopsState}
                partsState={partsState}
              />
            )}

            {activePublicView === 'profile' && (
              <WorkshopProfile
                workshopId={selectedWorkshopId}
                workshopsState={workshopsState}
                partsState={partsState}
              />
            )}
          </>
        ) : (
          
          /* WORKSHOP ADMIN TRIAL MODE */
          <>
            {activeErpView === 'dashboard' && (
              <Dashboard
                partsState={partsState}
                repairsState={repairsState}
                motorcyclesState={motorcyclesState}
                notifications={notifications}
                onMarkNotificationRead={handleMarkNotificationRead}
                onClearAllNotifications={handleClearAllNotifications}
                onNavigateToView={(view) => setActiveErpView(view)}
                onSelectRepairOrder={(id) => {
                  setSelectedRepairId(id);
                  setActiveErpView('repairs');
                }}
              />
            )}

            {activeErpView === 'inventory' && (
              <Inventory
                partsState={partsState}
                onAddPart={handleAddPart}
                onModifyStock={handleModifyStock}
                onDeletePart={handleDeletePart}
              />
            )}

            {activeErpView === 'bike_registry' && (
              <BikeRegistry
                onRegisterBike={handleRegisterBike}
              />
            )}

            {activeErpView === 'repairs' && (
              <RepairOrderSheet
                repairsState={repairsState}
                partsState={partsState}
                motorcyclesState={motorcyclesState}
                onUpdateRepairStatus={handleUpdateRepairStatus}
                onAddRepairItem={handleAddRepairItem}
                onRemoveRepairItem={handleRemoveRepairItem}
                onAddTimelineEvent={handleAddTimelineEvent}
                selectedRepairId={selectedRepairId}
                onSelectRepairOrder={(id) => setSelectedRepairId(id)}
              />
            )}
          </>
        )}
      </main>

    </div>
  );
}
