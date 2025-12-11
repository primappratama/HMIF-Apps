import { AuthResponse, LoginCredentials } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_STORAGE_KEY = "@hmif_users";
const AUTH_TOKEN_KEY = "@hmif_auth_token";
const USER_DATA_KEY = "@hmif_user_data";

// Register new user
export const registerUser = async (userData: {
  name: string;
  nim: string;
  email: string;
  phone: string;
  angkatan: string;
  password: string;
}) => {
  try {
    // Get existing users
    const existingUsersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    const existingUsers = existingUsersJson
      ? JSON.parse(existingUsersJson)
      : [];

    // Check if NIM or Email already exists
    const nimExists = existingUsers.find((u: any) => u.nim === userData.nim);
    const emailExists = existingUsers.find(
      (u: any) => u.email === userData.email
    );

    if (nimExists) {
      throw new Error("NIM sudah terdaftar");
    }

    if (emailExists) {
      throw new Error("Email sudah terdaftar");
    }

    // First user = admin, rest = member
    const role = existingUsers.length === 0 ? "admin" : "member";

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      nim: userData.nim,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      angkatan: userData.angkatan,
      password: userData.password,
      role: role, // ← AUTO ASSIGN ROLE
      createdAt: new Date().toISOString(),
    };

    // Save to storage
    const updatedUsers = [...existingUsers, newUser];
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    return {
      success: true,
      user: {
        id: newUser.id,
        nim: newUser.nim,
        name: newUser.name,
        email: newUser.email,
        angkatan: newUser.angkatan,
        role: newUser.role,
      },
    };
  } catch (error) {
    throw error;
  }
};

// Update user role (admin only)
export const updateUserRole = async (
  userId: string,
  newRole: "member" | "admin" | "pengurus"
) => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    const users = usersJson ? JSON.parse(usersJson) : [];

    const userIndex = users.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) {
      throw new Error("User tidak ditemukan");
    }

    users[userIndex].role = newRole;
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    const users = usersJson ? JSON.parse(usersJson) : [];

    // Remove password from response
    return users.map((u: any) => ({
      id: u.id,
      nim: u.nim,
      name: u.name,
      email: u.email,
      angkatan: u.angkatan,
      role: u.role,
      createdAt: u.createdAt,
    }));
  } catch (error) {
    throw error;
  }
};

// Login user
export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    // Get registered users
    const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    const users = usersJson ? JSON.parse(usersJson) : [];

    // Find user by NIM or Email
    const user = users.find(
      (u: any) =>
        (u.nim === credentials.identifier ||
          u.email === credentials.identifier) &&
        u.password === credentials.password
    );

    if (!user) {
      throw new Error("NIM/Email atau Password salah");
    }

    // Generate mock token
    const token = `token_${user.id}_${Date.now()}`;

    // Save auth data
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(
      USER_DATA_KEY,
      JSON.stringify({
        id: user.id,
        nim: user.nim,
        name: user.name,
        email: user.email,
        angkatan: user.angkatan,
        role: user.role,
      })
    );

    return {
      user: {
        id: user.id,
        nim: user.nim,
        name: user.name,
        email: user.email,
        angkatan: user.angkatan,
        role: user.role,
      },
      token,
    };
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  await AsyncStorage.removeItem(USER_DATA_KEY);
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    const userDataJson = await AsyncStorage.getItem(USER_DATA_KEY);

    if (!token || !userDataJson) {
      return null;
    }

    const userData = JSON.parse(userDataJson);
    return { user: userData, token };
  } catch (error) {
    return null;
  }
};
