import { UserService } from '../../user/user.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { JwtPayload } from './jwt-payload';
import { User } from '../../user/models/user.model';
import { InstanceType } from 'typegoose';
export declare class AuthService {
    readonly userService: UserService;
    private readonly configurationService;
    private readonly jwtOptions;
    private readonly jwtKey;
    constructor(userService: UserService, configurationService: ConfigurationService);
    signPayload(payload: JwtPayload): Promise<string>;
    validatePayload(payload: JwtPayload): Promise<InstanceType<User>>;
}
