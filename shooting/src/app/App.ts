import { Scene } from "enchant.js";
import { Core } from "nineleap.enchant.js";
import { Pad, ScoreLabel } from "ui.enchant.js";
import Background from "./Background"
import Player from "./Player"
import Bullet from "./Bullet"
import Enemy from "./Enemy"
import Crash from "./Crash"
import { randfloat } from "../util"

const START_IMG = "./assets/start.png";
const END_IMG = "./assets/end.png";
const PAD_IMG = "./assets/pad.png";
const FONT_IMG = "./assets/font0.png";
const MAIN_BGM = "./assets/main_bgm.wav"
const CRASH_SE = "./assets/crash.wav"

export declare class ScreenSize {
    width: number
    height: number
}

export declare class Input {
    left: boolean
    right: boolean
    up: boolean
    down: boolean
}

export default class App {
    static start() {
        App._instance = new App()
        App._instance.core.start()
    }

    private static _instance: App

    private constructor() {
        this.core = new Core(320, 320, START_IMG, END_IMG)
        this.core.preload([
            START_IMG,
            END_IMG,
            PAD_IMG,
            FONT_IMG,
            Background.IMAGE,
            Player.IMAGE,
            Bullet.IMAGE,
            Enemy.RED_IMG,
            Enemy.GREEN_IMG,
            Enemy.BLUE_IMG,
            Crash.IMAGE,
            MAIN_BGM,
            CRASH_SE
        ])
        this.core.onload = () => this.onload()
    }

    private readonly core
    private readonly bullets: Bullet[] = []
    private readonly enemies: Enemy[] = []

    private onload() {
        this.initScene(this.core.rootScene)
    }

    private initScene(scene: Scene) {
        scene.backgroundColor = "#8cc"
        scene.addChild(new Background().moveToInit())
        scene.addChild(this.createPad())
        const scoreLabel = this.createScoreLabel()
        const player = new Player().moveToInit()
        scene.onenter = () => {
            this.core.frame = 0
            scene.addChild(scoreLabel)
            scene.addChild(player)
            this.playMainBgm()
        }
        scene.onenterframe = () => this.onenterframe(
            scene,
            player,
            scoreLabel
        )
    }

    private createPad(): Pad {
        const pad = new Pad(PAD_IMG);
        pad.moveTo(10, this.core.height - 100)
        return pad
    }

    private createScoreLabel(): ScoreLabel {
        const x = new ScoreLabel(10, 10, FONT_IMG)
        x.score = 0
        return x
    }

    private onenterframe(
        scene: Scene,
        player: Player,
        scoreLabel: ScoreLabel
    ) {
        this.encountEnemy(scene)
        this.fireBullet(scene, player)
        this.crashEnemies(scoreLabel)
        this.crashPlayer(scene, player, scoreLabel)
    }

    encountEnemy(scene: Scene) {
        if (this.core.frame % Enemy.CREATE_INTERVAL == 0) {
            const enemy = Enemy.createFrom(this.core.frame);
            enemy.moveTo(
                randfloat(0, App.screenSize.width - Enemy.WIDTH),
                -20
            )
            enemy.ondestroyed = () => {
                this.enemies.erase(enemy)
                scene.removeChild(enemy)
                scene.addChild(new Crash(enemy.x, enemy.y))
                this.playCrashSe()
            }
            this.enemies.push(enemy)
            scene.addChild(enemy)
        }
    }

    fireBullet(scene: Scene, player: Player) {
        if (this.core.frame % 30 < 20 && this.core.frame % 5 == 0) {
            const bullet = player.fireBullet()
            bullet.ondestroyed = () => {
                this.bullets.erase(bullet)
                scene.removeChild(bullet)
            }
            this.bullets.push(bullet)
            scene.addChild(bullet)
        }
    }

    crashEnemies(scoreLabel: ScoreLabel) {
        for (const enemy of this.enemies.reverse()) {
            for (const bullet of this.bullets.reverse()) {
                if (enemy.intersect(bullet)) {
                    enemy.dispatchDestroyed()
                    bullet.dispatchDestroyed()
                    scoreLabel.score += 100
                    break
                }
            }
        }
    }

    crashPlayer(scene: Scene, player: Player, scoreLabel: ScoreLabel) {
        for (const x of this.enemies) {
            if (x.intersect(player)) {
                const crash = new Crash(player.x, player.y)
                crash.onenterframe = () => {
                    crash.frame += 1
                    if (crash.frame > 64) {
                        const score = scoreLabel.score
                        const msg = `${scoreLabel.score} point 獲得しました！`
                        this.core.end(score, msg)
                        this.stopMainBgm()
                    }
                }
                scene.addChild(crash)
                this.playCrashSe()
                scene.removeChild(player)
                scene.onenterframe = () => { };
            }
        }
    }

    playMainBgm() {
        const bgm = this.core.assets[MAIN_BGM]
        bgm.volume = 0.1
        bgm.play()
    }

    stopMainBgm() {
        const bgm = this.core.assets[MAIN_BGM]
        bgm.stop()
    }

    playCrashSe() {
        const se = this.core.assets[CRASH_SE].clone()
        se.volume = 0.05
        se.play()
    }

    static get instance() {
        return App._instance
    }

    static get assets() {
        return App.instance.core.assets
    }

    static get screenSize(): ScreenSize {
        return {
            width: App.instance.core.width,
            height: App.instance.core.height
        }
    }

    static get input(): Input {
        return App.instance.core.input as Input;
    }
}
