import { Sprite } from "enchant.js";
import App from "./App"
import Background from "./Background"

export default class Crash extends Sprite {
    static readonly IMAGE = "./assets/crash.png"
    static readonly WIDTH = 32
    static readonly HEIGHT = 32

    constructor(x: number, y: number) {
        super(Crash.WIDTH, Crash.HEIGHT)
        this.image = App.assets[Crash.IMAGE]
        this.frame = 0
        this.scale(2)
        this.moveTo(x, y)
    }

    onenterframe() {
        this.frame += 1
        this.y += Background.SPEED
        if (this.frame > 64) {
            this.parentNode.removeChild(this)
        }
    }
}
