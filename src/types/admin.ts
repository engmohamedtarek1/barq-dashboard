// types/admin.ts
export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
}
