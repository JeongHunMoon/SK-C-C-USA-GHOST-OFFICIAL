package GHOST.sk_ghost.dto.LoginDto;

import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
public class InsertNewUser {
    // Getter 및 Setter 메서드
    private String id;
    private String name;
    private String process;

    // 기본 생성자
    public InsertNewUser() {
    }

    // 매개변수를 받는 생성자
    public InsertNewUser(String id, String name, String process) {
        this.id = id;
        this.name = name;
        this.process = process;
    }

    @Override
    public String toString() {
        return "InsertNewUser{" +
                "id='" + id + '\'' +
                ", process='" + process + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
