import { jwtDecode } from "jwt-decode";

type JwtPayload = { exp?: number };

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function isTokenValid(token: string | null) {
  if (!token) return false;

  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (!exp) return true; // if no exp, treat as valid (or return false if you prefer)
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
}
