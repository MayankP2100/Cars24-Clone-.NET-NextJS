import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const BASE_URL = "https://cars24-clone-net-nextjs.onrender.com";
export const BASE_URL = "http://localhost:5207";