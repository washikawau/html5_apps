import { Sprite, Surface } from "enchant.js";
import { seq, randfloat } from "../util"
import Screen from "./Screen"
import Main from "./Main"

const TOUCH_SE = "./assets/touch.wav"

export default class Bug extends Sprite {
    static readonly IMAGE = "./assets/bug.png"
    private static readonly WIDTH = 32
    private static readonly HEIGHT = 32
    private static readonly SPEED = 4
    private static readonly MOVE_TIME = 30
    private static readonly WAIT_TIME = 30

    constructor(main: Main) {
        super(Bug.WIDTH, Bug.HEIGHT)
        this.main = main;
        this.image = main.assets[Bug.IMAGE]
        this.moveTo(
            randfloat(0, Screen.WIDTH - Bug.WIDTH),
            randfloat(0, Screen.HEIGHT - Bug.HEIGHT)
        )
        this.rotation = randfloat(0, 360)
        this.timer = randfloat(0, Bug.MOVE_TIME)
        this.update = this.move
    }

    private main: Main;
    // private rotation: number
    private timer: number
    private update: () => void

    onenterframe() {
        this.update()
        this.timer += 1

        const left = 0
        const right = Screen.WIDTH - Bug.WIDTH
        const top = 0
        const bottom = Screen.HEIGHT - Bug.HEIGHT
        if (this.x < left) {
            this.x = left
        }
        if (right < this.x) {
            this.x = right
        }
        if (this.y < top) {
            this.y = top;
        }
        if (bottom < this.y) {
            this.y = bottom
        }
    }

    ontouchstart() {
        this.timer = 0
        this.frame = 2
        this.update = this.destroyWait
        this.ontouchstart = () => { };
        this.main.bugNum -= 1
        this.main.assets[TOUCH_SE].clone().play()
    }

    move() {
        const angle = (this.rotation + 270) * Math.PI / 180
        this.x += Math.cos(angle) * Bug.SPEED
        this.y += Math.sin(angle) * Bug.SPEED

        this.frame = 1 - this.frame

        if (this.timer > Bug.MOVE_TIME) {
            this.timer = 0
            this.update = this.wait
        }
    }

    wait() {
        if (this.timer > Bug.WAIT_TIME) {
            this.timer = 0
            this.update = this.move
        }
    }

    destroyWait() {
        this.opacity = 1 - (this.timer / Bug.WAIT_TIME)
        if (this.timer > Bug.WAIT_TIME) {
            this.parentNode.removeChild(this)
        }
    }

}