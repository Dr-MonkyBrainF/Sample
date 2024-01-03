const handler = () => {
    // life gameを表示する要素
    const app = document.getElementById("app");
    // 初期値を設定する要素
    const setting = document.getElementById("setting");
    // 実行ボタン
    const btn = document.getElementById("btn");
    // 初期値リセット or 実行停止用のボタン
    const reset = document.getElementById("reset");
    // universeのサイズ
    const SIZE = 20;
    // 
    const universe = Array.from({ length: SIZE ** 2 }, () => 0);

    const getIndex = (row, col) => Number(row) * SIZE + Number(col);

    // 隣接要素の生存セル数の取得処理場
    const getNeighbors = () => {
        // TODO
    }
    // 生存セル数の数に応じて次の状態を計算する処理場
    const next = () => {
        // TODO
    }
    // 状態の描画処理場
    let timer;
    const draw = () => {
        console.log('draw execute');
        app.textContent = universe.map((v, i) => `${i % SIZE === 0 ? "\n" : ""}${v ? "■" : "□"}`).join("");
        next();
        timer = setTimeout(draw, 500);
    }

    // init: app display none
    app.style.display = "none";
    // init setting add checkbox
    setting.append(...Array.from({ length: SIZE }, (_, i) => {
        const div = document.createElement("div");
        div.classList.add("row");
        div.append(...Array.from({ length: SIZE }, (_, j) => {
            const check = document.createElement("input");
            check.type = "checkbox";
            check.name = "setting";
            check.dataset.row = i;
            check.dataset.col = j;
            return check;
        }));
        return div;
    }));

    btn.addEventListener("click", () => {
        for (const check of setting.querySelectorAll("input[type='checkbox']")) {
            universe[getIndex(check.dataset.row, check.dataset.col)] = check.checked ? 1 : 0;
        }
        app.style.display = "block";
        setting.style.display = "none";
        reset.dataset.mode = reset.textContent = "stop";
        btn.disabled = true;
        draw();
    });
    reset.addEventListener("click", () => {
        app.style.display = "none";
        clearTimeout(timer);
        setting.style.display = "block";
        btn.disabled = false;
        if (reset.dataset.mode === "stop") {
            reset.textContent = reset.dataset.mode = "reset";
        }
        else {
            for (const check of setting.querySelectorAll("input[type='checkbox']")) {
                check.checked = false;
            }
        }
    })
}
document.addEventListener("DOMContentLoaded", handler);
