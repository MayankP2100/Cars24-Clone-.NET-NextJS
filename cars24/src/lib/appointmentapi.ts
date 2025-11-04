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
  const url = `${BASE_URL}/api/appointment/user/${userId}/appointments`;
  console.log('Fetching from URL:', url);

  try {
    const res = await fetch(url);
    console.log('Response status:', res.status);
    console.log('Response ok:', res.ok);

    if (!res.ok) {
      console.error('API Error:', res.statusText);
      return [];
    }

    const data = await res.json();
    console.log('Parsed JSON data:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};
