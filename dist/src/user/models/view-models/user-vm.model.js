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
const base_model_vm_1 = require("../../../shared/base.model-vm");
const user_role_enum_1 = require("../user-role.enum");
const swagger_1 = require("@nestjs/swagger");
const enum_to_array_1 = require("../../../shared/utilities/enum-to-array");
class UserVm extends base_model_vm_1.BaseModelVm {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], UserVm.prototype, "username", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    __metadata("design:type", String)
], UserVm.prototype, "firstname", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    __metadata("design:type", String)
], UserVm.prototype, "lastname", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    __metadata("design:type", String)
], UserVm.prototype, "fullname", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional({ enum: enum_to_array_1.EnumToArray(user_role_enum_1.UserRole) }),
    __metadata("design:type", String)
], UserVm.prototype, "role", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    __metadata("design:type", String)
], UserVm.prototype, "address", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    __metadata("design:type", String)
], UserVm.prototype, "email", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    __metadata("design:type", Boolean)
], UserVm.prototype, "sex", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    __metadata("design:type", String)
], UserVm.prototype, "srcImage", void 0);
__decorate([
    swagger_1.ApiModelPropertyOptional(),
    __metadata("design:type", Date)
], UserVm.prototype, "dob", void 0);
exports.UserVm = UserVm;
//# sourceMappingURL=user-vm.model.js.map