import { AuthRole } from '../interfaces/jwt-payload.interface';
import { Roles } from './roles.decorator';

export const AdminOnly = () => Roles(AuthRole.ADMIN);
