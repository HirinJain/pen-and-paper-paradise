
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct, deleteProduct } from "@/services/dataService";
import { Product } from "@/types";
import MainLayout from "@/components/Layout/MainLayout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  Store, 
  ArrowLeft, 
  Pencil, 
  Trash, 
  ShoppingCart 
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { currentUser, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Edit product state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;

      setIsLoading(true);
      try {
        const productData = await getProductById(productId);
        if (productData) {
          setProduct(productData);
          setEditedProduct(productData);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, toast]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleEditProduct = async () => {
    try {
      if (!editedProduct.name || !editedProduct.price) {
        toast({
          title: "Validation error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const updatedProduct = await updateProduct(editedProduct as Product);
      setProduct(updatedProduct);
      setIsEditDialogOpen(false);
      toast({
        title: "Product updated",
        description: "Product has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(product!.id);
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully",
      });
      navigate(`/stores/${product!.storeId}`);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
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
              <Package className="mx-auto h-12 w-12 text-muted animate-pulse" />
              <p className="mt-4 text-muted-foreground">Loading product details...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <p className="mt-4 text-muted-foreground">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild className="mt-6">
              <Link to="/stores">Browse Stores</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/stores/${product.storeId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Store
            </Link>
          </Button>
          
          {isAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="aspect-square rounded-lg overflow-hidden border">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">{product.name}</h1>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Store className="h-4 w-4 text-muted-foreground" />
              <Link
                to={`/stores/${product.storeId}`}
                className="text-sm hover:underline"
              >
                View Store
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </div>
              {product.stock > 0 ? (
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs text-green-600">
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs text-red-600">
                  Out of Stock
                </span>
              )}
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>
            <div className="mt-8">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full md:w-auto"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editedProduct.name || ""}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={editedProduct.price || ""}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  Stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={editedProduct.stock || ""}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      stock: parseInt(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  value={editedProduct.category || ""}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      category: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="image"
                  value={editedProduct.image || ""}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      image: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={editedProduct.description || ""}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditProduct}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete "{product.name}"? This action
                cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProduct}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
