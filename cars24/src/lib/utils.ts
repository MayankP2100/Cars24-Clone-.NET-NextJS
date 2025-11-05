import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BASE_URL = process.env.NODE_ENV == "development" ?
  "http://localhost:5207" : "https://cars24-clone-net-nextjs.onrender.com";
