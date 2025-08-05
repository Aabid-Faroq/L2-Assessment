import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        role: string;
        employeeId: string;
        employee: import("../employees/employee.entity").Employee;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfile(req: any): any;
}
