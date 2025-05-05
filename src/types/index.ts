
export type UserRole = 'admin' | 'manager' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managedStores?: string[]; // For managers, list of store IDs they manage
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  image: string;
  managers?: string[]; // IDs of managers who can manage this store
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  storeId: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
    priceAtSale: number;
  }[];
  totalAmount: number;
  date: string;
}
