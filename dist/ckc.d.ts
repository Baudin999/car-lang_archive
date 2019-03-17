import { IExpression, IError } from "./outline";
export declare const maybeRaiseError: (error: any) => void;
export interface IModule {
    name: string;
    ast: IExpression[];
    hash: string;
    errors: IError[];
    timestamp: Date;
}
export interface IModuleDictionary {
    [module: string]: IModule;
}
