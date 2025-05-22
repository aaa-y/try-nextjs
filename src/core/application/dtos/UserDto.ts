export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: string;
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  user: UserDto;
  token: string;
}