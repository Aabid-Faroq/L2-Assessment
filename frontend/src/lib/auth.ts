import { apiClient } from "./api";
import { jwtDecode } from "jwt-decode";

export type UserRole = "hr" | "manager" | "employee";

export interface User {
  id: string; // This will now be the user's ID from our own database
  email: string;
  role: UserRole;
  employeeId?: string;
  name?: string; // These can be added from employee record if needed
  department?: string;
  managerId?: string;
}

const TOKEN_KEY = "authToken";

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await apiClient.post("/auth/login", { email, password });
    const { access_token } = response.data;

    if (!access_token) {
      throw new Error("Login failed: No token received.");
    }

    localStorage.setItem(TOKEN_KEY, access_token);

    // The token from our new backend already has the user details in it.
    const user: User = jwtDecode(access_token);
    return user;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    // No server call is needed for a stateless JWT logout
    return Promise.resolve();
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }

    try {
      // For extra security and to ensure user data is fresh,
      // we get the user profile from the backend instead of just decoding the token.
      const response = await apiClient.get("/auth/me");
      return response.data as User;
    } catch (error) {
      console.error("Session expired or invalid. Logging out.", error);
      authService.logout(); // Clean up the invalid token
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated: async (): Promise<boolean> => {
    const token = authService.getToken();
    if (!token) {
      return false;
    }
    // Optional: You could decode here and check expiry for a faster check
    // For now, we'll rely on getCurrentUser's API call to validate the session.
    return !!(await authService.getCurrentUser());
  },
};
