import { Sprite } from "enchant.js";
import App from "./App";
import DestroyedEvent from "./DestroyedEvent";

export default class Bullet extends Sprite {
    static readonly IMAGE = "./assets/bullet.png"
    private static readonly WIDTH = 8
    private static readonly HEIGHT = 16
    private static readonly SPEED = 12

    constructor() {
        super(Bullet.WIDTH, Bullet.HEIGHT)
        this.image = App.assets[Bullet.IMAGE]
    }

    onenterframe() {
        this.y -= Bullet.SPEED
        if (this.y < -20) {
            this.dispatchDestroyed()
        }
    }

    ondestroyed() {
    }

    dispatchDestroyed() {
        this.dispatchEvent(new DestroyedEvent<Bullet>(this))
    }
}
