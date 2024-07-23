import {jwtDecode } from "jwt-decode";
import { DecodedToken } from "../Interfaces/DecodedToken";

export const decodeToken = (token: string): DecodedToken => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    console.log("DECODED: ", decoded);
    return decoded;
  } catch (error) {
    console.error("Invalid token", error);
    throw error; // Handle token decoding error appropriately
  }
};

// Example usage
// const token = localStorage.getItem("token");
// if (token) {
//   const decodedToken = decodeToken(token);
//   console.log(decodedToken);

// }
