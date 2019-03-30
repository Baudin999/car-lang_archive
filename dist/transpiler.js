"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("./lexer");
const parser_1 = require("./parser");
const outline_1 = require("./outline");
const substitute_1 = require("./substitute");
const tchecker_1 = require("./tchecker");
const helpers_1 = require("./helpers");
// Modules is the associated hash for looking up module references
// in the other modules (the imports).
exports.transpile = (source) => {
    const { ast, cst, tokens } = exports.createAST(source);
    let pluckResult = substitute_1.substitutePluckedFields(ast);
    let pluckAST = pluckResult.newAST;
    let rwAlias = substitute_1.substituteAliases(pluckAST);
    let rwAliasAST = rwAlias.newAST;
    let rwAliasErrors = rwAlias.errors;
    var { newAST, errors } = substitute_1.substituteExtensions(rwAliasAST);
    const checkASTs = tchecker_1.typeChecker(newAST) || [];
    return {
        tokens,
        cst,
        ast: newAST,
        errors: [...rwAliasErrors, ...errors, ...checkASTs]
    };
};
exports.createAST = (source) => {
    if (!source || source.length === 0) {
        return {
            ast: {},
            tokens: [],
            cst: []
        };
    }
    const lexedSource = lexer_1.DomainLexer.tokenize(source);
    parser_1.parser.input = lexedSource.tokens;
    const cst = parser_1.parser.START();
    if (parser_1.parser.errors && parser_1.parser.errors.length > 0) {
        console.log(JSON.stringify(parser_1.parser.errors, null, 4));
    }
    const visitor = new outline_1.OutlineVisitor();
    const ast = visitor.visit(cst);
    return { ast, tokens: lexedSource.tokens, cst };
};
exports.resolveImports = (modules) => {
    return modules.map(module => {
        module.ast
            .filter(node => node.type === outline_1.NodeType.OPEN)
            .map((node) => {
            const m = modules.getModule(node.module);
            if (!m) {
                throw "Can't find module " + node.module;
            }
            node.imports.forEach(id => {
                const ref = getNodeById(id, m.ast || []);
                if (ref)
                    module.ast.unshift(helpers_1.clone(ref, { imported: true }));
            });
            return module;
        });
        return module;
    });
};
exports.extensions = (modules) => {
    return modules.map(module => {
        let { errors, newAST } = substitute_1.substituteExtensions(module.ast);
        return Object.assign({}, module, { ast: newAST, errors: [...module.errors, ...errors] });
    });
};
exports.pluck = (modules) => {
    return modules.map(module => {
        let { errors, newAST } = substitute_1.substitutePluckedFields(module.ast);
        return Object.assign({}, module, { ast: newAST, errors: [...module.errors, ...errors] });
    });
};
exports.resolveAlias = (modules) => {
    return modules.map(module => {
        const { newAST, errors } = substitute_1.substituteAliases(module.ast);
        return Object.assign({}, module, { ast: newAST, errors: [...module.errors, ...errors] });
    });
};
exports.typeCheck = (modules) => {
    return modules.map(module => {
        let errors = tchecker_1.typeChecker(module.ast);
        return Object.assign({}, module, { errors: [...module.errors, ...errors] });
    });
};
exports.compile = (modules) => {
    return exports.typeCheck(exports.pluck(exports.resolveAlias(exports.extensions(exports.resolveImports(modules)))));
};
const getNodeById = (id, ast) => {
    return ast.find(node => node.id && node.id === id);
};
//# sourceMappingURL=transpiler.js.map