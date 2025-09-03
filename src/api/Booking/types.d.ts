// Doctor Types
export interface Doctor {
  doctorId?: string;
  name: string;
  description: string;
  storePosition: string;
  storeName: string;
  phoneNumber: string;
  email: string;
}

export interface AddDoctorDTO {
  name: string;
  description: string;
  storePosition: string;
  storeName: string;
  phoneNumber: string;
  email: string;
}

export interface Booking {
  bookingId?: string;
  title: string;
  description: string;
  doctorId: string;
  userId: string;
  bookingDate: string;
}

export interface BookingResponseDto {
  doctorName: string;
  doctorPhone: string;
  doctorEmail: string;
  storeName: string;
  userName: string;
  bookingStore: string;
  bookingDate: string;
  bookingDescription: string;
}
