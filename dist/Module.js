"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const helpers_1 = require("./helpers");
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const transpiler_1 = require("./transpiler");
const stringHash = require("string-hash");
//@ts-ignore
const deflate_1 = require("./deflate/deflate");
const createERD_1 = require("./transformations/erd/createERD");
const createHTML_1 = require("./transformations/html/createHTML");
console.log(__dirname);
let styles = fs_1.readFileSync(path_1.join(__dirname + "/../src/assets/styles.css"), "utf8");
console.log(styles);
class Module {
    /**
     * Ceate/initialize a module.
     *
     * @param {string} projectDirectory The project directory from which we will manage this module.
     */
    constructor(projectDirectory, configuration) {
        // simple constructor
        this.projectDirectory = projectDirectory;
        this.config = configuration;
    }
    init(moduleName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // we can init through the module name or through the
            // fullPath of a module
            if (moduleName.endsWith(".car")) {
                this.fullPath = moduleName;
                this.name = moduleName
                    .replace(this.projectDirectory, "")
                    .replace(/\//g, ".")
                    .replace(/\\/g, ".")
                    .replace(/\.car/, "")
                    .replace(/^\./, "");
                this.path = path_1.join(this.projectDirectory, this.config.outPath || ".out");
            }
            else {
                this.name = moduleName;
                this.fullPath = path_1.join(this.projectDirectory, this.name.replace(/\./g, "/") + ".car");
                this.path = path_1.join(this.projectDirectory, this.config.outPath || ".out");
            }
            this.outPath = path_1.join(this.path, ("v" + this.config.version).replace(/^vv/, "v"), this.name);
            try {
                this.svgs = yield helpers_1.readFileAsync(path_1.join(this.outPath, "svgs.json"), true);
            }
            catch (_a) {
                this.svgs = {};
            }
            return new Promise((resolve, reject) => {
                fs_1.readFile(this.fullPath, "utf8", (err, source) => {
                    if (err) {
                        reject(`Could not initialize module "${this.name}" in directory ${this.projectDirectory}`);
                    }
                    this.source = source.trimRight();
                    resolve(this);
                });
            });
        });
    }
    update(source) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (source) {
                this.source = source.trimRight();
                return this;
            }
            else {
                return new Promise((resolve, reject) => {
                    fs_1.readFile(this.fullPath, "utf8", (err, source) => {
                        if (err) {
                            reject(`Could not initialize module "${this.name}" in directory ${this.projectDirectory}`);
                        }
                        this.errors = [];
                        this.source = source.trimRight();
                        resolve(this);
                    });
                });
            }
        });
    }
    /**
     * Parse the module by passing in the full path
     * @param {string} fullPath The full path the file
     * @returns {Module} The updated module
     */
    parse() {
        let newHash = stringHash(this.source);
        if (newHash === this.hash)
            return this;
        // start processing the module
        let result;
        try {
            result = transpiler_1.createAST(this.source);
        }
        catch (err) {
            console.log(err);
        }
        this.hash = newHash;
        this.timestamp = new Date();
        this.ast = result.ast;
        this.cst = result.cst;
        this.errors = result.errors || [];
        this.tokens = result.tokens;
        return this;
    }
    link(modules) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this;
        });
    }
    writeDocumentation() {
        return new Promise((resolve, reject) => {
            // Save the actual plant UML which the tool outputs
            // this will help with the maintainability of the tool.
            const savePlantUML = (puml) => {
                const filePathPuml = path_1.join(this.outPath, this.name + ".puml");
                fs_extra_1.outputFile(filePathPuml, puml);
            };
            // Generate the SVG by going to the site and generating the svg
            const generateSVG = (puml) => {
                const url = deflate_1.generateURL(puml);
                helpers_1.fetchImage(url).then(img => {
                    const filePathSVG = path_1.join(this.outPath, this.name + ".svg");
                    fs_extra_1.outputFile(filePathSVG, img);
                });
            };
            // Create the entire ERD
            const puml = createERD_1.createERD(this.ast);
            const pumlHash = stringHash(puml).toString();
            const isChanged = !this.svgs.erd || this.svgs.erd !== pumlHash;
            if (puml && isChanged) {
                this.svgs.erd = pumlHash;
                savePlantUML(puml);
                generateSVG(puml);
            }
            // Generate the HTML files
            const { html, svgs } = createHTML_1.createHTML(this.ast, this.outPath, this.svgs || {}, puml ? this.name : undefined);
            const filePathHTML = path_1.join(this.outPath, this.name + ".html");
            fs_extra_1.outputFile(filePathHTML, html);
            // DO SOMETHING WITH THE HASHES
            this.svgs = Object.assign({}, svgs);
            Object.keys(this.svgs).forEach(hash => {
                if (hash === "erd" || hash === "hashes")
                    return;
                if (this.svgs.hashes.indexOf(hash) === -1) {
                    fs_extra_1.remove(path_1.join(this.outPath, hash + ".svg"));
                    delete this.svgs[hash];
                }
            });
            this.svgs.hashes = [];
            fs_extra_1.outputFile(path_1.join(this.outPath, "svgs.json"), JSON.stringify(this.svgs, null, 4));
            resolve(this);
        });
    }
    toErd() { }
}
exports.Module = Module;
//# sourceMappingURL=Module.js.map