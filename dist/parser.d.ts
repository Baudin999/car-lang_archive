import { Parser } from "chevrotain";
declare class DomainParser extends Parser {
    START: any;
    EXPRESSION: any;
    TYPE: any;
    TYPE_FIELD: any;
    ALIAS: any;
    ALIAS_FOR: any;
    DATA: any;
    DATA_OPTION: any;
    CHOICE: any;
    CHOICE_OPTION: any;
    VIEW: any;
    RESTRICTION: any;
    PARAMETERS: any;
    STATEMENT: any;
    BINARY_EXPRESSION: any;
    VALUE_EXPRESSION: any;
    FUNCTION_APPLICATION: any;
    OPEN: any;
    IMPORTING: any;
    AGGREGATE: any;
    FLOW: any;
    FLOW_FUNCTION: any;
    FLOW_SYSTEM: any;
    FLOW_SUB: any;
    FLOW_PUB: any;
    OPERATION: any;
    OPERATION_RESULT: any;
    OPERATION_PARAMETER: any;
    OPERATION_PARAMETER_TYPE: any;
    OPERATION_PARAMETER_FIELD_TYPE: any;
    MAP: any;
    MAP_FLOW: any;
    MAP_FLOW_KEY: any;
    IDENTIFIER: any;
    TYPE_IDENTIFIER: any;
    ID_OR_STRING: any;
    ANNOTATIONS: any;
    ANNOTATION: any;
    CHOICE_ANNOTATION: any;
    MARKDOWN_CHAPTER: any;
    MARKDOWN_PARAGRAPH: any;
    MARKDOWN_IMAGE: any;
    MARKDOWN_CODE: any;
    MARKDOWN_LIST: any;
    constructor();
    isAnnotation(): boolean | undefined;
    isRestriction(): boolean | undefined;
    isGenericParameter(): boolean | undefined;
    isSub(): boolean;
    isPub(): boolean;
}
export declare const parser: DomainParser;
export {};
