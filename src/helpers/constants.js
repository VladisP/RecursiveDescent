export class Domains {
    static TERMINAL = 'Terminal';
    static NONTERMINAL = 'Non terminal';
    static LPAREN = '(';
    static RPAREN = ')';
    static REPEAT = "'repeat";
    static END = "'end";
    static OR = "'or";
    static ARROW = '->';
    static EMPTY = 'empty';
    static EOF = 'eof';
}

export class Types extends Domains {
    static ALT = 'Alt';
    static CONCAT = 'Concat';
    static REPEAT = 'Repeat';
}