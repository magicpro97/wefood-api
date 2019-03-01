"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var AppModule_1;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const shared_module_1 = require("./shared/shared.module");
const configuration_service_1 = require("./shared/configuration/configuration.service");
const configuration_enum_1 = require("./shared/configuration/configuration.enum");
const user_module_1 = require("./user/user.module");
let AppModule = AppModule_1 = class AppModule {
    constructor(configutationService) {
        this.configutationService = configutationService;
        AppModule_1.port = AppModule_1.normalizePort(configutationService.get(configuration_enum_1.Configuration.PORT));
        AppModule_1.host = configutationService.get(configuration_enum_1.Configuration.HOST);
        AppModule_1.isDev = configutationService.isDevelopment;
    }
    static normalizePort(param) {
        const portNumber = typeof param === 'string' ? parseInt(param, 10) : param;
        if (isNaN(portNumber)) {
            return param;
        }
        else if (portNumber >= 0) {
            return portNumber;
        }
    }
};
AppModule = AppModule_1 = __decorate([
    common_1.Module({
        imports: [
            shared_module_1.SharedModule,
            mongoose_1.MongooseModule.forRoot(configuration_service_1.ConfigurationService.connectionString, {
                useNewUrlParser: true,
            }),
            user_module_1.UserModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [configuration_service_1.ConfigurationService])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map