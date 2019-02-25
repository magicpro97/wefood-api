"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function GetOperationId(model, operation) {
    const _model = ToTitleCase(model).replace(/\s/g, '');
    const _operation = ToTitleCase(operation).replace(/\s/g, '');
    return {
        title: '',
        operationId: `${_model}_${_operation}`,
    };
}
exports.GetOperationId = GetOperationId;
function ToTitleCase(str) {
    return str.toLowerCase()
        .split(' ')
        .map(word => word.replace(word[0], word[0].toUpperCase()))
        .join(' ');
}
//# sourceMappingURL=get-operation-id.js.map