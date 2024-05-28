import { enchant, Group, Map, Event, Sprite, Surface } from "enchant.js";
import { Core } from "nineleap.enchant.js";
import { TimeLabel, MutableText } from "ui.enchant.js";
// import { randfloat, sleep } from "./util";

const MODE = "debug";
const SCREEN_WIDTH = 320;
const SCREEN_HEIGHT = 320;
const STAGE_MAX_NUM = 3;
const LIMIT_TIME = 300;
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 32;
const GOAL_WIDTH = 32;
const GOAL_HEIGHT = 32;
const KEY_WIDTH = 16;
const KEY_HEIGHT = 16;
const KEY_IMAGE_FRAME = 33;
const MAP_IMAGE = "./assets/main/map2.png";
const PLAYER_IMAGE = "assets/main/player.png";
const GOAL_IMAGE = "assets/main/goal.png";
const MAIN_BGM = "assets/main/main_bgm.wav";
const KEY_GET_SE = "assets/main/jump.wav";
const GOAL_SE = "assets/main/jump.wav";
const START_IMAGE = "assets/start.png";
const END_IMAGE = "assets/end.png";
const FONT_IMAGE = "assets/font0.png";
const ICON_IMAGE = "assets/icon0.gif";
const ASSETS = [
    MAP_IMAGE,
    PLAYER_IMAGE,
    GOAL_IMAGE,
    MAIN_BGM,
    KEY_GET_SE,
    GOAL_SE,
    START_IMAGE,
    END_IMAGE,
    FONT_IMAGE,
    ICON_IMAGE,
];
const STAGE01 = {
    "map": [
        [+3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3],
        [+3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, +3, +3, -1, -1, -1, -1, -1, -1, +3, +3, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, +3, +3, -1, -1, -1, -1, -1, -1, +3, +3, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, +3, +3, -1, -1, -1, -1, -1, -1, +3, +3, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, +3, +3, -1, -1, -1, -1, -1, -1, +3, +3, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, +3, +3, -1, -1, -1, -1, -1, -1, +3, +3, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, +3, +3, -1, -1, -1, -1, -1, -1, +3, +3, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, +3],
        [+3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, +3],
        [+3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3, +3],
    ],
    playerX: 16 * 2,
    playerY: 16 * 2,
    keyX: 16 * 17,
    keyY: 16 * 17,
    goalX: 16 * 10,
    goalY: 16 * 10,
};

let game: Core | null = null;
let map: Map | null = null;
let player: Player | null = null;
let goal: Goal | null = null;
let key: Key | null = null;
let timeLabel: TimeLabel | null = null;
let lockFlag = true;
let gameStage = 1;

enchant();

window.onload = async () => {
    game = new Core(SCREEN_WIDTH, SCREEN_HEIGHT, START_IMAGE, END_IMAGE);
    game.preload(ASSETS);
    game.onload = () => {
        const scene = game!.rootScene;
        {
            scene.backgroundColor = "black";
        }
        const stage = new Group();
        {
            scene.addChild(stage);
            stage.onenterframe = () => {
                if (player) {
                    stage.x = 160 - Number(player.x.toFixed(0));
                    stage.y = 160 - Number(player.y.toFixed(0));
                }
            };
        }
        map = new Map(16, 16);
        {
            map.image = game!.assets[MAP_IMAGE];
            stage.addChild(map);
        }
        scene.onenter = () => {
            game!.frame = 0;
            player = new Player();
            {
                stage.addChild(player);
            }
            goal = new Goal();
            {
                stage.addChild(goal);
            }
            key = new Key();
            {
                stage.addChild(key);
            }
            setupStage(1);
            timeLabel = new TimeLabel(140, 15, FONT_IMAGE, "countdown");
            {
                timeLabel.time = LIMIT_TIME;
                scene.addChild(timeLabel);
            }
            window.addEventListener("devicemotion", e => {
                if (!player) return;
                const ag = e.accelerationIncludingGravity;
                player.dx = -ag!.x!;
                player.dy = ag!.y!;
            });
            game!.assets[MAIN_BGM].play();
        };
        scene.onenterframe = () => {
            const left = player!.x;
            const right = player!.x + player!.width;
            const top = player!.y;
            const bottom = player!.y + player!.height;
            if (
                map!.hitTest(left, top) ||
                map!.hitTest(left, bottom) ||
                map!.hitTest(right, top) ||
                map!.hitTest(right, bottom)
            ) {
                gameOver(0, "Game Over!!");
            }
            if (timeLabel!.time < 0) {
                gameOver(0, "Time Over!!");
            }
            if (lockFlag === false) {
                goal!.opacity = (Math.sin(game!.frame * 10 * Math.PI / 180) + 1) / 4 + 0.5;
                if (player!.intersect(goal!)) {
                    game!.assets[GOAL_SE].play();
                    gameStage += 1;
                    if (gameStage <= STAGE_MAX_NUM) {
                        setupStage(gameStage);
                    } else {
                        const score = timeLabel!.time * 100;
                        gameOver(score, "Game Clear!!");
                    }
                }
            }
        };
    };
    game.start();
    // // await sleep(10000);
    // // game.end(0, "");
};

function gameOver(
    scoreOrig: number,
    rst: string
): void {
    const score = scoreOrig + gameStage * 1000;
    const msg = score + "point! " + rst;
    game!.end(score, msg);
}

function setupStage(stageIndex: number): void {
    const stage = STAGE01;
    lockFlag = true;
    map!.loadData(stage.map);
    key!.visible = true;
    key!.moveTo(stage.keyX, stage.keyY);
    goal!.moveTo(stage.goalX, stage.goalY);
    player!.moveTo(stage.playerX, stage.playerY);
    const stageInfo = new MutableText(100, 150, FONT_IMAGE, 200);
    {
        stageInfo.text = "STAGE 0" + stageIndex;
        stageInfo.tl
            .delay(30)
            .fadeOut(30)
            .then(() => game!.rootScene.removeChild(stageInfo));
        game!.rootScene.addChild(stageInfo);
    }
}

type Input = {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
};

class Player extends Sprite {
    constructor() {
        super(PLAYER_WIDTH, PLAYER_HEIGHT);
        this.image = game!.assets[PLAYER_IMAGE];
        this.frame = 0;
        this.dx = 0;
        this.dy = 0;
        if (MODE === "debug") {
            this.addEventListener("enterframe", () => {
                const input = game!.input as Input;
                if (input.left) this.x -= 4;
                if (input.right) this.x += 4;
                if (input.up) this.y -= 4;
                if (input.down) this.y += 4;
            });
        }
    }

    dx: number;
    dy: number;

    onenterframe(e: Event): void {
        this.x += this.dx;
        this.y += this.dy;
    }
}

class Goal extends Sprite {
    constructor() {
        super(GOAL_WIDTH, GOAL_HEIGHT);
        this.image = game!.assets[GOAL_IMAGE];
        this.frame = 0;
        this.opacity = 0.5;
    }
}

class Key extends Sprite {
    constructor() {
        super(KEY_WIDTH, KEY_HEIGHT);
        this.image = game!.assets[ICON_IMAGE];
        this.frame = KEY_IMAGE_FRAME;
    }

    onenterframe(e: Event): void {
        if (lockFlag === true && this.intersect(player!) === true) {
            lockFlag = false;
            this.visible = false;
            game!.assets[KEY_GET_SE].play();
        }
    }
}
