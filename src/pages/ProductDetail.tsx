
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, getStoreById } from "@/services/dataService";
import { Product, Store } from "@/types";
import MainLayout from "@/components/Layout/MainLayout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Package, Store as StoreIcon, Minus, Plus } from "lucide-react";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();
  const { currentUser, isCustomer } = useAuth();

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;

      setIsLoading(true);
      try {
        const productData = await getProductById(productId);
        if (productData) {
          setProduct(productData);
          const storeData = await getStoreById(productData.storeId);
          if (storeData) {
            setStore(storeData);
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
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
              <Package className="mx-auto h-12 w-12 text-muted animate-pulse" />
              <p className="mt-4 text-muted-foreground">Loading product details...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product || !store) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <p className="mt-4 text-muted-foreground">
              The product you're looking for doesn't exist or has been removed.
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
      <div className="container py-12">
        <div className="mb-6">
          <Link
            to={`/stores/${store.id}`}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <StoreIcon className="mr-1 h-4 w-4" />
            Back to {store.name}
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          {/* Product Image */}
          <div className="overflow-hidden rounded-md border bg-muted">
            <div className="aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain p-6"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge>{product.category}</Badge>
              <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
              <p className="mt-4 text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium">Description</h3>
              <p className="mt-2 text-muted-foreground">
                {product.description}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium">Store</h3>
              <Link
                to={`/stores/${store.id}`}
                className="mt-2 flex items-center text-muted-foreground hover:text-foreground"
              >
                <StoreIcon className="mr-2 h-4 w-4" />
                {store.name}, {store.city}
              </Link>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium">Availability</h3>
              <p className="mt-2 text-muted-foreground">
                {product.stock > 0 
                  ? `In stock (${product.stock} available)` 
                  : "Out of stock"}
              </p>
            </div>

            {isCustomer && product.stock > 0 && (
              <>
                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleDecreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 1 && value <= product.stock) {
                          setQuantity(value);
                        }
                      }}
                      className="w-16 text-center"
                      min={1}
                      max={product.stock}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleIncreaseQuantity}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                  >
                    Add to Cart
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
