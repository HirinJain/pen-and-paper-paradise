
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Trash,
  Plus,
  Minus,
  ArrowLeft,
  Store,
} from "lucide-react";
import MainLayout from "@/components/Layout/MainLayout";
import { useToast } from "@/components/ui/use-toast";
import { addSale } from "@/services/dataService";
import { groupBy } from "lodash";
import { CartItem } from "@/types";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Group cart items by store
  const cartByStore: Record<string, CartItem[]> = groupBy(cart, (item) => item.product.storeId);

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You need to log in to checkout",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      // Create a sale for each store
      for (const [storeId, items] of Object.entries(cartByStore)) {
        await addSale({
          storeId,
          userId: currentUser.id,
          products: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            priceAtSale: item.product.price,
          })),
          totalAmount: items.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          ),
        });
      }

      clearCart();
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
      });
      navigate("/");
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order.",
        variant: "destructive",
      });
    }
  };

  if (cart.length === 0) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
            <p className="mt-2 text-muted-foreground">
              Add items to your cart to proceed with checkout.
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
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-muted-foreground"
          >
            <Trash className="mr-2 h-4 w-4" />
            Clear Cart
          </Button>
        </div>

        <div className="grid gap-8 py-8 md:grid-cols-3 lg:gap-12">
          <div className="md:col-span-2 space-y-6">
            {Object.entries(cartByStore).map(([storeId, items]) => {
              const storeName = items[0]?.product?.storeId 
                ? items[0]?.product?.storeId 
                : 'Store';
              
              return (
                <div key={storeId} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">{storeName}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center space-x-4 rounded-lg border p-4"
                      >
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between">
                            <Link
                              to={`/products/${item.product.id}`}
                              className="font-medium hover:underline"
                            >
                              {item.product.name}
                            </Link>
                            <span className="font-bold">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(item.product.price)} each
                          </div>
                          <div className="mt-2 flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.product.id, item.quantity - 1);
                                }
                              }}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                if (item.quantity < item.product.stock) {
                                  updateQuantity(item.product.id, item.quantity + 1);
                                }
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-auto h-7 w-7 text-muted-foreground"
                              onClick={() => removeFromCart(item.product.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            <div className="pt-4">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-muted-foreground"
              >
                <Link to="/stores">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <div className="sticky top-20 rounded-lg border bg-card p-6">
              <h3 className="text-lg font-medium">Order Summary</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">{formatPrice(cartTotal)}</span>
                </div>
              </div>
              <Button className="mt-6 w-full" onClick={handleCheckout}>
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
