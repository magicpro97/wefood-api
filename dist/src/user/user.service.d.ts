import { BaseService } from '../shared/base.service';
import { User } from './models/user.model';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { RegisterVm } from './models/view-models/register-response-vm.model';
import { LoginVm } from './models/view-models/login-vm.model';
import { AuthService } from '../shared/auth/auth.service';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';
export declare class UserService extends BaseService<User> {
    private readonly userModel;
    private readonly mapperService;
    readonly authService: AuthService;
    constructor(userModel: ModelType<User>, mapperService: MapperService, authService: AuthService);
    register(registerVm: RegisterVm): Promise<User>;
    login(loginVm: LoginVm): Promise<LoginResponseVm>;
}
