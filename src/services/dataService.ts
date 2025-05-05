
import { Store, Product, Sale } from '../types';

// Mock data for stores
const stores: Store[] = [
  {
    id: 'store-1',
    name: 'Premium Stationery',
    address: '123 Main Street',
    city: 'Mumbai',
    phone: '022-12345678',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    managers: ['user-2'],
  },
  {
    id: 'store-2',
    name: 'Office Supplies Co.',
    address: '456 Market Road',
    city: 'Delhi',
    phone: '011-87654321',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    managers: ['user-2'],
  },
  {
    id: 'store-3',
    name: 'Scholar Stationery',
    address: '789 College Street',
    city: 'Bangalore',
    phone: '080-45678901',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
  },
];

// Mock data for products
const products: Product[] = [
  {
    id: 'product-1',
    storeId: 'store-1',
    name: 'Premium Notebook',
    description: 'High-quality notebook with 200 pages of acid-free paper and a leather cover.',
    price: 399,
    category: 'Notebooks',
    image: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7',
    stock: 50,
  },
  {
    id: 'product-2',
    storeId: 'store-1',
    name: 'Colored Pens (Pack of 10)',
    description: 'Set of 10 colored gel pens with smooth writing experience.',
    price: 249,
    category: 'Pens',
    image: 'https://images.unsplash.com/photo-1581431886211-6b932f8367f2',
    stock: 100,
  },
  {
    id: 'product-3',
    storeId: 'store-1',
    name: 'Desk Organizer',
    description: 'Wooden desk organizer with multiple compartments for stationery.',
    price: 599,
    category: 'Organization',
    image: 'https://images.unsplash.com/photo-1583484963886-cfe2bff2945f',
    stock: 25,
  },
  {
    id: 'product-4',
    storeId: 'store-2',
    name: 'A4 Printing Paper (500 Sheets)',
    description: 'High-quality A4 size paper for printing and copying.',
    price: 349,
    category: 'Paper',
    image: 'https://images.unsplash.com/photo-1589987607627-51c9c4a5d77e',
    stock: 200,
  },
  {
    id: 'product-5',
    storeId: 'store-2',
    name: 'Sticky Notes Assortment',
    description: 'Assorted pack of colorful sticky notes in various sizes.',
    price: 149,
    category: 'Adhesives',
    image: 'https://images.unsplash.com/photo-1583846783214-7229a91b20ed',
    stock: 150,
  },
  {
    id: 'product-6',
    storeId: 'store-2',
    name: 'Stapler and Pins Set',
    description: 'Heavy-duty stapler with 1000 staple pins included.',
    price: 199,
    category: 'Office Supplies',
    image: 'https://images.unsplash.com/photo-1583845112239-997e4589aee6',
    stock: 75,
  },
  {
    id: 'product-7',
    storeId: 'store-3',
    name: 'Artist Sketchbook',
    description: 'High-quality sketchbook with thick paper for various art mediums.',
    price: 299,
    category: 'Art Supplies',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc',
    stock: 40,
  },
  {
    id: 'product-8',
    storeId: 'store-3',
    name: 'Fountain Pen',
    description: 'Elegant fountain pen with smooth ink flow and replaceable cartridges.',
    price: 799,
    category: 'Pens',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42',
    stock: 30,
  },
  {
    id: 'product-9',
    storeId: 'store-3',
    name: 'Scientific Calculator',
    description: 'Advanced calculator with scientific and statistical functions.',
    price: 549,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352',
    stock: 35,
  },
];

// Mock data for sales
const sales: Sale[] = [
  {
    id: 'sale-1',
    storeId: 'store-1',
    userId: 'user-3',
    products: [
      {
        productId: 'product-1',
        quantity: 2,
        priceAtSale: 399,
      },
      {
        productId: 'product-2',
        quantity: 1,
        priceAtSale: 249,
      },
    ],
    totalAmount: 1047,
    date: '2025-04-27T10:30:00Z',
  },
  {
    id: 'sale-2',
    storeId: 'store-2',
    userId: 'user-3',
    products: [
      {
        productId: 'product-4',
        quantity: 3,
        priceAtSale: 349,
      },
    ],
    totalAmount: 1047,
    date: '2025-05-01T14:45:00Z',
  },
];

// Service functions to get and manipulate the data
export const getStores = (): Promise<Store[]> => {
  return Promise.resolve(stores);
};

export const getStoreById = (id: string): Promise<Store | undefined> => {
  return Promise.resolve(stores.find(store => store.id === id));
};

export const getProducts = (): Promise<Product[]> => {
  return Promise.resolve(products);
};

export const getProductsByStoreId = (storeId: string): Promise<Product[]> => {
  return Promise.resolve(products.filter(product => product.storeId === storeId));
};

export const getProductById = (id: string): Promise<Product | undefined> => {
  return Promise.resolve(products.find(product => product.id === id));
};

export const getSalesByStoreId = (storeId: string): Promise<Sale[]> => {
  return Promise.resolve(sales.filter(sale => sale.storeId === storeId));
};

export const addProduct = (product: Omit<Product, 'id'>): Promise<Product> => {
  const newProduct = {
    ...product,
    id: `product-${products.length + 1}`,
  };
  
  products.push(newProduct);
  return Promise.resolve(newProduct);
};

export const updateProduct = (product: Product): Promise<Product> => {
  const index = products.findIndex(p => p.id === product.id);
  if (index !== -1) {
    products[index] = product;
  }
  return Promise.resolve(product);
};

export const deleteProduct = (id: string): Promise<void> => {
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products.splice(index, 1);
  }
  return Promise.resolve();
};

export const addStore = (store: Omit<Store, 'id'>): Promise<Store> => {
  const newStore = {
    ...store,
    id: `store-${stores.length + 1}`,
  };
  
  stores.push(newStore);
  return Promise.resolve(newStore);
};

export const updateStore = (store: Store): Promise<Store> => {
  const index = stores.findIndex(s => s.id === store.id);
  if (index !== -1) {
    stores[index] = store;
  }
  return Promise.resolve(store);
};

export const addSale = (sale: Omit<Sale, 'id' | 'date'>): Promise<Sale> => {
  const newSale = {
    ...sale,
    id: `sale-${sales.length + 1}`,
    date: new Date().toISOString(),
  };
  
  sales.push(newSale);
  return Promise.resolve(newSale);
};
