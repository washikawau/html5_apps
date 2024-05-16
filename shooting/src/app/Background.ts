import { Sprite } from "enchant.js";
import App from "./App"

export default class Background extends Sprite {
    static readonly IMAGE = "./assets/background.png"
    static readonly WIDTH = 320
    static readonly HEIGHT = 2384
    static readonly SPEED = 4

    constructor() {
        super(Background.WIDTH, Background.HEIGHT)
        this.image = App.assets[Background.IMAGE]
    }

    moveToInit(): Background {
        this.moveTo(
            0,
            -Background.HEIGHT + App.screenSize.height
        )
        return this
    }

    onenterframe() {
        this.y += Background.SPEED
        if (this.y >= 0) {
            this.moveToInit()
        }
    }
}
