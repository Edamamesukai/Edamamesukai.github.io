const canvas_id_list = ["image_canvas", "perfectimage", "greatimage", "goodimage", "badimage", "missimage"];

function imageinput(target){
    console.log("画像を受け取りました。");

    var image = new Image();
    var reader = new FileReader();

    reader.onload = function (e) {
        image.src = e.target.result;
        image.onload = function () {
            console.log("横幅：%d\n高さ：%d", image.naturalWidth, image.naturalHeight);
            document.getElementById("imagesize").textContent = `縦：${image.naturalWidth}px, 横：${image.naturalHeight}px`;

            // 各リザルトを取得するためのオフセットを設定
            var xOffset = 690;
            var yOffset = 440;

            for (var canvas_id of canvas_id_list) {
                // メインのcanvasの設定
                var canvas = document.getElementById(canvas_id);
                var context = canvas.getContext("2d");

                // drawImage(image, xOffset, yOffset, width, height)
                if (canvas_id === "image_canvas"){
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context.drawImage(image, 0, 0);
                } else {
                    // drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
                    canvas.width = 80;
                    canvas.height = 35;
                    context.drawImage(image, xOffset, yOffset, 80, 40, 0, 0, 80, 40);
                    yOffset += 40;
                }
            }
        }
    }

    // 画像を文字列に変換
    reader.readAsDataURL(target.files[0]);
    console.log(target.files[0]);
}