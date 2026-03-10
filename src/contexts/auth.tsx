import { jwtDecode, JwtPayload } from 'jwt-decode';

export function getAccessToken() {
  return sessionStorage.getItem("accessToken");
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const { exp } = jwtDecode<JwtPayload>(token);

    // 1. If no expiration is present, security best practice is to reject
    if (!exp) return false; 

    // 2. Add a 10-second buffer to account for network latency/clock skew
    const buffer = 10 * 1000; 
    const isExpired = Date.now() + buffer >= exp * 1000;

    return !isExpired;
  } catch (error) {
    // 3. Any decoding error (malformed token) means invalid
    return false;
  }
}
