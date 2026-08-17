import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { nnaSupabase } from "@/lib/nna-supabase";

export type Booking = {
  id: string;
  package_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_paid_pln: number;
  total_paid_eur: number;
  payment_status: "Paid" | "Pending" | "Failed" | "Refunded";
  booking_date: string;
  packages?: {
    title: string;
    trip_date: string | null;
  };
};

export const useBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await nnaSupabase
        .from("bookings")
        .select(`*, packages (title, trip_date)`)
        .order("booking_date", { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await nnaSupabase
        .from("bookings")
        .update({ payment_status: status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
