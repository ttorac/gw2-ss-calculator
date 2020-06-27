export default class WebMap extends Map {
    constructor() {
        super();
    }

    toString() {
        return Array.from(this.keys());
    }
}