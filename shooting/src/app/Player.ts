import { Sprite } from "enchant.js";
import App, { Input } from "./App"
import Bullet from "./Bullet"

export default class Player extends Sprite {
    static readonly IMAGE = "./assets/player.png"
    private static readonly WIDTH = 32
    private static readonly HEIGHT = 32
    private static readonly SPEED = 8

    constructor() {
        super(Player.WIDTH, Player.HEIGHT)
        this.image = App.assets[Player.IMAGE]
        this.frame = 0
    }

    moveToInit(): Player {
        const { width, height } = App.screenSize
        this.moveTo(
            (width - Player.WIDTH) / 2,
            height - Player.HEIGHT
        )
        return this
    }

    onenterframe() {
        const input = App.input
        this.frame = input.left ? 1
            : input.right ? 2
                : 0
        this.moveByInput(input)

    }

    moveByInput(input: Input) {
        let vx = input.left ? -1
            : input.right ? 1
                : 0
        let vy = input.up ? -1
            : input.down ? 1
                : 0
        if (vx !== 0 && vy !== 0) {
            vx /= 1.41421356
            vy /= 1.41421356
        }
        vx *= Player.SPEED
        vy *= Player.SPEED
        this.moveBy(vx, vy)

        const { width, height } = App.screenSize
        const left = 0
        const right = width - Player.WIDTH
        const top = 0
        const bottom = height - Player.HEIGHT
        if (this.x < left) this.x = left
        if (right < this.x) this.x = right
        if (this.y < top) this.y = top
        if (bottom < this.y) this.y = bottom
    }

    fireBullet(): Bullet {
        const bullet = new Bullet()
        bullet.moveTo(
            this.x + Player.WIDTH / 2,
            this.y - 20
        )
        return bullet
    }
}
