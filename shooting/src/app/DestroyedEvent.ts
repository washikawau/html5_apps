import { Sprite, Event } from "enchant.js";

export default class DestroyedEvent<T extends Sprite> extends Event {
    constructor(detail: T) {
        super("destroyed");
        this.detail = detail;
    }
    detail: T;
}
