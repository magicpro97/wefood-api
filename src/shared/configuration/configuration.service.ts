import {Injectable} from '@nestjs/common';
import {Configuration} from './configuration.enum';
import {get} from 'config';

@Injectable()
export class ConfigurationService {
    static connectionString: string =
        process.env[Configuration.MONG_URI] || get(Configuration.MONG_URI);
    private environmentHosting: string = process.env.NODE_ENV || 'development';

    get isDevelopment(): boolean {
        return this.environmentHosting === 'development';
    }

    get(name: string): string {
        return process.env[name] || get(name);
    }
}
