import {Types, Domains} from '../helpers/constants.js';
import {Atom} from '../parser/entities.js';

export function buildFirst(rules) {
    const firstSet = {};
    const updFirstSet = {};
    rules.forEach(rule => updFirstSet[rule.from] = []);

    do {
        copy(updFirstSet, firstSet);

        for (const rule of rules) {
            updFirstSet[rule.from] = unique(updFirstSet[rule.from].concat(first(updFirstSet, rule.to)));
        }
    } while (JSON.stringify(firstSet) !== JSON.stringify(updFirstSet));

    return firstSet;
}

function copy(src, dest) {
    Object.keys(src).forEach(first => dest[first] = src[first].slice());
}

function first(updFirst, atom) {
    switch (atom.type) {
        case Types.TERMINAL:
            return [atom.value];
        case Types.NONTERMINAL:
            return updFirst[atom.value];
        case Types.CONCAT:
            if (atom.value.length === 0) {
                return [Domains.EMPTY];
            }

            const first1 = first(updFirst, atom.value[0]);
            const first2 = first1.filter(elem => elem !== Domains.EMPTY);

            return first1.length === first2.length ?
                first2 :
                first2.concat(
                    first(
                        updFirst,
                        new Atom({
                            type: Types.CONCAT,
                            value: atom.value.slice(1)
                        })
                    )
                );
        case Types.ALT:
            const res = [];

            for (const concat of atom.value) {
                res.push(...first(updFirst, concat));
            }

            return res;
        case Types.REPEAT:
            return [Domains.EMPTY, ...first(updFirst, atom.value)];
    }
}

function unique(terms) {
    return terms.reduce((prev, term) => {
        if (!prev.includes(term)) {
            prev.push(term);
        }

        return prev;
    }, []);
}