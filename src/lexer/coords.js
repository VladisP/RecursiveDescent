export class Coords {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }

    toString() {
        return `(${this.row}, ${this.column})`;
    }
}