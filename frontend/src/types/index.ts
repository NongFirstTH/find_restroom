export interface User {
  userId: string;
  username: string;
  email: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Restroom {
  restroomId: string;
  name: string;
  detail?: string;
  address?: string;
  openingHours?: string;
  closingHours?: string;
  type: "squat" | "flush" | "other";
  isFree: boolean;
  latitude: number;
  longitude: number;
  createdBy: string;
  createdAt: string;
}

export interface RestroomFormData {
  name: string;
  detail?: string;
  address?: string;
  openingHours?: string;
  closingHours?: string;
  type: "squat" | "flush" | "other";
  isFree: boolean;
  latitude: number;
  longitude: number;
}
