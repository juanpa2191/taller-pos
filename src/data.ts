import { Workshop, Part, Motorcycle, RepairOrder, Review } from './types';

export const MOTORCYCLE_BRANDS = [
  'Yamaha',
  'Honda',
  'Suzuki',
  'Kawasaki',
  'KTM',
  'Ducati',
  'BMW',
  'Harley-Davidson'
];

export const BIKE_MODELS_BY_BRAND: Record<string, { model: string; cc: number; years: number[] }[]> = {
  Yamaha: [
    { model: 'YZF-R3', cc: 321, years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    { model: 'MT-07', cc: 689, years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    { model: 'NMAX 155', cc: 155, years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    { model: 'XTZ 250 Lander', cc: 249, years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] }
  ],
  Honda: [
    { model: 'CB500X', cc: 471, years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    { model: 'Africa Twin CRF1100D', cc: 1084, years: [2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    { model: 'CB300R', cc: 286, years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    { model: 'PCX 160', cc: 156, years: [2021, 2022, 2023, 2024, 2025, 2026] }
  ],
  Suzuki: [
    { model: 'GIXXER SF 250', cc: 249, years: [2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    { model: 'V-Strom 650XT', cc: 645, years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    { model: 'GSX-S750', cc: 749, years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] }
  ],
  Kawasaki: [
    { model: 'Ninja 400', cc: 399, years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    { model: 'Z900', cc: 948, years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    { model: 'Versys-X 300', cc: 296, years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] }
  ],
  KTM: [
    { model: 'Duke 390', cc: 373, years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    { model: 'Adventure 390', cc: 373, years: [2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    { model: 'RC 200', cc: 199, years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] }
  ],
  Ducati: [
    { model: 'Monster 937', cc: 937, years: [2021, 2022, 2023, 2024, 2025, 2026] },
    { model: 'Scrambler Icon', cc: 803, years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] }
  ],
  BMW: [
    { model: 'G 310 GS', cc: 313, years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
    { model: 'F 850 GS', cc: 853, years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] }
  ],
  'Harley-Davidson': [
    { model: 'Iron 883', cc: 883, years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
    { model: 'Sportster S', cc: 1252, years: [2021, 2022, 2023, 2024, 2025, 2026] }
  ]
};

export const SPARE_PART_CATEGORIES = [
  'Frenos',
  'Motor y Transmisión',
  'Sistemas de Filtro y Lubricación',
  'Electrónica y Luces',
  'Suspensión y Dirección',
  'Neumáticos y Ruedas',
  'Accesorios y Carenaje'
];

export const INITIAL_WORKSHOPS: Workshop[] = [
  {
    id: 'W-01',
    name: 'Mototek Precision Lab',
    rating: 4.9,
    reviewsCount: 148,
    phone: '+5491123456789',
    whatsapp: 'https://wa.me/5491123456789?text=Hola%20Mototek%2C%20vi%20su%20taller%20en%20MotoERP%2C%20querr%C3%ADa%20consultar%20por...',
    address: 'Av. Juan B. Justo 3420',
    city: 'Palermo, CABA',
    distance: '0.8 km',
    latitude: -34.5829,
    longitude: -58.4357,
    hours: 'Lun a Vie 08:30 - 19:00 | Sáb 09:00 - 14:00',
    avatar: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=120&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=800&auto=format&fit=crop&q=80',
    description: 'Especialistas certificados en motocicletas de alta cilindrada. Laboratorio de diagnóstico por computadora scanner de última generación, calibración de inyección y service oficial multimarca.'
  },
  {
    id: 'W-02',
    name: 'Apex Speed Services',
    rating: 4.7,
    reviewsCount: 92,
    phone: '+5491156789012',
    whatsapp: 'https://wa.me/5491156789012?text=Hola%20Apex%2C%20busco%20un%20repuesto%20espec%C3%ADfico...',
    address: 'Av. Dorrego 1240',
    city: 'Chacarita, CABA',
    distance: '1.5 km',
    latitude: -34.5901,
    longitude: -58.4485,
    hours: 'Lun a Vie 09:00 - 18:30 | Sáb 09:00 - 13:00',
    avatar: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=120&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80',
    description: 'Expertos en suspensiones deportivas Öhlins y Showa. Rectificación de motores, embragues de alta performance y puesta a punto integral para calle y circuito.'
  },
  {
    id: 'W-03',
    name: 'Rider Custom & Restoration',
    rating: 4.8,
    reviewsCount: 64,
    phone: '+5491198765432',
    whatsapp: 'https://wa.me/5491198765432?text=Hola%20RiderCustom%2C%20presupuestan%20restauraciones%3F...',
    address: 'Av. Córdoba 5670',
    city: 'Villa Crespo, CABA',
    distance: '2.3 km',
    latitude: -34.5945,
    longitude: -58.4312,
    hours: 'Lun a Vie 10:00 - 20:00 | Sáb 10:00 - 15:00',
    avatar: 'https://images.unsplash.com/photo-1625047509128-8d0ac0de43fc?w=120&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1516496636080-14fb876e029f?w=800&auto=format&fit=crop&q=80',
    description: 'El santuario de las motos Custom, Cafe Racer y restauraciones vintage. Pintura al horno, tapicería artesanal personalizada y fabricación de escapes a medida.'
  }
];

export const INITIAL_PARTS: Part[] = [
  // W-01 Inventory & Marketplace Available
  {
    id: 'P-01',
    name: 'Pastillas de Freno Brembo Sinterizadas (Delanteras)',
    sku: 'BRM-09072-SD',
    brand: 'Brembo',
    modelCompatibility: ['MT-07', 'YZF-R3', 'Ninja 400'],
    compatibilityRange: { brand: 'Yamaha', model: 'MT-07', yearStart: 2018, yearEnd: 2026, cc: 689 },
    price: 68100,
    stock: 14,
    minStock: 4,
    category: 'Frenos',
    shelfLocation: 'Estante A-4',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&auto=format&fit=crop&q=80',
    workshopId: 'W-01'
  },
  {
    id: 'P-02',
    name: 'Filtro de Aceite K&N Premium KN-204',
    sku: 'KN-204-PREM',
    brand: 'K&N',
    modelCompatibility: ['MT-07', 'CB500X', 'Ninja 400', 'Duke 390'],
    compatibilityRange: { brand: 'Yamaha', model: 'MT-07', yearStart: 2016, yearEnd: 2026, cc: 689 },
    price: 24500,
    stock: 2, // Low stock on purpose
    minStock: 5,
    category: 'Sistemas de Filtro y Lubricación',
    shelfLocation: 'Estante B-12',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
    workshopId: 'W-01'
  },
  {
    id: 'P-03',
    name: 'Kit de Transmisión DID con Cadena Dorada O-Ring 520',
    sku: 'DID-520-VX3',
    brand: 'DID',
    modelCompatibility: ['Duke 390', 'Ninja 400', 'YZF-R3'],
    compatibilityRange: { brand: 'KTM', model: 'Duke 390', yearStart: 2017, yearEnd: 2026, cc: 373 },
    price: 115000,
    stock: 8,
    minStock: 3,
    category: 'Motor y Transmisión',
    shelfLocation: 'Pasillo Central C-3',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&auto=format&fit=crop&q=80',
    workshopId: 'W-01'
  },
  // W-02 Inventory
  {
    id: 'P-04',
    name: 'Bujía Iridium NGK CR9EIX',
    sku: 'NGK-CR9EIX',
    brand: 'NGK',
    modelCompatibility: ['YZF-R3', 'Ninja 400', 'Z900'],
    compatibilityRange: { brand: 'Kawasaki', model: 'Ninja 400', yearStart: 2018, yearEnd: 2026, cc: 399 },
    price: 18600,
    stock: 35,
    minStock: 10,
    category: 'Electrónica y Luces',
    shelfLocation: 'Contenedor E-2',
    imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=300&auto=format&fit=crop&q=80',
    workshopId: 'W-02'
  },
  {
    id: 'P-05',
    name: 'Aceite de Motor Motul 7100 10W40 100% Sintético (1L)',
    sku: 'MTL-7100-10W40',
    brand: 'Motul',
    modelCompatibility: ['MT-07', 'CB500X', 'V-Strom 650XT', 'Monster 937'],
    compatibilityRange: { brand: 'Ducati', model: 'Monster 937', yearStart: 2021, yearEnd: 2026, cc: 937 },
    price: 29900,
    stock: 48,
    minStock: 12,
    category: 'Sistemas de Filtro y Lubricación',
    shelfLocation: 'Pasillo Lubricantes L-1',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300&auto=format&fit=crop&q=80',
    workshopId: 'W-02'
  },
  // W-03 Custom / Cruiser Inventory
  {
    id: 'P-06',
    name: 'Filtro de Aire K&N Alto Flujo XL-883',
    sku: 'KN-HD-883',
    brand: 'K&N',
    modelCompatibility: ['Iron 883'],
    compatibilityRange: { brand: 'Harley-Davidson', model: 'Iron 883', yearStart: 2015, yearEnd: 2024, cc: 883 },
    price: 98000,
    stock: 3,
    minStock: 2,
    category: 'Sistemas de Filtro y Lubricación',
    shelfLocation: 'Estante Especial HD-1',
    imageUrl: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=300&auto=format&fit=crop&q=80',
    workshopId: 'W-03'
  },
  {
    id: 'P-07',
    name: 'Neumático Metzeler Karoo Street (Trasero - 150/70 R17)',
    sku: 'MTZ-KRO-150',
    brand: 'Metzeler',
    modelCompatibility: ['V-Strom 650XT', 'F 850 GS', 'Adventure 390', 'CB500X'],
    compatibilityRange: { brand: 'Honda', model: 'CB500X', yearStart: 2017, yearEnd: 2026, cc: 471 },
    price: 195000,
    stock: 6,
    minStock: 2,
    category: 'Neumáticos y Ruedas',
    shelfLocation: 'Sector Neumáticos N-4',
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=300&auto=format&fit=crop&q=80',
    workshopId: 'W-01'
  }
];

export const INITIAL_MOTORCYCLES: Motorcycle[] = [
  {
    id: 'M-01',
    plate: 'A078KLM',
    brand: 'Yamaha',
    model: 'MT-07',
    year: 2022,
    cc: 689,
    mileage: 18450,
    ownerName: 'Ignacio Garmendia',
    ownerPhone: '+5491166554433',
    ownerEmail: 'ignacio.g@gmail.com',
    diagnostics: 'Ruido metálico en la zona del piñón al traccionar. Testigo de presión de aceite se enciende de forma intermitente. Service de los 18,000 km vencido.',
    entryDate: '2026-05-27T09:30:00Z'
  },
  {
    id: 'M-02',
    plate: '841-BVD',
    brand: 'KTM',
    model: 'Duke 390',
    year: 2021,
    cc: 373,
    mileage: 12100,
    ownerName: 'Camila Rossi',
    ownerPhone: '+5491177889900',
    ownerEmail: 'camila.rossi@yahoo.com',
    diagnostics: 'Falta de aceleración abrupta sobre las 6000 RPM. Requiere cambio de kit de transmisión completo solicitado por el cliente. Control de juego libre en los frenos traseros.',
    entryDate: '2026-05-28T14:15:00Z'
  },
  {
    id: 'M-03',
    plate: 'A153STB',
    brand: 'Honda',
    model: 'CB500X',
    year: 2023,
    cc: 471,
    mileage: 8300,
    ownerName: 'Marcos Benítez',
    ownerPhone: '+5491122334455',
    ownerEmail: 'mbenitez@gmail.com',
    diagnostics: 'Inestabilidad en la suspensión delantera tras caída leve de costado. Se requiere alineación de barrales de suspensión, purgado de líquido de frenos y cambio de pastillas delanteras.',
    entryDate: '2026-05-29T10:00:00Z'
  }
];

export const INITIAL_REPAIR_ORDERS: RepairOrder[] = [
  {
    id: 'RO-01',
    orderNumber: 'RO-2026-001',
    motorcycleId: 'M-01',
    workshopId: 'W-01',
    clientName: 'Ignacio Garmendia',
    clientPhone: '+5491166554433',
    status: 'repairing',
    items: [
      { partId: 'P-02', name: 'Filtro de Aceite K&N Premium KN-204', quantity: 1, unitPrice: 24500, type: 'part' },
      { partId: 'P-05', name: 'Aceite de Motor Motul 7100 10W40 (3 Litros)', quantity: 3, unitPrice: 29900, type: 'part' },
      { name: 'Mano de Obra - Service 18k Completo', quantity: 1, unitPrice: 45000, type: 'labor' },
      { name: 'Mano de Obra - Diagnóstico Eléctrico Sensor Presión', quantity: 1, unitPrice: 15000, type: 'labor' }
    ],
    notes: 'Revisado sensor de presión de aceite. Cableado corregido por falso contacto debido a vibración excesiva. Lubricando cilindros y ajustando torque de tapas.',
    evidencePhotos: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&auto=format&fit=crop&q=80'
    ],
    timeline: [
      { id: 'T-1', status: 'ingress', title: 'Vehículo Ingresado', description: 'Recepción oficial de la Yamaha MT-07. Kilometraje verificado: 18,450 km. Registrado por Técnico Javier.', date: '2026-05-27T09:30:00Z', updatedBy: 'Santi (admin)', isCompleted: true },
      { id: 'T-2', status: 'diagnosing', title: 'Diagnóstico Completado', description: 'Scanner acusa error intermitente de presión de aceite (código P0520). Falso contacto verificado en arnés eléctrico. Transmisión ok pero requiere ajuste.', date: '2026-05-27T16:00:00Z', updatedBy: 'Carlos (Líder mecánico)', isCompleted: true },
      { id: 'T-3', status: 'waiting_parts', title: 'Repuestos Solicitados', description: 'Asignando del stock interno: 3 litros de Aceite Motul 7100 y de Filtro K&N. Stock confirmado.', date: '2026-05-28T10:00:00Z', updatedBy: 'Santi (admin)', isCompleted: true },
      { id: 'T-4', status: 'repairing', title: 'Trabajo en Progreso', description: 'Cambio de aceite y filtro completado. Ajuste y tensión de cables de inyección. Próximo paso: Test ride de comportamiento dinámico.', date: '2026-05-29T11:30:00Z', updatedBy: 'Carlos (Líder mecánico)', isCompleted: true }
    ],
    startedAt: '2026-05-27T09:30:00Z',
    estimatedDelivery: '2026-05-30T18:00:00Z'
  },
  {
    id: 'RO-02',
    orderNumber: 'RO-2026-002',
    motorcycleId: 'M-02',
    workshopId: 'W-01',
    clientName: 'Camila Rossi',
    clientPhone: '+5491177889900',
    status: 'waiting_parts',
    items: [
      { partId: 'P-03', name: 'Kit de Transmisión DID O-Ring 520 (KTM)', quantity: 1, unitPrice: 115000, type: 'part' },
      { name: 'Mano de Obra - Reemplazo Kit Transmisión + Corona/Piñón', quantity: 1, unitPrice: 38000, type: 'labor' }
    ],
    notes: 'Esperando el arribo del piñón de 15 dientes específico de KTM Duke original para acoplar con la cadena dorada de alta resistencia.',
    evidencePhotos: [
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop&q=80'
    ],
    timeline: [
      { id: 'T-5', status: 'ingress', title: 'Moto Ingresada', description: 'Duke 390 entra por pérdida de tracción progresiva en corona trasera.', date: '2026-05-28T14:15:00Z', updatedBy: 'Santi (admin)', isCompleted: true },
      { id: 'T-6', status: 'diagnosing', title: 'Inspección Mecánica', description: 'Corona trasera con dientes filosos ("dientes de tiburón") por falta de mantenimiento de lubricación. Cadena estirada al límite.', date: '2026-05-28T17:30:00Z', updatedBy: 'Carlos (Líder mecánico)', isCompleted: true },
      { id: 'T-7', status: 'waiting_parts', title: 'Falta Piñón OEM KTM', description: 'Cadena DID 520 ya fue descontada de almacén. Se ordenó el piñón OEM específico a fábrica.', date: '2026-05-29T09:00:00Z', updatedBy: 'Santi (admin)', isCompleted: true }
    ],
    startedAt: '2026-05-28T14:15:00Z',
    estimatedDelivery: '2026-06-02T13:00:00Z'
  },
  {
    id: 'RO-03',
    orderNumber: 'RO-2026-003',
    motorcycleId: 'M-03',
    workshopId: 'W-01',
    clientName: 'Marcos Benítez',
    clientPhone: '+5491122334455',
    status: 'ingress',
    items: [
      { partId: 'P-01', name: 'Pastillas de Freno Brembo Sinterizadas (CB500X)', quantity: 1, unitPrice: 68100, type: 'part' },
      { name: 'Mano de Obra - Reparación Líquido de Frenos y Purgado', quantity: 1, unitPrice: 18000, type: 'labor' },
      { name: 'Mano de Obra - Alineación de barrales delanteros', quantity: 1, unitPrice: 32000, type: 'labor' }
    ],
    notes: 'Recepción inicial posterior al accidente. El cliente expresa vibración sobre los barrales al superar 80km/h.',
    evidencePhotos: [],
    timeline: [
      { id: 'T-8', status: 'ingress', title: 'Vehículo Ingresado', description: 'Se verificó daño menor estético en carenado delantero derecho y barrales de suspensión desalineados.', date: '2026-05-29T10:00:00Z', updatedBy: 'Santi (admin)', isCompleted: true }
    ],
    startedAt: '2026-05-29T10:00:00Z',
    estimatedDelivery: '2026-06-03T18:00:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'R-1',
    author: 'Mateo Fernández',
    rating: 5,
    date: '2026-05-20',
    comment: 'Llevé mi MT-09 por una falla esquiva en la inyección electrónica. En solo 3 horas dieron con el sensor TPS defectuoso y lo cambiaron. Son un quirófano de motos, muy profesionales y limpios.',
    bikeModel: 'Yamaha MT-09'
  },
  {
    id: 'R-2',
    author: 'Daniela Ortelli',
    rating: 5,
    date: '2026-05-14',
    comment: 'Excelente atención. Me encantó poder seguir en tiempo real el progreso de la reparación de mi CB500X con las fotos de evidencia que suben los mecánicos. Te da total tranquilidad.',
    bikeModel: 'Honda CB500X'
  },
  {
    id: 'R-3',
    author: 'Sebastián Gómez',
    rating: 4,
    date: '2026-04-28',
    comment: 'Muy buenos profesionales mecánicos. Gran stock de pastillas de frenos y aceites de primera línea. Un poco difícil conseguir turnos rápidos pero la espera vale el gran nivel de garantía.',
    bikeModel: 'KTM Duke 390'
  }
];
