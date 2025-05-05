
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStores } from "@/services/dataService";
import { Store } from "@/types";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store as StoreIcon } from "lucide-react";

const StoresList = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getStores();
        setStores(data);
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Our Stores</h1>
            <p className="text-muted-foreground mt-2">
              Explore our collection of stationery stores across India
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <StoreIcon className="mx-auto h-12 w-12 text-muted animate-pulse" />
              <p className="mt-4 text-muted-foreground">Loading stores...</p>
            </div>
          </div>
        ) : (
          <div className="store-grid">
            {stores.map((store) => (
              <Card key={store.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="h-full w-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold">{store.name}</h2>
                  <p className="text-muted-foreground mt-2">{store.city}</p>
                  <p className="text-sm mt-1">{store.address}</p>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 px-6 py-4">
                  <Link to={`/stores/${store.id}`} className="w-full">
                    <Button variant="default" className="w-full">
                      View Store
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StoresList;
