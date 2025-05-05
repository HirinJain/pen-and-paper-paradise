
import React, { useState, useEffect } from "react";
import { getStores, getProducts, getSalesByStoreId } from "@/services/dataService";
import { Store, Product, Sale } from "@/types";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Store as StoreIcon, Package, BarChartBig } from "lucide-react";

const DashboardHome = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, isAdmin, isManager } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const storesData = await getStores();
        setStores(storesData);

        const productsData = await getProducts();
        setProducts(productsData);

        if (isAdmin) {
          // For admin, get all sales from all stores
          let allSales: Sale[] = [];
          for (const store of storesData) {
            const storeSales = await getSalesByStoreId(store.id);
            allSales = [...allSales, ...storeSales];
          }
          setSales(allSales);
        } else if (isManager && currentUser?.managedStores) {
          // For manager, get sales only for stores they manage
          let managerSales: Sale[] = [];
          for (const storeId of currentUser.managedStores) {
            const storeSales = await getSalesByStoreId(storeId);
            managerSales = [...managerSales, ...storeSales];
          }
          setSales(managerSales);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, isAdmin, isManager]);

  const getTotalSalesAmount = () => {
    return sales.reduce((total, sale) => total + sale.totalAmount, 0);
  };

  // Filter stores and products based on user role
  const filteredStores = isAdmin
    ? stores
    : stores.filter(
        (store) => isManager && currentUser?.managedStores?.includes(store.id)
      );

  const filteredProducts = isAdmin
    ? products
    : products.filter(
        (product) =>
          isManager && currentUser?.managedStores?.includes(product.storeId)
      );

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {currentUser?.name}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              <StoreIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : filteredStores.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? "Across all locations" : "Under your management"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : filteredProducts.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? "In all stores" : "In managed stores"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <BarChartBig className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : `₹${getTotalSalesAmount().toFixed(2)}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {sales.length} transactions
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <p className="text-muted-foreground">
            Welcome to your dashboard. From here, you can manage your stationery stores, products, and view sales data.
          </p>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Quick Links</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="text-primary hover:underline">
                  <a href="/dashboard/stores">Manage Stores</a>
                </li>
                <li className="text-primary hover:underline">
                  <a href="/dashboard/products">Manage Products</a>
                </li>
                <li className="text-primary hover:underline">
                  <a href="/dashboard/sales">View Sales Reports</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
