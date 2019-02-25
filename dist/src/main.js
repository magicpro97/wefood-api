"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        const hostDomain = app_module_1.AppModule.isDev
            ? `${app_module_1.AppModule.host}:${app_module_1.AppModule.port}`
            : app_module_1.AppModule.host;
        const swaggerOptions = new swagger_1.DocumentBuilder()
            .setTitle('We foods')
            .setDescription('API Documentation')
            .setVersion('1.0.0')
            .setHost(hostDomain.split('//')[1])
            .setSchemes(app_module_1.AppModule.isDev ? 'http' : 'https')
            .setBasePath('api')
            .addBearerAuth('Authorization', 'header')
            .build();
        const swaggerDoc = swagger_1.SwaggerModule.createDocument(app, swaggerOptions);
        app.use('/api/docs/swagger.json', (req, res) => {
            res.send(swaggerDoc);
        });
        swagger_1.SwaggerModule.setup('/api/docs', app, null, {
            swaggerUrl: `${hostDomain}/api/docs/swagger.json`,
            explorer: true,
            swaggerOptions: {
                docExpansion: 'list',
                filter: true,
                showRequestDuration: true,
            },
        });
        app.setGlobalPrefix('api');
        app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
        yield app.listen(process.env.PORT || app_module_1.AppModule.port);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map