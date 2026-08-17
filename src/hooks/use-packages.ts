import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { nnaSupabase } from "@/lib/nna-supabase";

export type Package = {
  id: string;
  title: string;
  location: string;
  photo: string;
  emoji: string;
  badges: unknown;
  tags: unknown;
  features: unknown;
  price_pln: number;
  price_eur: number | null;
  included: string;
  duration: string;
  desc_text: string;
  itinerary: string;
  activity: string;
  price_range: string;
  duration_tag: string;
  difficulty: string;
  show_price: boolean;
  trip_date: string | null;
  coming_soon: boolean;
  priority: number;
  is_disabled: boolean;
  is_hidden: boolean;
};

export const usePackages = (admin = false) => {
  return useQuery({
    queryKey: ["packages", admin],
    queryFn: async () => {
      let query = nnaSupabase.from("packages").select("*").order("priority", { ascending: false });

      if (!admin) {
        query = query.eq("is_hidden", false);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Package[];
    },
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pkg: Partial<Package> & { id: string }) => {
      const { data, error } = await nnaSupabase
        .from("packages")
        .update(pkg)
        .eq("id", pkg.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pkg: Omit<Package, "id">) => {
      const { data, error } = await nnaSupabase.from("packages").insert(pkg).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
};
