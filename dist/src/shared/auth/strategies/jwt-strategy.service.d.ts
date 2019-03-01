import { AuthService } from '../auth.service';
import { ConfigurationService } from '../../configuration/configuration.service';
import { Strategy, VerifiedCallback } from 'passport-jwt';
import { JwtPayload } from '../jwt-payload';
declare const JwtStrategyService_base: new (...args: any[]) => typeof Strategy;
export declare class JwtStrategyService extends JwtStrategyService_base {
    private readonly authService;
    private readonly configurationService;
    constructor(authService: AuthService, configurationService: ConfigurationService);
    validate(payload: JwtPayload, done: VerifiedCallback): Promise<void>;
}
export {};
