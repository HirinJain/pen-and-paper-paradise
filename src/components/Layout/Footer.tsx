
import React from "react";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-2">
              <Package className="h-5 w-5 text-brand-indigo" />
              <span className="text-lg font-bold">StatioStore</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Your one-stop solution for high-quality stationery products across multiple stores.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/stores" className="text-muted-foreground hover:text-foreground">
                    Stores
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-muted-foreground hover:text-foreground">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="text-muted-foreground hover:text-foreground">
                    Shopping Cart
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Help</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Returns Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Subscribe to our newsletter</h4>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-md border border-input px-4 py-2 text-sm"
              />
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 StatioStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
