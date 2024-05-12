import { Label, Sprite, Surface } from "enchant.js";
import { Core } from "nineleap.enchant.js";
import { seq, randfloat } from "../util"
import Screen from "./Screen"
import Bug from "./Bug"

const START_IMAGE = "./assets/start.png"
const END_IMAGE = "./assets/end.png"
const FIELD_IMAGE = "./assets/floor.png"
const MAIN_BGM = "./assets/main_bgm.wav"
const CLEAR_BGM = "./assets/clear_bgm.wav"
const CRY_SE = "./assets/cry.wav"
const TOUCH_SE = "./assets/touch.wav"
const ASSETS = [
    START_IMAGE, END_IMAGE,
    FIELD_IMAGE, Bug.IMAGE,
    MAIN_BGM, CLEAR_BGM, CRY_SE, TOUCH_SE
]

export default class Main extends Core {
    private static readonly BUG_MAX_NUM = 10
    constructor() {
        super(Screen.WIDTH, Screen.HEIGHT, START_IMAGE, END_IMAGE)
        this.preload(ASSETS)
    }

    bugNum = Main.BUG_MAX_NUM
    private time = 0

    onload() {
        const scene = this.rootScene
        scene.backgroundColor = "black"

        this.assets[MAIN_BGM].volume = 0.1
        this.assets[CLEAR_BGM].volume = 0.1
        this.assets[CRY_SE].volume = 0.1
        this.assets[TOUCH_SE].volume = 0.1

        const bg = new Sprite(Screen.WIDTH, Screen.HEIGHT)
        bg.image = this.assets[FIELD_IMAGE]
        scene.addChild(bg)

        const numText = new Label("")
        numText.font = "18px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif"
        numText.color = "black"
        numText.moveTo(10, 10)
        scene.addChild(numText)

        scene.onenter = () => {
            this.frame = 0
            for (const _ of seq(Main.BUG_MAX_NUM)) {
                scene.addChild(new Bug(this))
            }
            // this.assets[CRY_SE].play()
            // this.assets[CRY_SE].volume = 0.1
            this.assets[CRY_SE].play()
        }

        scene.onenterframe = () => {
            numText.text = `残り: ${this.bugNum} 匹`
            this.assets[MAIN_BGM].play()
            if (this.bugNum <= 0) {
                this.time = Math.floor(this.frame / this.fps)
            }
            if (scene.childNodes.length <= 2) {
                this.assets[MAIN_BGM].stop()
                this.assets[CLEAR_BGM].play()
                const msg = `${this.time} 秒でクリアしました`
                alert(msg)
                this.end((60 - this.time) * 100, msg)
                scene.onenterframe = () => { };
            }
        }
    }

    forceStop() {
        this.assets[MAIN_BGM].stop();
        this.assets[CLEAR_BGM].stop();
    }
}
