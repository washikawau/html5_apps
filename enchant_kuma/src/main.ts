
import { enchant } from "enchant.js";
import Main from "./kuma/Main"

enchant();

window.onload = () => {
    const main = new Main();
    main.start();
    sleep(30000).then(() => main.stop());
}

async function sleep(millis: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, millis));
}
