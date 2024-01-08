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
    public int saveSchedule(List<Map<String, String>> scheduleData) {
        int result = 1;
        try {
            v1Dao.saveSchedule(scheduleData);
//            System.out.println("Success to call v1Dao");
        } catch (Exception e) {
//            System.out.println("Fail to call v1Dao" + e.getMessage());
//            e.printStackTrace();
        }
        return result;
    }

    public ArrayList<String> adminShiftLastDate() {
        ArrayList<String> list = v1Dao.adminShiftLastDate();
        return list;
    }

}
