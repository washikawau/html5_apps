import { enchant } from "enchant.js";
import { sleep } from "./util";
import Main from "./app/Main"

enchant();

window.onload = () => {
    const main = new Main();
    main.start();
    sleep(30000).then(() => main.stop());
}
