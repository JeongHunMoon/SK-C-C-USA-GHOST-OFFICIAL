package GHOST.sk_ghost.controller;

import GHOST.sk_ghost.SkGhostApplication;
import GHOST.sk_ghost.service.V1service;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import java.nio.charset.StandardCharsets;




@SpringBootTest(classes = SkGhostApplication.class) //SpringBootTest() 에 파라미터로 어떤 Spring 어플리케이션을 테스트하는지 명시한다.
@AutoConfigureMockMvc //
class HomeTest {
    @Autowired    //Autowired를 이용해 필요한 빈을 주입받을 수 있다.
    private MockMvc mockMvc;
    @Autowired
    private V1service v1service; //new
    @Autowired
    private Home homecontroller; //new

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
    void test_checkOfUser() throws Exception {

        String requestBody = "{\"Who\":\"jpwoo327@kakao.com\"}";

        // POST 요청 수행
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/check")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        // 결과 확인
        String content = new String(result.getResponse().getContentAsByteArray(), StandardCharsets.UTF_8);
        System.out.println(content);
        System.out.println("Test checkOfUser_validUser is good");

//        V1service v1serviceMock = mock(V1service.class);
        // 특정 메서드가 호출될 때 반환할 값을 지정
//        when(v1service.userList()).thenReturn(Collections.singletonList(
//                Collections.singletonMap("id", "validUserId")
//        ));
//        // HTTP 요청 수행
//        MvcResult result = (MvcResult) mockMvc.perform(MockMvcRequestBuilders.post("/check")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content("{\"Who\":\"validUserId\"}"))
//                .andExpect(MockMvcResultMatchers.status().isOk())
//                .andExpect(MockMvcResultMatchers.content().string("ValidUser validUserId"))
//                .andReturn();
//
//        String content = result.getResponse().getContentAsString();
//
//        System.out.println("Test checkOfUser_validUser is good");
//        System.out.println(content);
    }

    @Test
    void test_goingToWork() throws Exception {
        String requestBody = "{\"shift\":\"not\"}";

        // POST 요청 수행
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/goingToWork")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        // 결과 확인
        String content = new String(result.getResponse().getContentAsByteArray(), StandardCharsets.UTF_8);
        System.out.println(content);
        System.out.println("godingToWork Success");
    }

    @Test
    void test_goToOpPage_NoneMatched() throws Exception {
        MvcResult result = mockMvc.perform(get("/OP")
                .param("uuid", java.util.UUID.randomUUID().toString()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();

        System.out.println("Test doHome is good");
        System.out.println(content);
    }

    @Test
    void test_goToOpPage_Matched() throws Exception {
        String uuid = java.util.UUID.randomUUID().toString();
        String hashValue = uuid;

        MvcResult result = mockMvc.perform(get("/OP")
                .param("uuid", uuid))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();

        System.out.println("Test doHome is good");
        System.out.println(content);

    }

    @Test
    void test_checkForasking() throws Exception {
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
    void test_getMe() throws Exception {
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