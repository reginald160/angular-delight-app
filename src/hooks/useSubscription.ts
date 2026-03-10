import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/services/AuthService";
import { useEffect, useState } from "react";
import { boolean } from "zod";


export interface Subscription {
  id: number;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  product_id: string;
  tier: string; // Using a union type for better safety
  status: string;
  active:boolean,
  current_period_start: string; // ISO Date String
  current_period_end: string;   // ISO Date String
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  amount: number;
  currency: string;
  interval: string;
  tier: string;
  popular : boolean,
  features: string[];
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscription] = useState<Subscription[] | null>([]);
 const [products, setProducts] = useState<Product[] | null>([]);
  const fetchProducts = async ()=> {
    
    try {
      const { data, error } = await  authApi.getUserProducts();
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error('Error fetching  subscriptions:', error);
    } finally {
      setLoading(false);
    }

  }

   const fetchUserSubscription = async ()=> {
    setLoading(true);
    try {
      const { data, error } = await  authApi.getUserSubscriptions();
      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching  subscriptions:', error);
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    fetchUserSubscription();
    fetchProducts()
  }, [user]);

  return {
    fetchUserSubscription,
    setSubscription,
    fetchProducts,
    setProducts,
    products,
    loading:loading,
    subscriptions
  };
};
