package GHOST.sk_ghost.service;

import GHOST.sk_ghost.dao.V1Dao;
import GHOST.sk_ghost.dto.LoginDto.InsertNewUser;
import GHOST.sk_ghost.dto.LoginDto.UserNameJudgement;
import GHOST.sk_ghost.dto.OP.AdminShiftParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
public class V1service {
    @Autowired
    V1Dao v1Dao;

    public List<Map<String, String>> userList() {
        List<Map<String, String>> list = v1Dao.userList();
        return list;
    }

    public List<Map<String, String>> shiftAdminList(AdminShiftParam param) {
        List<Map<String, String>> list = v1Dao.shiftAdminList(param);
        return list;
    }

    public List<Map<String, String>> oneDateSchedule(String dateInfo) {
        List<Map<String, String>> list = v1Dao.oneDateSchedule(dateInfo);
        return list;
    }

    public List<Map<String, String>> adminShiftListAll() {
        List<Map<String, String>> list = v1Dao.adminShiftListAll();
        return list;
    }

    public ArrayList<String> adminShiftLastDate() {
        ArrayList<String> list = v1Dao.adminShiftLastDate();
        return list;
    }

    @Transactional
    public void saveSchedule(List<Map<String, String>> scheduleData) {
        try {
            v1Dao.saveSchedule(scheduleData);
        } catch (Exception e) {
             System.out.println("Fail to call v1Dao" + e.getMessage());
             e.printStackTrace();
        }
    }

    public void deleteSchedule(List<Map<String, String>> scheduleData){
        int result = 1;
        try {
            System.out.println("삭제준비완료" +scheduleData);
            v1Dao.deleteSchedule(scheduleData);
        } catch (Exception e) {
            System.out.println("Fail to call v1Dao" + e.getMessage());
            e.printStackTrace();
        }
    }

    @Transactional
    public void updateSchedule(List<Map<String, String>> itemList) {
        try {
            System.out.println("변경 준비 완료 : " + itemList);

            for (Map<String, String> scheduleItem : itemList) {
                // 업데이트는 반드시
                v1Dao.updateSchedule(scheduleItem);
            }

        } catch (Exception e) {
            System.out.println("Fail to call v1Dao: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // 카카오 id > 사용자의 이름
    public String getNameFromId(String id) {
        String userName = v1Dao.getNameFromId(id);

        // 이름이 없을 경우 기본값 "홍길동" 반환
        return (userName != null && !userName.isEmpty()) ? userName : "???";
    }

    // 해당 날짜가 history 테이블에 있는지 검사
    public boolean isDateHistory(String date) {
        int count = v1Dao.isDateHistory(date);
        System.out.println("서비스 : " + date + "가 디비에 있나? >" + count);
        return count > 0;
    }

    public void insertDateToScheduleHistoryTable(String date, String creator){
        System.out.println("삽입" + date + " : " + creator + "이 값을 히스토리에 넣음");

        v1Dao.insertDateToScheduleHistoryTable(date, creator);
    }

    public void updateDateToScheduleHistoryTable(String date, String modificator){
        System.out.println(date + " : " + modificator + "이 값을 히스토리에 변경한다.");

        v1Dao.updateDateToScheduleHistoryTable(date, modificator);
    }

    public boolean isDateAdminShiftTable(String date) {
        boolean bool = v1Dao.isDateAdminShiftTable(date);
        System.out.println("admin_shift 삭제 : " + date + "가 존재하는 판단 요청됨>> " + bool);
        return bool;
    }

    public void deleteDateToScheduleHistoryTable(String date) {
        System.out.println("삭제 : " +date + "shedule_admin 테이블에서 삭제 요청됨");
        v1Dao.deleteDateToScheduleHistoryTable(date);
    }

    public boolean judgeUserNameInDB(UserNameJudgement userNameJudgement) {
        boolean bool = v1Dao.judgeUserNameInDB(userNameJudgement);
        System.out.println("회원가입시 사용자 이름 디비에 있는지 판단 service : " + bool);
        return bool;
    }

    public void insertJoinInfoToDB(InsertNewUser insertNewUser) {
        v1Dao.insertJoinInfoToDB(insertNewUser);
    }
}
