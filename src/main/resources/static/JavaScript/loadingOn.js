function loadingOn() {
    // 전체 화면을 덮기 위한 div 요소 생성
    var overlay = document.createElement("div");
    overlay.id = "overlay";

    // 스타일 설정
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // 투명도 0.5

    // 이미지를 생성하고 속성 설정
    var image = document.createElement("img");
    image.id = "lodgin";
    image.src = "css/images/loading.gif";
    image.alt = "location images";

    // 이미지 스타일 설정
    image.style.position = "absolute";
    image.style.top = "50%";
    image.style.left = "50%";
    image.style.transform = "translate(-50%, -50%)";
    image.style.width = "7rem";
    image.style.height = "7rem";
    image.style.display = "block"; // 이미지를 화면에 표시

    // body에 overlay 추가
    document.body.appendChild(overlay);

    // overlay에 이미지 추가
    overlay.appendChild(image);

    // "header_sk_loding" 이미지 생성 및 스타일 설정
    var headerSkLoding = document.createElement("img");
    headerSkLoding.id = "header_sk_loding";
    headerSkLoding.src = "css/images/Ghost.png";
    headerSkLoding.alt = "location images";

    // "header_sk_loding" 스타일 설정
    headerSkLoding.style.position = "absolute";
    headerSkLoding.style.top = "calc(50% - 5px)"; // 아주 조금 위로 조정
    headerSkLoding.style.left = "50%";
    headerSkLoding.style.transform = "translate(-50%, -50%);" // X축으로도 중앙 정렬
    headerSkLoding.style.width = "3rem";
    headerSkLoding.style.height = "3rem";
    headerSkLoding.style.animation = "ghost_loading 2s linear infinite"; // 반복적으로 실행되도록 수정

    // overlay에 "header_sk_loding" 이미지 추가
    overlay.appendChild(headerSkLoding);
}

// "header_sk_loding" 이미지에 대한 @keyframes 애니메이션 추가
let style = document.createElement("style");
style.innerHTML = `
    @keyframes ghost_loading {
        0%, 100% {top: calc(50% - 5px); opacity: 1;} /* 초기와 마지막 위치는 동일 */
        50% {top: calc(50% + 5px); opacity: 0.5;} /* 중간 위치 */
    }
`;
document.head.appendChild(style);