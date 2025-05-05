
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoreById, getProductsByStoreId, addProduct } from "@/services/dataService";
import { Store, Product } from "@/types";
import MainLayout from "@/components/Layout/MainLayout";
import { Store as StoreIcon, Package, Phone, MapPin, Plus } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const StoreDetail = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, isAdmin, isManager, canManageStore } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // New product dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    storeId: storeId,
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    stock: 0,
  });

  useEffect(() => {
    const fetchStoreDetails = async () => {
      if (!storeId) return;

      setIsLoading(true);
      try {
        const storeData = await getStoreById(storeId);
        if (storeData) {
          setStore(storeData);
          const productsData = await getProductsByStoreId(storeId);
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Error fetching store details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreDetails();
  }, [storeId]);

  const handleAddProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.price) {
        toast({
          title: "Validation error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const addedProduct = await addProduct({
        storeId: storeId!,
        name: newProduct.name!,
        description: newProduct.description || "",
        price: newProduct.price!,
        category: newProduct.category || "Other",
        image: newProduct.image || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
        stock: newProduct.stock || 0,
      });

      setProducts([...products, addedProduct]);
      setIsAddDialogOpen(false);
      
      // Reset the form
      setNewProduct({
        storeId: storeId,
        name: "",
        description: "",
        price: 0,
        category: "",
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
        stock: 0,
      });

      toast({
        title: "Product added",
        description: "New product has been added to the store",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <StoreIcon className="mx-auto h-12 w-12 text-muted animate-pulse" />
              <p className="mt-4 text-muted-foreground">Loading store details...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!store) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Store not found</h1>
            <p className="mt-4 text-muted-foreground">
              The store you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild className="mt-6">
              <Link to="/stores">Back to Stores</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Store Info */}
          <div className="md:col-span-1">
            <div className="sticky top-20">
              <div className="overflow-hidden rounded-lg border bg-card">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">{store.name}</h1>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {store.address}, {store.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{store.phone}</span>
                    </div>
                  </div>

                  {(isAdmin || (isManager && canManageStore(store.id))) && (
                    <div className="mt-6">
                      <Button asChild className="w-full">
                        <Link to={`/dashboard/stores/${store.id}/manage`}>
                          Manage Store
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="md:col-span-2">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Products</h2>
                {isAdmin && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                  </Button>
                )}
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-muted" />
                  <p className="mt-4 text-muted-foreground">
                    No products available in this store yet.
                  </p>
                </div>
              ) : (
                <div className="product-grid">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-all hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold truncate-2">{product.name}</h3>
                          <Badge>{product.category}</Badge>
                        </div>
                        <p className="text-lg font-bold text-primary mt-2">
                          {formatPrice(product.price)}
                        </p>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 px-6 py-4">
                        <Button asChild className="w-full">
                          <Link to={`/products/${product.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Product name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Product description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                placeholder="Product category"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default StoreDetail;
