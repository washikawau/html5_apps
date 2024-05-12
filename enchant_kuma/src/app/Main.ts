import { Core, Label, Sprite, Surface } from "enchant.js";
import Screen from "./Screen"
import { randfloat } from "../util"

const KUMA1 = "./assets/chara1.png"
const ASSETS = [KUMA1]

export default class Main extends Core {
    constructor() {
        super(Screen.WIDTH, Screen.HEIGHT)
        this.preload(ASSETS)
    }

    override onload() {
        const scene = this.rootScene
        scene.backgroundColor = "black"

        scene.addChild(
            new Kuma1(this.assets[KUMA1])
                .moveTo(50, 50)
        )
        scene.addChild(
            new Kuma1(this.assets[KUMA1])
                .moveTo(50, 100)
                .rotate(45)
        )
        scene.addChild(
            new Kuma1(this.assets[KUMA1])
                .moveTo(50, 150)
                .scale(3, 2)
        )
        scene.addChild(
            new Kuma1(this.assets[KUMA1])
                .moveTo(50, 200)
                .setOnEnterFrame(kuma => {
                    kuma.frame += 1
                    kuma.frame %= 3
                    kuma.moveBy(2, 0)
                    if (kuma.x > 320) {
                        kuma.x = 0
                    }
                })
        )

        const label = new Label("hello")
        label.color = "white"
        label.font = "25px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif"
        scene.addChild(label)

        scene.onenterframe = () => {
            if (this.frame % 5 == 0) {
                const text = "Hello"
                const label = createLabel(
                    "Hello",
                    randfloat(0, 300) | 0,
                    randfloat(0, 300) | 0,
                    createColor(
                        randfloat(0, 255) | 0,
                        randfloat(0, 255) | 0,
                        randfloat(0, 255) | 0
                    )
                )
                scene.addChild(label)
            }

            if (this.frame % 30 == 0) {
                const kuma = new Kuma(this.assets[KUMA1])
                kuma.x = randfloat(0, 290) | 0
                kuma.y = randfloat(0, 290) | 0
                scene.addChild(kuma)
            }
        }
    }
}

function createColor(r: number, g: number, b: number) {
    return `rgb(${r},${g},${b})`
}

function createLabel(text: string, x: number, y: number, color: string) {
    const label = new Label(text)
    label.font = "12px 'Consolas', 'Monaco', 'MS ゴシック'"
    label.moveTo(x, y)
    label.color = color
    label.onenterframe = () => {
        label.opacity -= 0.01
        if (label.opacity <= 0) {
            label.parentNode.removeChild(label)
        }
    }
    return label
}

class Kuma1 extends Sprite {
    constructor(image: Surface) {
        super(32, 32)
        this.image = image
        // this.frame = [0, 1, 2];
    }

    moveTo(x: number, y: number): Kuma1 {
        super.moveTo(x, y)
        return this
    }

    moveBy(x: number, y: number): Kuma1 {
        super.moveBy(x, y)
        return this
    }

    scale(x: number, y: number): Kuma1 {
        super.scale(x, y)
        return this
    }

    rotate(deg: number): Kuma1 {
        super.rotate(deg)
        return this
    }

    setOnEnterFrame(listener: (kuma: Kuma1) => void): Kuma1 {
        this.onenterframe = () => listener(this)
        return this
    }
}

class Kuma extends Sprite {
    constructor(image: Surface) {
        super(32, 32)
        this.image = image
        this.vx = randfloat(-4, 4) | 0
        this.vy = randfloat(-4, 4) | 0
        if (this.vx < 0) this.scaleX *= -1
    }

    private vx: number;
    private vy: number;

    override onenterframe() {
        this.x += this.vx
        this.y += this.vy

        this.frame += 1
        this.frame %= 3

        if (this.x < 0 || this.x > 290) {
            this.vx *= -1
            this.scaleX *= -1
        }
        if (this.y < 0 || this.y > 290) {
            this.vy *= -1
        }
    }

    override ontouchstart() {
        const label = createLabel("10point", this.x, this.y, "white")
        this.parentNode.addChild(label)
        this.parentNode.removeChild(this)
    }
}
