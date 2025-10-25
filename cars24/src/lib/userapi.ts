import { BASE_URL } from "./utils";

export const signUp = async (
  email: string,
  password: string,
  userData: { fullName: string; phone: string }
) => {
  const res = await fetch(`${BASE_URL}/api/userauth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      ...userData,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to sign up");
  }

  return res.json();
};

export const logIn = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/api/userauth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to log in");
  }

  return res.json();
};

export const getUserById = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/${userId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
};
