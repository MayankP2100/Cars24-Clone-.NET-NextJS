import { BASE_URL } from "./utils";

export const createAppointment = async (userId: string, appointment: any) => {
  const res = await fetch(`${BASE_URL}/api/appointment?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointment),
  });

  return res.json();
};

export const getAppointmentById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/appointment/${id}`);

  return res.json();
};

export const getAppointmentByUser = async (userId: string) => {
  const res = await fetch(
    `${BASE_URL}/api/appointment/user/${userId}/appointments`
  );

  return res.json();
};
