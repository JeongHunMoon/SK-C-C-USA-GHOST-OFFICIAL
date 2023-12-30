function loadingOff() {
    // overlay 제거
    var overlay = document.getElementById("overlay");
    if (overlay) {
        overlay.parentNode.removeChild(overlay);
    }
}