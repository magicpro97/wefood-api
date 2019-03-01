export declare class ConfigurationService {
    static connectionString: string;
    private environmentHosting;
    readonly isDevelopment: boolean;
    get(name: string): string;
}
