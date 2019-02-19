export function GetOperationId(model: string, operation: string): any {
// tslint:disable-next-line: variable-name
    const _model = ToTitleCase(model).replace(/\s/g, '');
// tslint:disable-next-line: variable-name
    const _operation = ToTitleCase(operation).replace(/\s/g, '');

    return {
        title: '',
        operationId: `${_model}_${_operation}`,
    };
}

function ToTitleCase(str: string): string {
    return str.toLowerCase()
        .split(' ')
        .map(word => word.replace(word[0], word[0].toUpperCase()))
        .join(' ');
}
