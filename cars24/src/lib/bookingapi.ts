import { BASE_URL } from "./utils";

export const createBooking = async (userId: string, booking: any) => {
  const res = await fetch(`${BASE_URL}/api/booking?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });

  return res.json();
};

export const getBookingById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/booking/${id}`);

  return res.json();
};

export const getBookingByUser = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/api/booking/user/${userId}/bookings`);

  console.log(res)

  return res.json();
};
