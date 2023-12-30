package GHOST.sk_ghost.service;

import GHOST.sk_ghost.dao.V1Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

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
}
