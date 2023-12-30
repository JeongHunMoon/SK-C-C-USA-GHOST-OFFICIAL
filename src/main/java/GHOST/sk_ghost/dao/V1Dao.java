package GHOST.sk_ghost.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface V1Dao {

    public List<Map<String, String>> userList();
    public List<Map<String, String>> shiftAdminList();

}
