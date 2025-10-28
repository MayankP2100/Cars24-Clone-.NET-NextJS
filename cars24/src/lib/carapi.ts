import {BASE_URL} from "./utils";

type CarDetails = {
  emi: string;
  location: string;
  specs: {
    year: number;
    km: string;
    fuel: string;
    transmission: string;
    owner: string;
    insurance: string;
  };
  features: string[];
  highlights: string[];
};

export const createCar = async (carDetails: CarDetails) => {
  const res = await fetch(`${BASE_URL}/api/cars`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(carDetails),
  });

  return res.json();
};

export const getCarById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/cars/${id}`);

  return res.json();
};

export const getCarSummaries = async (city: string) => {
  const res = await fetch(`${BASE_URL}/api/cars?city=${city}`);
  return res.json();
};
