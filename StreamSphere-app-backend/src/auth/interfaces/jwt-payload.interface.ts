import { UserStatus } from '../../users/schema/users.schema';

export enum AuthRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface JwtPayload {
  userId: string;
  email: string;
  role?: AuthRole;
  status?: UserStatus | string;
}
