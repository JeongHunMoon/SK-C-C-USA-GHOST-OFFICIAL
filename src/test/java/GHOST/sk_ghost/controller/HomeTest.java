package GHOST.sk_ghost.controller;

import GHOST.sk_ghost.SkGhostApplication;
import GHOST.sk_ghost.service.V1service;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest(classes = SkGhostApplication.class) //SpringBootTest() 에 파라미터로 어떤 Spring 어플리케이션을 테스트하는지 명시한다.
@AutoConfigureMockMvc //
class HomeTest {
    @Autowired    //Autowired를 이용해 필요한 빈을 주입받을 수 있다.
    private MockMvc mockMvc;
    private V1service v1service;

    @Test
    public void test_doHome() throws Exception {
        MvcResult result = mockMvc.perform(get("/"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();

        System.out.println("Test doHome is good");
        System.out.println(content);
    }

    @Test
    void checkOfUser() throws Exception {
        MvcResult result = mockMvc.perform(get("/"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();

        System.out.println("Test checkOfUser is good");
        System.out.println(content);
    }

    @Test
    void goingToWork() throws Exception {
//        MvcResult result = mockMvc.perform(get("/"))
//                .andExpect(MockMvcResultMatchers.status().isOk())
//                .andReturn();
//
//        String content = result.getResponse().getContentAsString();
//
//        System.out.println("Test goingToWork is good");
//        System.out.println(content);
    }

    @Test
    void goToOpPage() throws Exception {
//        MvcResult result = mockMvc.perform(get("/"))
//                .andExpect(MockMvcResultMatchers.status().isOk())
//                .andReturn();
//
//        String content = result.getResponse().getContentAsString();
//
//        System.out.println("Test goToOpPage is good");
//        System.out.println(content);
    }

    @Test
    void checkForasking() throws Exception {
//        MvcResult result = mockMvc.perform(get("/"))
//                .andExpect(MockMvcResultMatchers.status().isOk())
//                .andReturn();
//
//        String content = result.getResponse().getContentAsString();
//
//        System.out.println("Test checkForasking is good");
//        System.out.println(content);
    }

    @Test
    void getMe() throws Exception {
//        MvcResult result = mockMvc.perform(get("/"))
//                .andExpect(MockMvcResultMatchers.status().isOk())
//                .andReturn();
//
//        String content = result.getResponse().getContentAsString();
//
//        System.out.println("Test getMe is good");
//        System.out.println(content);
    }
}