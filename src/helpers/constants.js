export class Domains {
    static TERMINAL = 'Terminal';
    static NONTERMINAL = 'Non terminal';
    static LPAREN = '(';
    static RPAREN = ')';
    static REPEAT = "'repeat";
    static END = "'end";
    static OR = "'or";
    static ARROW = '->';
    static EOF = 'eof';
}

export class Types extends Domains {
    static GROUP = 'Group';
    static REPEAT = 'Repeat';
}