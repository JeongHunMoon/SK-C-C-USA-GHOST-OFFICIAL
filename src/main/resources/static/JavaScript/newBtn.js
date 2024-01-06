function newBtn() {
    // 서버에서 현재 접근 가능한지 판단
        // 만약 접근 가능하다면 -> 디비에서 다음 날짜를 가져온다. > new.html 페이지를 띄운다. (디비 값을 받아온다.) > 카드 생성 함수를 실행한다.

    // 접근 불가능하다면, admin.html 페이지로 간다.
    window.location.href = '/                '+'?uuid=' + hashValue; // OP 페이지로 이동하기 위한 get 요청
    /*
    let xhr1 = new XMLHttpRequest();
    xhr1.open('GET', '/judgeNewSchedule?user=문정훈', true);
    xhr1.setRequestHeader("Content-Type", "application/json");
    xhr1.send();

    xhr1.onload = function () {
        let results = JSON.parse(xhr1.response);
    }

    */

}