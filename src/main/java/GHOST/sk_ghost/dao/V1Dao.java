package GHOST.sk_ghost.dao;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Mapper
public interface V1Dao {
    // 사용자 검증을 위한 Dao
    public List<Map<String, String>> userList();
    // 금일 대응 운영자 1, 2차 조회 Dao
    public List<Map<String, String>> shiftAdminList();
    public List<Map<String, String>> oneDateSchedule(String dateInfo);
    //DB에 삽입
    public int saveSchedule(Map<String, String> scheduleData);

    public ArrayList<String> adminShiftLastDate();
}
