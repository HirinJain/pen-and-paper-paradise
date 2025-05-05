
import React from "react";
import { Button } from "@/components/ui/button";
import { Store, Package, ShoppingCart } from "lucide-react";
import MainLayout from "@/components/Layout/MainLayout";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-12 md:py-24">
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_800px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Your One-Stop Stationery Management Solution
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Manage multiple stores, track inventory, and boost sales with
                  our comprehensive stationery store management system.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/stores">
                  <Button size="lg">
                    <Store className="mr-2 h-5 w-5" />
                    Browse Stores
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1577375729152-4c8b5fcda381"
                alt="Stationery store"
                width={800}
                height={600}
                className="aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Everything you need to manage your stationery stores
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Our platform offers comprehensive tools for both store managers
                and customers.
              </p>
            </div>
          </div>
          <div className="grid gap-6 py-12 md:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold">Multi-Store Management</h3>
                <p className="text-muted-foreground">
                  Manage multiple store locations with ease, track inventory
                  across stores, and ensure efficient operations.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold">Product Management</h3>
                <p className="text-muted-foreground">
                  Add, update, and track products across all your stationery
                  stores with detailed information and images.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold">Customer Shopping</h3>
                <p className="text-muted-foreground">
                  Provide a seamless shopping experience for customers to browse
                  and purchase products from your stores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Sign up today and transform how you manage your stationery stores.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link to="/login">
                <Button size="lg">Sign up now</Button>
              </Link>
              <Link to="/stores">
                <Button size="lg" variant="outline">
                  Browse Stores
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
