import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AddDoctorDTO, Booking, BookingResponseDto, Doctor } from "./types";
const BASE_URL = "Booking";

export const bookingApi = {
  // ✅ Get doctors
  useDoctors: () => {
    return useQuery<Doctor[], Error>({
      queryKey: ["doctors"],
      queryFn: async () => {
        const res = await axios.get(`${BASE_URL}/doctors`);
        return res.data.data;
      },
    });
  },

  // ✅ Add doctor
  useAddDoctor: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (newDoctor: AddDoctorDTO) => {
        const res = await axios.post(`${BASE_URL}/add-doctor`, newDoctor);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["doctors"] });
      },
    });
  },

  // ✅ Add booking
  useAddBooking: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (newBooking: Booking) => {
        const res = await axios.post(`${BASE_URL}/add-booking`, newBooking);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
      },
    });
  },

  // ✅ Get all bookings (response DTO)
  useBookings: () => {
    return useQuery<BookingResponseDto[], Error>({
      queryKey: ["bookings"],
      queryFn: async () => {
        const res = await axios.get(`${BASE_URL}/all`);
        return res.data.data;
      },
    });
  },
};
