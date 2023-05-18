const canvas_id_list = ["imageCanvas", "perfectImage", "greatImage", "goodImage", "badImage", "missImage"];

function imageInput(target) {
    console.log("画像を受け取りました。");

    var image = new Image();
    var reader = new FileReader();

    reader.onload = function (e) {
        document.getElementById("calculateButton").disabled = true;
        image.src = e.target.result;
        image.onload = function () {
            console.log("横幅：%d, 高さ：%d", image.naturalWidth, image.naturalHeight);
            document.getElementById("imagesize").textContent = `縦：${image.naturalWidth}px, 横：${image.naturalHeight}px`;

            // 各リザルトを取得するためのオフセットを設定
            var xOffset = image.naturalWidth * 0.465;
            var yOffset = image.naturalHeight * 0.6;

            async function processCanvas() {
                var results = [];
                for (var canvas_id of canvas_id_list) {
                    // メインのcanvasの設定
                    var canvas = document.getElementById(canvas_id);
                    var context = canvas.getContext("2d");

                    // context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
                    if (canvas_id === "imageCanvas") {
                        canvas.width = image.width;
                        canvas.height = image.height;

                        // リサイズ後の横の大きさが1200px以下になるように計算
                        if (image.width > 1200) {
                            canvas.width = 1200;
                            canvas.height = image.height * (canvas.width / image.width);
                            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
                        } else {
                            // 元の画像をそのまま描画
                            context.drawImage(image, 0, 0);
                        }

                    } else {
                        // drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
                        canvas.width = image.naturalWidth * 80 / 1334;
                        canvas.height = image.naturalHeight * 36 / 750;
                        context.drawImage(image, xOffset, yOffset, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
                        yOffset += canvas.height;

                        // Tesseract.jsを使用して数字を読み取る
                        var result = await Tesseract.recognize(canvas.toDataURL('image/png'), {
                            lang: 'eng',
                            tessedit_char_whitelist: '0123456789'
                        });
                        console.log(`${canvas_id.replace("Image", "")}：${Number(result.text.replace(/\n/g, ""))}`);
                        results.push(Number(result.text.replace(/\n/g, "")));
                    }
                }

                scoreCalculate(results)
            }

            processCanvas();
        }
    }

    // 画像を文字列に変換
    reader.readAsDataURL(target.files[0]);
}

function calculateResults() {
    document.getElementById("calculateButton").disabled = true;

    console.log("ボタンをクリックしました");

    var results = [];
    for (idname of ["perfectTextBox", "greatTextBox", "goodTextBox", "badTextBox", "missTextBox"]) {
        results.push(parseInt(document.getElementById(idname).value));
    }

    scoreCalculate(results)
}

function scoreCalculate(results) {
    const rank = {
        "SSS+": { min: 1009000, max: 1010000 },
        "SSS": { min: 1007500, max: 1008999 },
        "SS+": { min: 1005000, max: 1007499 },
        "SS": { min: 1000000, max: 1004999 },
        "S+": { min: 990000, max: 999999 },
        "S": { min: 975000, max: 989999 },
        "AAA": { min: 950000, max: 974999 },
        "AA": { min: 925000, max: 949999 },
        "A": { min: 900000, max: 924999 },
        "BBB": { min: 800000, max: 899999 },
        "BB": { min: 700000, max: 799999 },
        "B": { min: 600000, max: 699999 },
        "C": { min: 500000, max: 599999 },
        "D": { min: 0, max: 499999 }
    };

    document.getElementById("perfectTextBox").value = results[0];
    document.getElementById("greatTextBox").value = results[1];
    document.getElementById("goodTextBox").value = results[2];
    document.getElementById("badTextBox").value = results[3];
    document.getElementById("missTextBox").value = results[4];

    var totalNotes = results[0] + results[1] + results[2] + results[3] + results[4];
    document.getElementById("totalNotes").textContent = totalNotes;
    console.log(`ノーツ数：${totalNotes}`);
    document.getElementById("score").textContent = "現在制作中です";
    var score = Math.floor(1000000 / totalNotes * 1.01 * results[0] + 1000000 / totalNotes * results[1] + 1000000 / totalNotes * (results[2] + results[3]) * 0.5);
    if (isNaN(score)) {
        // document.getElementById("score").textContent = "計算ができませんでした";
    } else {
        function getRank(score) {
            for (const key in rank) {
                const range = rank[key];
                if (score >= range.min && score <= range.max) {
                    return key;
                }
            }
        }

            // document.getElementById("score").textContent = `スコア：${score.toLocaleString()}, ランク：${getRank(score)}`;
        }

        document.getElementById("calculateButton").disabled = false;
    }