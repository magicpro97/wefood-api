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
const base_model_1 = require("../../shared/base.model");
const user_role_enum_1 = require("./user-role.enum");
const typegoose_1 = require("typegoose");
class User extends base_model_1.BaseModel {
    static get model() {
        return new User().getModelForClass(User, { schemaOptions: base_model_1.schemaOptions });
    }
    static get modelName() {
        return this.model.modelName;
    }
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
__decorate([
    typegoose_1.prop({
        required: [true, 'Username is required'],
        minlength: [6, 'Must be at least 6 characters'],
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typegoose_1.prop({
        required: [true, 'Password is required'],
        minlength: [6, 'Must be at least 6 characters'],
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typegoose_1.prop({ enum: user_role_enum_1.UserRole, default: user_role_enum_1.UserRole.User }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Date)
], User.prototype, "dob", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Boolean)
], User.prototype, "sex", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], User.prototype, "srcImage", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], User.prototype, "fullName", null);
exports.User = User;
//# sourceMappingURL=user.model.js.map