import {Atom, Rule} from './entities.js';
import {Domains, Types} from '../helpers/constants.js';

export class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.current = lexer.nextToken();
    }

    expect(expected) {
        if (!expected.includes(this.current.domain)) {
            throw new Error(`${this.current.coords.toString()}: expected ${expected.join(',')}, got ${this.current.value}`);
        }
    }

    next() {
        this.current = this.lexer.nextToken();
    }

    parse() {
        return this.current.domain === Domains.EOF ? [] : this.Rules();
    }

    bodyToAtom(body) {
        return new Atom({
            type: Types.ALT,
            value: body.map(concat => new Atom({type: Types.CONCAT, value: concat}))
        });
    }

    //Rules ::= (N -> Body 'end)*
    Rules() {
        this.expect([Domains.NONTERMINAL]);

        const rules = [];

        while (this.current.domain === Domains.NONTERMINAL) {
            const from = this.current.value;
            this.next();
            this.expect([Domains.ARROW]);
            this.next();
            const to = this.bodyToAtom(this.Body());
            this.expect([Domains.END]);
            this.next();
            rules.push(new Rule({from, to}));
        }

        return rules;
    }

    //Body ::= Atom+ ('or Body)*
    Body() {
        const body = [];
        const atoms = [];

        do {
            atoms.push(this.Atom());
        } while ([Domains.TERMINAL, Domains.NONTERMINAL, Domains.LPAREN, Domains.REPEAT].includes(this.current.domain));

        body.push(atoms);

        if (this.current.domain === Domains.OR) {
            this.next();
            body.push(...this.Body());
        }

        return body;
    }

    //Atom ::= T | N | (Body) | 'repeat Body 'end
    Atom() {
        let value = null;

        switch (this.current.domain) {
            case Domains.TERMINAL:
                value = this.current.value;
                this.next();
                return new Atom({type: Types.TERMINAL, value});
            case Domains.NONTERMINAL:
                value = this.current.value;
                this.next();
                return new Atom({type: Types.NONTERMINAL, value});
            case Domains.LPAREN:
                this.next();
                const atom = this.bodyToAtom(this.Body());
                this.expect([Domains.RPAREN]);
                this.next();
                return atom;
            case Domains.REPEAT:
                this.next();
                value = this.bodyToAtom(this.Body());
                this.expect([Domains.END]);
                this.next();
                return new Atom({type: Types.REPEAT, value});
            default:
                this.expect([Domains.TERMINAL, Domains.NONTERMINAL, Domains.LPAREN, Domains.REPEAT]);
        }
    }
}