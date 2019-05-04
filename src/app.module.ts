import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ConfigurationService } from './shared/configuration/configuration.service';
import { Configuration } from './shared/configuration/configuration.enum';
import { UserModule } from './user/user.module';
import { FoodTagModule } from './food-tag/food-tag.module';
import { UnitModule } from 'src/unit/unit.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { StepModule } from './step/step.module';
import { IngredientDetailModule } from './ingredient-detail/ingredient-detail.module';
import { CommentModule } from './comment/comment.module';

@Module({
    imports: [
        SharedModule,
        MongooseModule.forRoot(ConfigurationService.connectionString, {
            useNewUrlParser: true,
        }),
        UserModule,
        FoodTagModule,
        UnitModule,
        IngredientModule,
        StepModule,
        IngredientDetailModule,
        CommentModule,
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
