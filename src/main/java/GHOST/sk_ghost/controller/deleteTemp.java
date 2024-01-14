package GHOST.sk_ghost.controller;

import GHOST.sk_ghost.service.V1service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;


@Controller
public class deleteTemp {

    @Autowired
    V1service v1service; // Service 호출을 위한 객체
    @PostMapping("/delete")
    public ResponseEntity<String> deleteSchedule(@RequestBody List<Map<String, String>> requestBody) throws Exception {
        try{
            System.out.println("Delete from DB : " + requestBody);
            v1service.deleteSchedule(requestBody);
        }
        catch (Exception e) {
            return ResponseEntity.ok("Delete Fail");
        }
        return ResponseEntity.ok("Delete Success");
    }
}
