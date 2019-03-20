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
    IDENTIFIER: any;
    TYPE_IDENTIFIER: any;
    ROOT_ANNOTATIONS: any;
    ANNOTATIONS: any;
    ANNOTATION: any;
    MARKDOWN_CHAPTER: any;
    MARKDOWN_PARAGRAPH: any;
    MARKDOWN_IMAGE: any;
    MARKDOWN_CODE: any;
    MARKDOWN_LIST: any;
    constructor();
    isAnnotation(): boolean | undefined;
    isRestriction(): boolean | undefined;
    isGenericParameter(): boolean | undefined;
}
export declare const parser: DomainParser;
export {};
