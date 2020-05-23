export class Rule {
    constructor({from, to}) {
        this.from = from;
        this.to = to;
    }
}

export class Atom {
    constructor({type, value}) {
        this.type = type;
        this.value = value;
    }
}