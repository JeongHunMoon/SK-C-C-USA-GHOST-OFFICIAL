function getNewYorkTime() {
    // 뉴욕 시간대의 오프셋 (Eastern Standard Time)
    const newYorkOffset = -5 * 60; // 미국 동부 표준시(EST)는 UTC-5

    // 현재 시간을 UTC로 가져오기
    const utcNow = new Date();

    // 뉴욕 시간대의 현재 시간 계산
    const newYorkTime = new Date(utcNow.getTime() + newYorkOffset * 60 * 1000);

    // 시간과 분을 가져오기
    const hours = newYorkTime.getUTCHours().toString().padStart(2, '0');
    const minutes = newYorkTime.getUTCMinutes().toString().padStart(2, '0');

    // HH:MM 형태로 반환
    return `${hours}:${minutes}`;
}