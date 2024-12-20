
window.onload = () => {
    main();
};

function main() {
    const selFile = document.getElementById("selectFile")!;
    const c = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = c.getContext("2d")!;
    const c2 = document.getElementById("canvas2") as HTMLCanvasElement;
    const ctx2 = c2.getContext("2d")!;
    const rgba = document.getElementById("rgba") as HTMLLabelElement;
    const filter = document.getElementById("filter") as HTMLButtonElement;
    selFile.onchange = evt => {
        const target = evt.target! as HTMLInputElement;
        const file = target.files![0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                ctx.clearRect(0, 0, c.width, c.height);
                c.width = img.width
                c.height = img.height
                ctx.drawImage(img, 0, 0);
            };
        };
    };
    c.onmousemove = e => {
        const img = ctx.getImageData(e.offsetX, e.offsetY, 1, 1);
    };
    c.onmousedown = e => {
        const img = ctx.getImageData(e.offsetX, e.offsetY, 1, 1);
        ctx2.clearRect(0, 0, c2.width, c2.height);
        ctx2.fillStyle = `rgba(${img.data})`;
        ctx2.fillRect(0, 0, c2.width, c2.height);
        const toHex = (index: number) => img.data[index].toString(16).padStart(2, "0");
        rgba.innerText = `0x${toHex(0)}${toHex(1)}${toHex(2)}${toHex(3)}`;
    };
    const targetColor = () => {
        const data = ctx2.getImageData(0, 0, 1, 1).data;
        return (data[0] << 16) | (data[1] << 8) | (data[2] << 0);
    };
    filter.onclick = () => {
        const color = targetColor();
        const img = ctx.getImageData(0, 0, c.width, c.height);
        for (let i = 0; i < c.height; ++i) {
            for (let j = 0; j < c.width; ++j) {
                const index = (i * c.width + j) * 4;
                const rgb = 0 |
                    (img.data[index + 0] << 16) |
                    (img.data[index + 1] << 8) |
                    (img.data[index + 2] << 0);
                const a = img.data[index + 3];
                if (rgb == color) {
                    img.data[index + 0] = 0;
                    img.data[index + 1] = 0;
                    img.data[index + 2] = 0;
                    img.data[index + 3] = 0;
                }
            }
        }
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.putImageData(img, 0, 0);
    };
}
