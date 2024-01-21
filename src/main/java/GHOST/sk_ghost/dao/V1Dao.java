package GHOST.sk_ghost.dao;

import GHOST.sk_ghost.dto.LoginDto.InsertNewUser;
import GHOST.sk_ghost.dto.LoginDto.UserNameJudgement;
import GHOST.sk_ghost.dto.OP.AdminShiftParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Mapper
public interface V1Dao {
    // 사용자 검증을 위한 Dao
    public List<Map<String, String>> userList();

    // 금일 대응 운영자 1, 2차 조회 Dao
    public List<Map<String, String>> shiftAdminList(AdminShiftParam param);

    public List<Map<String, String>> oneDateSchedule(String dateInfo);

    //DB에 삽입
    public void saveSchedule(List<Map<String, String>> scheduleData);

    // 운영자 스케줄 조회
    public List<Map<String ,String>> adminShiftListAll();

    public ArrayList<String> adminShiftLastDate();

    public void deleteSchedule(List<Map<String, String>> scheduleData);

    public void updateSchedule(Map<String, String> scheduleData);

    public String getNameFromId(String id);

    public int isDateHistory(String date);

    public void insertDateToScheduleHistoryTable(@Param("date") String date, @Param("creator") String creator);

    // history table업데이트
    public void updateDateToScheduleHistoryTable(@Param("date") String date, @Param("modificator") String modificator);

    // admin_shift 테이블에서 해당 날짜를 가진 투플의 개수 반환.
    public boolean isDateAdminShiftTable(String date);

    public void deleteDateToScheduleHistoryTable(String date);

    public boolean judgeUserNameInDB(UserNameJudgement userNameJudgement);

    public void insertJoinInfoToDB(InsertNewUser insertNewUser);
}
