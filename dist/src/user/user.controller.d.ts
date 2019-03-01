import { UserService } from './user.service';
import { RegisterVm } from './models/view-models/register-response-vm.model';
import { UserVm } from './models/view-models/user-vm.model';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';
import { LoginVm } from './models/view-models/login-vm.model';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(registerVm: RegisterVm): Promise<UserVm>;
    login(loginVm: LoginVm): Promise<LoginResponseVm>;
}
