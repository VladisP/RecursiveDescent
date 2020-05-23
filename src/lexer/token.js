import {Coords} from './coords.js';

export class Token {
    constructor(domain, row, column, value) {
        this.domain = domain;
        this.coords = new Coords(row, column);
        this.value = value;
    }

    toString() {
        return `${this.domain} ${this.coords.toString()}: ${this.value}`;
    }
}