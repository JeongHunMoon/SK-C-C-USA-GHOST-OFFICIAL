package GHOST.sk_ghost.service;

import GHOST.sk_ghost.dao.V1Dao;
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

    public List<Map<String, String>> shiftAdminList() {
        List<Map<String, String>> list = v1Dao.shiftAdminList();
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

    @Transactional
    public void saveSchedule(List<Map<String, String>> scheduleData) {
        int result = 1;
        try {
            v1Dao.saveSchedule(scheduleData);
        } catch (Exception e) {
            // System.out.println("Fail to call v1Dao" + e.getMessage());
            // e.printStackTrace();
        }
    }

    public ArrayList<String> adminShiftLastDate() {
        ArrayList<String> list = v1Dao.adminShiftLastDate();
        return list;
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

    public void modifyUpdate(List<Map<String, String>> scheduleData){
        try {
            System.out.println("변경준비완료");
            v1Dao.modifyUpdate(scheduleData);

        } catch (Exception e) {
            System.out.println("Fail to call v1Dao" + e.getMessage());
            e.printStackTrace();
        }
    }
}
