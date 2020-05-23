import {Token} from './token.js';
import {Domains} from '../helpers/constants.js';

export class Lexer {
    constructor(program) {
        this.program = program;
        this.position = 0;
        this.delta = 0;
        this.lineNum = 1;
        this.buildRegexp();
    }

    buildRegexp() {
        const terminal = '"[^\\n"]+"';
        const nonterminal = '[A-Z]+[0-9]*';
        const keywords = "'repeat|'end|'or|\\(|\\)|->";
        const lineFeed = '\\r?\\n';
        const whitespaces = '\\s+';
        const pattern = `(?<terminal>${terminal})|(?<nonterminal>${nonterminal})|(?<keywords>${keywords})|` +
            `(?<lineFeed>${lineFeed})|(?<whitespaces>${whitespaces})`;
        this.regexp = new RegExp(pattern, 'y');
    }

    find() {
        this.regexp.lastIndex = this.position;
        return this.regexp.exec(this.program);
    }

    createToken(domain, value) {
        const column = this.position - this.delta + 1;
        this.position = this.regexp.lastIndex;
        return new Token(domain, this.lineNum, column, value);
    }

    nextToken() {
        if (this.position >= this.program.length) {
            return new Token(Domains.EOF, this.lineNum, this.program.length - this.delta + 1, null);
        }

        const res = this.find();

        if (!res) {
            console.log(`Error (${this.lineNum}, ${this.position - this.delta + 1}): unexpected character`);
            this.position++;
            return this.nextToken();
        }

        if (res.groups['lineFeed']) {
            this.delta = this.regexp.lastIndex;
            this.lineNum++;
            this.position = this.regexp.lastIndex;
            return this.nextToken();
        } else if (res.groups['terminal']) {
            return this.createToken(Domains.TERMINAL, res.groups['terminal']);
        } else if (res.groups['nonterminal']) {
            return this.createToken(Domains.NONTERMINAL, res.groups['nonterminal']);
        } else if (res.groups['keywords']) {
            return this.createToken(res.groups['keywords'], res.groups['keywords']);
        } else {
            this.position = this.regexp.lastIndex;
            return this.nextToken();
        }
    }
}