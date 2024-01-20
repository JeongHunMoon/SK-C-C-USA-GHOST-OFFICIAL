// 끝 날짜를 가져오는 함수
function getCurrEndDate() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    return endDate.toISOString().split('T')[0];
}