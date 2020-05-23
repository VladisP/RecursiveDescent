import fs from 'fs';
import {Lexer} from './src/lexer/lexer.js';
import {Parser} from './src/parser/parser.js';
import {buildFirst} from './src/builder/buildFirst.js';

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Usage: node main.js <path-to-grammar>');
    process.exit(-1);
}

try {
    const program = fs.readFileSync(args[0]).toString();
    const lexer = new Lexer(program);
    const parser = new Parser(lexer);
    const rules = parser.parse();
    const first = buildFirst(rules);

    fs.rmdirSync('./output', {recursive: true});
    fs.mkdirSync('./output');
    fs.writeFileSync('./output/rules.json', JSON.stringify(rules, null, 2));
    fs.writeFileSync('./output/FIRST.json', JSON.stringify(first, null, 2));
} catch (e) {
    console.error(e);
}