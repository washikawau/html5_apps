import { enchant } from "enchant.js";
import "nineleap.enchant.js";
import { TimeLabel } from "ui.enchant.js";
import { Core, Scene3D, DirectionalLight, Camera3D } from "gl.enchant.js";
import { Sphere, Cube } from "primitive.gl.enchant.js";
import { randfloat } from "./util";

enchant();

const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 640;
const START_IMG = "./assets/start.png";
const END_IMG = "./assets/end.png";
const FONT_IMG = "./assets/font0.png";
const ICON_IMG = "./assets/icon0.gif";
const MAIN_BGM = "";
const CUBE_TOUCH_SE = "./assets/itemget.wav";

let game: Core | null = null;

window.onload = () => {
    game = new Core(SCREEN_WIDTH, SCREEN_HEIGHT, START_IMG, END_IMG);
    game.preload([
        START_IMG,
        END_IMG,
        FONT_IMG,
        ICON_IMG,
        CUBE_TOUCH_SE,
    ]);
    game.onload = () => {
        const scene = new Scene3D();
        const light = new DirectionalLight();
        {
            light.directionZ = 1;
            light.color = [1.0, 1.0, 1.0];
            scene.setDirectionalLight(light);
        }
        const camera = new Camera3D();
        {
            camera.x = 0;
            camera.y = 0;
            camera.z = 32;
            camera.centerX = 0;
            camera.centerY = 0;
            camera.centerZ = 0;
            scene.setCamera(camera);
        }
        const player = new Sphere();
        {
            player.translate(0, 0, -20);
            scene.addChild(player);
        }
        game!.rootScene.addEventListener("touchmove", e => {
            const x = (e.x / SCREEN_WIDTH * 2) - 1;
            const y = (e.y / SCREEN_HEIGHT * 2 - 1) * -1;
            player.x = x * 5;
            player.y = y * 5;
        });
        let timeLabel: TimeLabel | null = null;
        game!.rootScene.onenter = () => {
            game!.frame = 0;
            timeLabel = new TimeLabel(20, 20, FONT_IMG);
            {
                game!.rootScene.addChild(timeLabel);
            }
        };
        game!.rootScene.onenterframe = () => {
            if (game!.frame % 5 == 0) {
                const cube = new Cube();
                {
                    cube.x = randfloat(-5, 5);
                    cube.y = randfloat(-5, 5);
                    cube.z = -60;
                    cube.onenterframe = () => {
                        cube.z += 1;
                        if (cube.intersect(player) === true) {
                            const score = timeLabel!.time * 100;
                            const msg = score + "point を獲得しました!!";
                            game!.end(score, msg);
                        }
                        if (cube.z > 10) {
                            cube.parentNode?.removeChild(cube);
                        }
                    };
                    scene.addChild(cube);
                }
            }
        };
    };
    game.start();
};
