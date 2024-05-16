import { Sprite, Easing } from "enchant.js";
import App from "./App"
import DestroyedEvent from "./DestroyedEvent"

type EnemyType = {
    init(enemy: Enemy): void;
};

export default class Enemy extends Sprite {
    static readonly RED_IMG = "./assets/enemy_red.png";
    static readonly GREEN_IMG = "./assets/enemy_green.png";
    static readonly BLUE_IMG = "./assets/enemy_blue.png";
    static readonly WIDTH = 32
    private static readonly HEIGHT = 32
    private static readonly SPEED = 4
    static readonly CREATE_INTERVAL = 15

    static readonly RED_ENEMY = {
        init(enemy: Enemy): void {
            enemy.image = App.assets[Enemy.RED_IMG];
            enemy.tl
                .moveBy(0, 120, 30)
                .loop();
        }
    };
    static readonly GREEN_ENEMY = {
        init(enemy: Enemy): void {
            enemy.image = App.assets[Enemy.GREEN_IMG];
            enemy.tl
                .moveBy(0, 120, 30, Easing.QUAD_EASEINOUT)
                .wait(30)
                .loop();
        }
    };
    static readonly BLUE_ENEMY = {
        init(enemy: Enemy): void {
            enemy.image = App.assets[Enemy.BLUE_IMG];
            enemy.tl
                .moveBy(30, 120, 30, Easing.QUAD_EASEINOUT)
                .moveBy(-30, 120, 30, Easing.QUAD_EASEINOUT)
                .loop();
        }
    };
    static readonly RAND_ENEMY = {
        init(enemy: Enemy): void {
            enemy.image = App.assets[Enemy.RED_IMG];
            enemy.tl
                .moveBy(0, 120, 30)
                .loop();
        }
    };

    static createFrom(frame: number): Enemy {
        const level = Math.min(frame / 300 | 0, 3);
        switch (level) {
            case 0: return new Enemy(Enemy.RED_ENEMY);
            case 1: return new Enemy(Enemy.GREEN_ENEMY);
            case 2: return new Enemy(Enemy.BLUE_ENEMY);
            default: return new Enemy(Enemy.RED_ENEMY);
        }
    }

    constructor(enemyType: EnemyType) {
        super(Enemy.WIDTH, Enemy.HEIGHT);
        enemyType.init(this);
    }

    onenterframe() {
        // this.y += Enemy.SPEED
        if (this.y > App.screenSize.height) {
            this.dispatchDestroyed()
        }
    }

    ondestroyed() {
    }

    dispatchDestroyed() {
        this.dispatchEvent(new DestroyedEvent<Enemy>(this))
    }
}
