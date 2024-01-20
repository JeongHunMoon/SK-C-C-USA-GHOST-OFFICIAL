function userInfoChangeFuntion() {
    // span 태그를 가져옵니다.
    let changeSpan = document.getElementById("change");

    // 클릭 이벤트에 대한 리스너를 추가합니다.
    changeSpan.addEventListener("click", function() {
        // 클릭 시 실행될 함수를 여기에 작성합니다.
        alert("Span 태그가 클릭되었습니다!");
    })
}