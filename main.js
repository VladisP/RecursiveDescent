import fs from 'fs';
import {Lexer} from './src/lexer/lexer.js';
import {Domains} from './src/lexer/domains.js';

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Usage: node main.js <path-to-grammar>');
    process.exit(-1);
}

const program = fs.readFileSync(args[0]).toString();
console.log(program);
console.log();

const lexer = new Lexer(program);
let token;

do {
    token = lexer.nextToken();
    console.log(token.toString());
} while (token.domain !== Domains.EOF);