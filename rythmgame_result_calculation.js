const canvas_id_list = ["image_canvas", "perfectimage", "greatimage", "goodimage", "badimage", "missimage"];

function imageinput(target) {
    console.log("画像を受け取りました。");

    var image = new Image();
    var reader = new FileReader();

    reader.onload = function (e) {
        image.src = e.target.result;
        image.onload = function () {
            console.log("横幅：%d\n高さ：%d", image.naturalWidth, image.naturalHeight);
            document.getElementById("imagesize").textContent = `縦：${image.naturalWidth}px, 横：${image.naturalHeight}px`;

            // 各リザルトを取得するためのオフセットを設定
            var xOffset = image.naturalWidth * 690 / 1334;
            var yOffset = image.naturalHeight * 450 / 750;

            async function processCanvas() {
                var results = [];
                for (var canvas_id of canvas_id_list) {
                    // メインのcanvasの設定
                    var canvas = document.getElementById(canvas_id);
                    var context = canvas.getContext("2d");

                    // drawImage(image, xOffset, yOffset, width, height)
                    if (canvas_id === "image_canvas") {
                        canvas.width = image.width;
                        canvas.height = image.height;
                        context.drawImage(image, 0, 0);
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
                        console.log(results.push(Number(result.text.replace(/\n/g, ""))));
                        console.log(results);
                    }
                }
                var totalnotes = results[0]+results[1]+results[2]+results[3]+results[4];
                console.log(totalnotes);
                document.getElementById("score").textContent = Math.floor(1000000/totalnotes*1.01*results[0] + 1000000/totalnotes*results[1] + 1000000/totalnotes*(results[2] + results[3])*0.5).toLocaleString();
            }

            processCanvas();
        }
    }

    // 画像を文字列に変換
    reader.readAsDataURL(target.files[0]);
    console.log(target.files[0]);
}