import fs from 'fs';
import {Lexer} from './src/lexer/lexer.js';
import {Parser} from './src/parser/parser.js';

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Usage: node main.js <path-to-grammar>');
    process.exit(-1);
}

try {
    const program = fs.readFileSync(args[0]).toString();
    const lexer = new Lexer(program);
    const parser = new Parser(lexer);

    fs.rmdirSync('./output', {recursive: true});
    fs.mkdirSync('./output');
    fs.writeFileSync('./output/rules.json', JSON.stringify(parser.parse(), null, 2));
} catch (e) {
    console.error(e);
}