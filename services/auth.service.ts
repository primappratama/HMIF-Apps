export type UserRole = "admin" | "pengurus" | "anggota";

export interface User {
  id: string;
  email: string;
  name: string;
  nim: string;
  angkatan: string;
  role: UserRole;
}

// Super Admin Credentials
const SUPER_ADMIN = {
  email: "hmif@ummi.ac.id",
  password: "hmifummiti23",
  user: {
    id: "admin-001",
    email: "hmif@ummi.ac.id",
    name: "HMIF Admin",
    nim: "000000",
    angkatan: "2023",
    role: "admin" as UserRole,
  },
};

// Mock user database (simulated)
let users: User[] = [];

export const login = async (email: string, password: string): Promise<User> => {
  // Validate inputs
  if (!email || !password) {
    throw new Error("Email dan password harus diisi");
  }

  // Check if Super Admin
  if (
    email.toLowerCase().trim() === SUPER_ADMIN.email &&
    password.trim() === SUPER_ADMIN.password
  ) {
    return SUPER_ADMIN.user;
  }

  // Check regular users
  const user = users.find(
    (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
  );

  if (!user) {
    throw new Error("Email atau password salah");
  }

  // In real app, check password hash
  // For now, just return user (password check simulated)
  return user;
};

export const register = async (
  email: string,
  password: string,
  name: string,
  nim: string,
  angkatan: string
): Promise<User> => {
  // Validate inputs
  if (!email || !password || !name || !nim || !angkatan) {
    throw new Error("Semua field harus diisi");
  }

  // Prevent registration with super admin email
  if (email.toLowerCase().trim() === SUPER_ADMIN.email) {
    throw new Error("Email ini tidak dapat digunakan untuk registrasi");
  }

  // Check if email already exists
  const existingUser = users.find(
    (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
  );

  if (existingUser) {
    throw new Error("Email sudah terdaftar");
  }

  // Check if NIM already exists
  const existingNim = users.find((u) => u.nim === nim.trim());

  if (existingNim) {
    throw new Error("NIM sudah terdaftar");
  }

  // Create new user (always as 'anggota' - no admin registration!)
  const newUser: User = {
    id: Date.now().toString(),
    email: email.trim(),
    name: name.trim(),
    nim: nim.trim(),
    angkatan: angkatan.trim(),
    role: "anggota", // Always anggota, no admin/pengurus via registration
  };

  users.push(newUser);
  return newUser;
};

export const logout = async (): Promise<void> => {
  // Clear session
  return Promise.resolve();
};

// User Management Functions
export const getAllUsers = async (): Promise<User[]> => {
  // Include super admin in the list
  return [SUPER_ADMIN.user, ...users];
};

export const updateUserRole = async (
  userId: string,
  newRole: UserRole
): Promise<void> => {
  // Prevent changing super admin role
  if (userId === SUPER_ADMIN.user.id) {
    throw new Error("Tidak dapat mengubah role Super Admin");
  }

  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].role = newRole;
  } else {
    throw new Error("User tidak ditemukan");
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  // Prevent deleting super admin
  if (userId === SUPER_ADMIN.user.id) {
    throw new Error("Tidak dapat menghapus Super Admin");
  }

  users = users.filter((u) => u.id !== userId);
};

export const getUserStats = async () => {
  const allUsers = await getAllUsers();

  return {
    total: allUsers.length,
    admin: allUsers.filter((u) => u.role === "admin").length,
    pengurus: allUsers.filter((u) => u.role === "pengurus").length,
    anggota: allUsers.filter((u) => u.role === "anggota").length,
  };
};
