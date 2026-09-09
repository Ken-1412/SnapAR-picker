export interface SKUItem {
  sku: string;
  name: string;
  category: string;
  rack: string;
  aisle: string;
  zone: string;
  digitalStock: number;
  physicalStock: number;
  unit: string;
  confidence: number;
  imageUrl?: string;
  languageLabels?: {
    cn?: string;
    id?: string;
    en?: string;
  };
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  buyerName: string;
  marketLocation: 'Yiwu International Trade City' | 'Guangzhou Wholesale Market' | 'Jakarta Pasar Main Hub' | 'Surabaya Logistics Yard';
  status: 'pending' | 'in_progress' | 'verified' | 'completed' | 'exception';
  items: {
    sku: string;
    name: string;
    qtyRequired: number;
    qtyPicked: number;
    rack: string;
    verified: boolean;
  }[];
  assignedWorker: string;
  createdAt: string;
  priority: 'HIGH' | 'NORMAL' | 'URGENT';
}

export interface WorkerTelemetry {
  id: string;
  name: string;
  avatar: string;
  device: string;
  battery: number;
  fps: number;
  npuLatencyMs: number;
  status: 'picking' | 'idle' | 'exception' | 'offline';
  currentOrder: string;
  location: string;
  itemsPickedToday: number;
  errorRate: number;
  edgeMode: 'NPU_HEXAGON' | 'CLOUD_HYBRID' | 'OFFLINE_LOCAL';
}

export interface DetectedObject {
  id: string;
  sku: string;
  name: string;
  confidence: number;
  bbox: { x: number; y: number; w: number; h: number }; // percentage based relative to AR container
  rack: string;
  quantity: number;
  status: 'target' | 'nearby_similar' | 'irrelevant' | 'anomaly';
}

export const MOCK_SKUS: SKUItem[] = [
  {
    sku: 'SKU-2048',
    name: '500g High-Grade Green Tea Box',
    category: 'Packaged Goods',
    rack: 'Rack C4-18',
    aisle: 'Aisle 7',
    zone: 'Zone C (Wholesale Foods)',
    digitalStock: 120,
    physicalStock: 120,
    unit: 'boxes',
    confidence: 0.98,
    languageLabels: { cn: '500克 特级绿茶礼盒', id: 'Kotak Teh Hijau 500g', en: '500g Premium Green Tea Box' }
  },
  {
    sku: 'SKU-2049',
    name: '500g Black Tea Box (Similar Packaging)',
    category: 'Packaged Goods',
    rack: 'Rack C4-19',
    aisle: 'Aisle 7',
    zone: 'Zone C (Wholesale Foods)',
    digitalStock: 85,
    physicalStock: 82,
    unit: 'boxes',
    confidence: 0.89,
    languageLabels: { cn: '500克 精选红茶礼盒', id: 'Kotak Teh Hitam 500g', en: '500g Select Black Tea Box' }
  },
  {
    sku: 'SKU-4081',
    name: 'Industrial Micro-Motor Assembly',
    category: 'Electronics / Parts',
    rack: 'Rack B2-04',
    aisle: 'Aisle 4',
    zone: 'Zone B (Hardware & Parts)',
    digitalStock: 450,
    physicalStock: 442,
    unit: 'units',
    confidence: 0.96,
    languageLabels: { cn: '微型电机总成', id: 'Rakitan Motor Mikro Industrial', en: 'Micro-Motor Assembly' }
  },
  {
    sku: 'SKU-9102',
    name: 'Fresh Cavendish Bananas (Grade A)',
    category: 'Fresh Produce',
    rack: 'Bay P1-02',
    aisle: 'Aisle 1',
    zone: 'Zone P (Cold Chain & Produce)',
    digitalStock: 60,
    physicalStock: 52, // Mismatch scenario!
    unit: 'crates',
    confidence: 0.91,
    languageLabels: { cn: '香蕉 (A级)', id: 'Pisang Cavendish Segar (Kelas A)', en: 'Fresh Cavendish Bananas (Grade A)' }
  },
  {
    sku: 'SKU-3310',
    name: 'Silicone Gasket Seal Strip 50m',
    category: 'Hardware',
    rack: 'Rack A1-12',
    aisle: 'Aisle 2',
    zone: 'Zone A (Raw Materials)',
    digitalStock: 310,
    physicalStock: 310,
    unit: 'rolls',
    confidence: 0.94,
    languageLabels: { cn: '50米 硅胶密封条', id: 'Strip Seal Silikon 50m', en: '50m Silicone Gasket Strip' }
  }
];

export const MOCK_ORDERS: OrderItem[] = [
  {
    id: 'ORD-20481',
    orderNumber: '#20481',
    buyerName: 'PT Nusantara Global Wholesale',
    marketLocation: 'Jakarta Pasar Main Hub',
    status: 'in_progress',
    assignedWorker: 'Worker 047 (Li Wei)',
    createdAt: '10 mins ago',
    priority: 'URGENT',
    items: [
      { sku: 'SKU-2048', name: '500g High-Grade Green Tea Box', qtyRequired: 5, qtyPicked: 2, rack: 'Rack C4-18', verified: false },
      { sku: 'SKU-4081', name: 'Industrial Micro-Motor Assembly', qtyRequired: 12, qtyPicked: 0, rack: 'Rack B2-04', verified: false },
      { sku: 'SKU-3310', name: 'Silicone Gasket Seal Strip 50m', qtyRequired: 3, qtyPicked: 0, rack: 'Rack A1-12', verified: false }
    ]
  },
  {
    id: 'ORD-20482',
    orderNumber: '#20482',
    buyerName: 'Yiwu Export Trading Co.',
    marketLocation: 'Yiwu International Trade City',
    status: 'pending',
    assignedWorker: 'Worker 012 (Siti Rahma)',
    createdAt: '25 mins ago',
    priority: 'HIGH',
    items: [
      { sku: 'SKU-9102', name: 'Fresh Cavendish Bananas (Grade A)', qtyRequired: 8, qtyPicked: 0, rack: 'Bay P1-02', verified: false }
    ]
  }
];

export const MOCK_WORKERS: WorkerTelemetry[] = [
  {
    id: 'w-047',
    name: 'Li Wei',
    avatar: 'LW',
    device: 'Snapdragon AR Glasses Gen2',
    battery: 84,
    fps: 60,
    npuLatencyMs: 10.7,
    status: 'picking',
    currentOrder: '#20481',
    location: 'Aisle 7 / Rack C4-18',
    itemsPickedToday: 342,
    errorRate: 0.02,
    edgeMode: 'NPU_HEXAGON'
  },
  {
    id: 'w-012',
    name: 'Siti Rahma',
    avatar: 'SR',
    device: 'Qualcomm Spatial Compute Pod',
    battery: 92,
    fps: 58,
    npuLatencyMs: 11.2,
    status: 'picking',
    currentOrder: '#20482',
    location: 'Aisle 1 / Bay P1-02',
    itemsPickedToday: 289,
    errorRate: 0.01,
    edgeMode: 'NPU_HEXAGON'
  },
  {
    id: 'w-089',
    name: 'Budi Santoso',
    avatar: 'BS',
    device: 'Snapdragon AR Glasses Gen1',
    battery: 45,
    fps: 54,
    npuLatencyMs: 14.1,
    status: 'idle',
    currentOrder: 'None',
    location: 'Zone B Staging Area',
    itemsPickedToday: 190,
    errorRate: 0.04,
    edgeMode: 'OFFLINE_LOCAL'
  }
];
