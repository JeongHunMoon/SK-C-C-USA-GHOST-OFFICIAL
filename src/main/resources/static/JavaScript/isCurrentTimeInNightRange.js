// 주어진 시간이 야간(23:00~01:00)에 속하는지 확인하는 함수
// 사용 예시 const nightRangeResult = isCurrentTimeInNightRange();

function isCurrentTimeInNightRange() {
    const lowerBound = 23; // 23:00
    const upperBound = 1;  // 01:00

    const newYorkTime = getNewYorkTime();
    const currentHour = parseInt(newYorkTime.split(':')[0]);

    if (currentHour >= lowerBound || currentHour < upperBound) {
        if (currentHour >= lowerBound) {
            return 0; // 23:00 ~ 23:59
        } else {
            return 1; // 00:00 ~ 01:00
        }
    } else {
        return -1; // 23:00 ~ 01:00 아님
    }
}
