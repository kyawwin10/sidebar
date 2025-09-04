export interface UserDTO {
  userId?: string;
  email: string;
  userName: string;
  age: number;
  roleName: string;
  profileImageUrl?: string;
}

export interface AddUserDTO {
  email: string;
  password: string;
  userName: string;
  age: number;
  roleName: string;
  profileImageUrl?: string;
}
