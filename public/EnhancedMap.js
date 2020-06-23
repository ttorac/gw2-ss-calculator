export default class webMap extends Map {
    constructor() {
        super();
    }

    toString() {
        return Array.from(this.keys());
    }
}