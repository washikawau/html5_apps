import { enchant, Sprite, Event, DOMSound } from "enchant.js";
import { Core } from "nineleap.enchant.js";
import { ScoreLabel, MutableText } from "ui.enchant.js";
import { randfloat, sleep } from "./util";

const SCREEN_WIDTH = 320;
const SCREEN_HEIGHT = 320;

const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 32;
const PLAYER_JUMP = -5;
const PLAYER_GRAVITY = 0.25;

const ENEMY_WIDTH = 32;
const ENEMY_HEIGHT = 32;
const ENEMY_SPEED = -5;
const ENEMY_HIT_LENGTH = 20;

const ITEM_WIDTH = 16;
const ITEM_HEIGHT = 16;
const ITEM_SPEED = -4;
const COIN_POINT = 100;
const COIN_FRAME = 14;
const DIAMOND_POINT = 1000;
const DIAMOND_FRAME = 64;

const BACKGROUND_WIDTH = 1320;
const BACKGROUND_HEIGHT = 320;

const START_IMG = "./assets/start.png";
const END_IMG = "./assets/end.png";
const FONT_IMG = "./assets/font0.png";
const PLAYER_IMAGE = "./assets/player.png";
const ENEMY_IMAGE = "./assets/enemy.png";
const ICON_IMAGE = "./assets/icon0.gif";
const BACKGROUND_IMAGE = "./assets/background.png";
const MAIN_BGM = "./assets/main_bgm.wav";
const JUMP_SE = "./assets/jump.wav";
const ITEM_GET_SE = "./assets/itemget.wav";

const ASSETS = [
    START_IMG,
    END_IMG,
    FONT_IMG,
    PLAYER_IMAGE,
    ENEMY_IMAGE,
    ICON_IMAGE,
    BACKGROUND_IMAGE,
    MAIN_BGM,
    JUMP_SE,
    ITEM_GET_SE,
];

let game: Core | null = null;
let player: Player | null = null;
let scoreLabel: ScoreLabel | null = null;

enchant();

window.onload = () => {
    game = new Core(SCREEN_WIDTH, SCREEN_HEIGHT, START_IMG, END_IMG);
    game.preload(ASSETS);
    game.onload = () => {
        const scene = game!.rootScene;
        scene.backgroundColor = "#0af";
        const background = new Sprite(BACKGROUND_WIDTH, BACKGROUND_HEIGHT);
        background.image = game!.assets[BACKGROUND_IMAGE];
        background.moveTo(0, 0);
        background.onenterframe = () => {
            background.x -= 4;
            if (background.x <= -(BACKGROUND_WIDTH - SCREEN_WIDTH)) {
                background.moveTo(0, 0);
            }
        };
        scene.addChild(background);
        scene.onenter = () => {
            game!.frame = 0;
            // score
            scoreLabel = new ScoreLabel(10, 10, FONT_IMG);
            scoreLabel.score = 0;
            scene.addChild(scoreLabel);
            // player
            player = new Player();
            player.moveTo(20, SCREEN_HEIGHT / 2 - PLAYER_HEIGHT / 2);
            scene.addChild(player);
        };
        scene.onenterframe = () => {
            if (game!.frame % 30 == 0) {
                const enemy = new Enemy();
                enemy.moveTo(
                    SCREEN_WIDTH + 30,
                    Math.random() * (SCREEN_HEIGHT - ENEMY_HEIGHT)
                );
                scene.addChild(enemy);
            }
            if (game!.frame % 50 == 0) {
                const r = Math.floor(Math.random() * 100);
                const item = r < 10
                    ? new Diamond()
                    : new Coin();
                item.moveTo(
                    SCREEN_WIDTH + 30,
                    Math.random() * (SCREEN_HEIGHT - ITEM_HEIGHT)
                );
                scene.addChild(item);
            }
            const bgm = game!.assets[MAIN_BGM] as DOMSound;
            bgm.volume = 0.1;
            bgm.play();
        };
        // touch
        scene.ontouchstart = () => {
            player!.jump();
        };
    };
    game.start();
    // sleep(1000).then(() => game!.stop());
}

function gameOver(rst: string) {
    const score = scoreLabel!.score;
    const msg = score + "point 獲得!";
    const bgm = game!.assets[MAIN_BGM] as DOMSound;
    bgm.stop();
    game!.end(score, msg);
}

class Player extends Sprite {
    constructor() {
        super(PLAYER_WIDTH, PLAYER_HEIGHT);
        this.image = game!.assets[PLAYER_IMAGE];
        this.frame = 0;
        this.vy = 0;
    }

    vy: number;

    onenterframe(e: Event): void {
        this.vy += PLAYER_GRAVITY;
        this.y += this.vy;
        if (this.vy > 0) {
            this.frame = 0;
        }
        else {
            this.frame = 1;
        }
        const top = 0;
        const bottom = SCREEN_HEIGHT;
        if (this.y + this.height < top) {
            gameOver("画面外に出てしまいました。残念!!");
        }
        if (this.y > bottom) {
            gameOver("画面外に出てしまいました。残念!!");
        }
    }

    jump(): void {
        this.vy = PLAYER_JUMP;
        const se = game!.assets[JUMP_SE] as DOMSound;
        se.clone();
        se.volume = 0.1;
        se.play();
    }
}

class Enemy extends Sprite {
    constructor() {
        super(ENEMY_WIDTH, ENEMY_HEIGHT);
        this.image = game!.assets[ENEMY_IMAGE];
        this.time = randfloat(0, 360) | 0;
    }

    time: number;

    onenterframe(e: Event): void {
        this.x += ENEMY_SPEED;
        this.y += Math.cos(this.time * 5 * Math.PI / 180);
        if (this.time % 5) {
            this.frame += 1;
            this.frame %= 3;
        }
        if (this.within(player!, ENEMY_HIT_LENGTH)) {
            gameOver("鳥と衝突してしまいました。残念!!");
        }
        if (this.x < -40) {
            this.parentNode.removeChild(this);
        }
        this.time += 1;
    }
}

class Item extends Sprite {
    constructor() {
        super(ITEM_WIDTH, ITEM_HEIGHT);
        this.image = game!.assets[ICON_IMAGE];
    }

    onenterframe(e: Event): void {
        this.x += ITEM_SPEED;
        if (this.intersect(player!)) {
            const e = new Event("hit");
            this.dispatchEvent(e);
        }
        if (this.x < -40) {
            this.parentNode.removeChild(this);
        }
    }

    onhit(e: Event): void {
        console.log("hit!");
    }
}

class Coin extends Item {
    constructor() {
        super();
        this.frame = COIN_FRAME;
    }

    onhit(e: Event): void {
        const label = new ScoreUpLabel(COIN_POINT);
        label.moveTo(this.x, this.y);
        game?.rootScene.addChild(label);
        this.parentNode.removeChild(this);
        scoreLabel!.score += COIN_POINT;
        const se = game!.assets[ITEM_GET_SE] as DOMSound;
        se.clone();
        se.volume = 0.1;
        se.play();
    }
}

class Diamond extends Item {
    constructor() {
        super();
        this.frame = DIAMOND_FRAME;
    }

    onhit(e: Event): void {
        const label = new ScoreUpLabel(DIAMOND_POINT);
        label.moveTo(this.x, this.y);
        game?.rootScene.addChild(label);
        this.parentNode.removeChild(this);
        scoreLabel!.score += DIAMOND_POINT;
        const se = game!.assets[ITEM_GET_SE] as DOMSound;
        se.clone();
        se.volume = 0.1;
        se.play();
    }
}

class ScoreUpLabel extends MutableText {
    constructor(score: number) {
        super(0, 0, FONT_IMG);
        this.text = "+" + score;
        this.time = 0;
    }

    time: number;

    onenterframe(e: Event): void {
        this.y -= 0.1;
        this.opacity = 1.0 - (this.time / 30);
        if (this.time > 30) {
            this.parentNode.removeChild(this);
        }
        this.time += 1;
    }
}
