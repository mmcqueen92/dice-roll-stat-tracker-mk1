import {jwtDecode } from "jwt-decode";
import { DecodedToken } from "../Interfaces/DecodedToken";

export const decodeToken = (token: string): DecodedToken => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error("Invalid token", error);
    throw error; // Handle token decoding error appropriately
  }
};
