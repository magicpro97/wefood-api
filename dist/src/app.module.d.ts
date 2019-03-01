import { ConfigurationService } from './shared/configuration/configuration.service';
export declare class AppModule {
    private readonly configutationService;
    static host: string;
    static port: number | string;
    static isDev: boolean;
    constructor(configutationService: ConfigurationService);
    private static normalizePort;
}
