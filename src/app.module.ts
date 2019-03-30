import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {SharedModule} from './shared/shared.module';
import {ConfigurationService} from './shared/configuration/configuration.service';
import {Configuration} from './shared/configuration/configuration.enum';
import {UserModule} from './user/user.module';
import { FoodTagModule } from './food-tag/food-tag.module';

@Module({
    imports: [
        SharedModule,
        MongooseModule.forRoot(ConfigurationService.connectionString, {
            useNewUrlParser: true,
        }),
        UserModule,
        FoodTagModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    static host: string;
    static port: number | string;
    static isDev: boolean;

    constructor(private readonly configutationService: ConfigurationService) {
        AppModule.port = AppModule.normalizePort(
            configutationService.get(Configuration.PORT),
        );
        AppModule.host = configutationService.get(Configuration.HOST);
        AppModule.isDev = configutationService.isDevelopment;
    }

    private static normalizePort(param: number | string): number | string {
        const portNumber: number =
            typeof param === 'string' ? parseInt(param, 10) : param;
        if (isNaN(portNumber)) {
            return param;
        } else if (portNumber >= 0) {
            return portNumber;
        }
    }
}
