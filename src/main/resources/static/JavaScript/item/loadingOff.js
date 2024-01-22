// 로딩 페이지를 off 하는 함수.
function loadingOff() {
    // overlay 제거
    let overlay = document.getElementById("overlay");
    if (overlay) {
        overlay.parentNode.removeChild(overlay);
    }
}