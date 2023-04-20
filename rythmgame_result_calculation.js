var imagewidth = 1;
var imageheight = 2;

function imageinput(target){
    console.log("画像を受け取りました。");
    var image = new Image();
    var reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById("image_test").setAttribute("src", e.target.result);
        image.src = e.target.result;
        image.onload = function () {
            console.log("横幅：%d\n高さ：%d", image.naturalWidth, image.naturalHeight);
            console.log(document.getElementById("imagesize"));
            document.getElementById("imagesize").textContent = `縦：${image.naturalWidth}px, 横：${image.naturalHeight}px`;
        }
    }
    reader.readAsDataURL(target.files[0]);
    console.log(target.files[0]);
}