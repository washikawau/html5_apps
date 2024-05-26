import { enchant, Group, Event, Surface } from "enchant.js";
import { Pad, ScoreLabel, LifeLabel } from "ui.enchant.js";
import { Core } from "nineleap.enchant.js";
import { AvatarCharacter, AvatarBG, AvatarMonster } from "avatar.enchant.js";
import { randfloat, sleep } from "./util";

const SCREEN_WIDTH = 320;
const SCREEN_HEIGHT = 320;
const STAGE_OFFSET = 45;
const CHARACTER_OFFSET_Y = 20;
const CHARACTER_STEP_Y = 45;
// const PLAYER_AVATAR_CODE = "1:3:0:2009:2109:27540";
const PLAYER_IMAGE = "assets/chara7.png";
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 32;
const PLAYER_INIT_POS = 0;
const PLAYER_LIMIT_POS = PLAYER_WIDTH * 2;
const PLAYER_ADVANCE_SPEED = 1;
const PLAYER_DAMAGE_BACK_LENGTH = -PLAYER_WIDTH;
const PLAYER_DAMAGE_BACK_SPEED = 10;
const MAX_LIFE = 3;
const BUG_SPEED = 2;
const BUG_LIFE = 1;
const BUG_SCORE = 100;
const DRAGON_SPEED = 4;
const DRAGON_LIFE = 2;
const DRAGON_SCORE = 500;
const BG01_IMAGE = "assets/avatarBg1.png";
const BG02_IMAGE = "assets/avatarBg2.png";
const BG03_IMAGE = "assets/avatarBg3.png";
const BUG_IMAGE = "assets/monster/monster1.gif";
const DRAGON_IMAGE = "assets/monster/bigmonster1.gif";
const MAIN_BGM = "assets/sounds/main_bgm.wav"
const PLAYER_DAMAGE_SE = "assets/sounds/hit.wav"
const ENEMY_DAMAGE_SE = "assets/sounds/hit.wav"
const ENEMY_APPEAR_SE = "assets/sounds/jump.wav"
const PAD_IMAGE = "assets/pad.png";
const START_IMAGE = "assets/start.png";
const END_IMAGE = "assets/end.png";
const FONT_IMAGE = "assets/font0.png";
const ICON_IMAGE = "assets/icon0.gif";
const ASSETS = [
    PLAYER_IMAGE,
    BG01_IMAGE,
    BG02_IMAGE,
    BG03_IMAGE,
    BUG_IMAGE,
    DRAGON_IMAGE,
    MAIN_BGM,
    PLAYER_DAMAGE_SE,
    ENEMY_DAMAGE_SE,
    ENEMY_APPEAR_SE,
    PAD_IMAGE,
    START_IMAGE,
    END_IMAGE,
    FONT_IMAGE,
    ICON_IMAGE,
];

let game = null;
let player = null;
let scoreLabel = null;
let lifeLabel = null;

enchant();

window.onload = async () => {
    game = new Core(SCREEN_WIDTH, SCREEN_HEIGHT, START_IMAGE, END_IMAGE);
    game.preload(ASSETS);
    game.onload = () => {
        const scene = game!.rootScene;
        {
            scene.backgroundColor = "#cff";
        }
        const pad = new Pad(PAD_IMAGE);
        {
            pad.moveTo(0, 220);
            scene.addChild(pad);
        }
        scoreLabel = new ScoreLabel(10, 15, FONT_IMAGE);
        {
            scoreLabel.score = 0;
            scene.addChild(scoreLabel);
        }
        lifeLabel = new LifeLabel(260, 15, MAX_LIFE, ICON_IMAGE);
        {
            scene.addChild(lifeLabel);
        }
        const stage = new Group();
        {
            stage.y = STAGE_OFFSET;
            scene.addChild(stage);
        }
        const bg = new AvatarBG(
            1,
            BG01_IMAGE,
            BG02_IMAGE,
            BG03_IMAGE
        );
        {
            stage.addChild(bg);
        }
        player = new Player();
        {
            player.visible = false;
            stage.addChild(player);
        }
        scene.onenter = () => {
            player!.visible = true;
            player!.x = PLAYER_INIT_POS;
            scene.onupbuttondown = () => {
                if (player!.action === "attack") {
                    return;
                }
                player!.up();
            };
            scene.ondownbuttondown = () => {
                if (player!.action === "attack") {
                    return;
                }
                player!.down();
            };
            scene.onrightbuttondown = () => {
                if (player!.action === "attack") {
                    return;
                }
                player!.action = "attack";
            };
        };
        scene.onenterframe = () => {
            bg.scroll(game!.frame * 2);
            if (game!.frame % 60 == 0) {
                let monster = null;
                const r = Math.floor(Math.random() * 100);
                if (r < 20) {
                    monster = new Dragon();
                } else {
                    monster = new Bug();
                }
                monster.x = 240;
                stage.addChild(monster);
                {
                    const s = game!.assets[ENEMY_APPEAR_SE].clone();
                    s.volume = 0.1;
                    s.play();
                }
            }
            {
                const s = game!.assets[MAIN_BGM];
                s.volume = 0.1;
                s.play();
            }
        };
    };
    game.start();
    // await sleep(10000);
    // game.end(0, "");
};

class Player extends AvatarCharacter {
    constructor() {
        super(PLAYER_WIDTH, PLAYER_HEIGHT);
        this.image = game!.assets[PLAYER_IMAGE];
        this.animPattern = {
            "stop": [10],
            "run": [9, 10, 11, 10],
            "attack": [15, 16, 17, 10, -1],
            "special": [0, 6, 5, 13, 14, 15, 0, 0, -1],
            "damage": [7, 7, 7, 7, 0, 0, 0, -1],
            "dead": [8],
            "demo": [1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 0, 0, 0, 0, 2, 9, 10, 11, 5, 0, 0, 0,
                1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 0, 6, 5, 13, 14, 15, 0, 0]
        };
        this.posIndex = 0;
        this.updatePosY();
        this.action = "run";
    }

    posIndex: number;

    up(): void {
        if (this.posIndex <= 0) {
            return;
        }
        --this.posIndex;
        this.updatePosY();
    }

    down(): void {
        if (this.posIndex >= 2) {
            return;
        }
        ++this.posIndex;
        this.updatePosY();
    }

    updatePosY(): void {
        this.image._element.style.zIndex = String(this.posIndex);
        this.y = CHARACTER_OFFSET_Y + CHARACTER_STEP_Y * this.posIndex;
    }

    damage(): void {
        if (this.action === "damage") {
            return;
        }
        this.action = "damage";
        {
            const s = game!.assets[PLAYER_DAMAGE_SE].clone();
            s.volume = 0.1;
            s.play();
        }
        {
            // lifeLabel!.life -= 1;
            // if (lifeLabel!.life <= 0) {
            //     game!.end(scoreLabel!.score, "ライフが0になってゲームオーバー!!");
            // }
        }
        this.tl
            .moveBy(PLAYER_DAMAGE_BACK_LENGTH, 0, PLAYER_DAMAGE_BACK_SPEED)
            .then(() => {
                const right = this.x + this.width;
                if (right <= 0) {
                    game!.end(scoreLabel!.score, "画面外にでてゲームオーバー!!");
                }
            });
    }

    onenterframe(e: Event): void {
        if (this.action === "run" && this.x < PLAYER_LIMIT_POS) {
            this.x += PLAYER_ADVANCE_SPEED;
        }
        if (this.action === "stop") {
            this.action = "run";
        }
    }
}

class BaseMonster extends AvatarMonster {
    constructor(img: Surface) {
        super(img);
        this.action = "appear";
        this.posIndex = Math.floor(Math.random() * 3);
        this.speed = 2;
        this.life = 1;
        this.offsetY = (58 - img.width / 4);
        this.updatePosY();
        this.update = this.appear;
    }

    posIndex: number;
    speed: number;
    life: number;
    offsetY: number;
    update: () => void;

    onenterframe(e: Event): void {
        if (this.update) {
            this.update();
        }
        if (this.posIndex === player!.posIndex && this.intersect(player!)) {
            if (player!.action === "attack") {
                this.damage();
            } else {
                player!.damage();
            }
        }
        if (this.action === "stop") {
            this.action = "walk";
        }
        if (this.x < -100) {
            this.parentNode.removeChild(this);
            lifeLabel!.life -= 1;
            if (lifeLabel!.life <= 0) {
                game!.end(scoreLabel!.score, "敵を取り逃がしてゲームオーバー!!");
            }
        }
    }

    updatePosY(): void {
        this.image._element.style.zIndex = String(this.posIndex);
        this.y = CHARACTER_OFFSET_Y +
            CHARACTER_STEP_Y * this.posIndex +
            this.offsetY;
    }

    damage(): void {
        if (this.action === "attack" || this.action === "disappear") {
            return;
        }
        this.action = "attack";
        {
            const s = game!.assets[ENEMY_DAMAGE_SE].clone();
            s.volume = 0.1;
            s.play();
        }
        this.life -= 1;
        if (this.life <= 0) {
            this.action = "disappear";
        }
        this.tl.moveBy(100, 0, 30);
    }

    appear(): void {
        if (this.action === "stop") {
            this.update = this.advance;
        }
    }

    advance(): void {
        this.x -= this.speed;
    }
}

class Bug extends BaseMonster {
    constructor() {
        super(game!.assets[BUG_IMAGE]);
        this.speed = BUG_SPEED;
        this.life = BUG_LIFE;
    }

    onremoved(e: Event): void {
        scoreLabel!.score += BUG_SCORE;
    }
}

class Dragon extends BaseMonster {
    constructor() {
        super(game!.assets[DRAGON_IMAGE]);
        this.speed = DRAGON_SPEED;
        this.life = DRAGON_LIFE;
    }

    onremoved(e: Event): void {
        scoreLabel!.score += DRAGON_SCORE;
    }
}
