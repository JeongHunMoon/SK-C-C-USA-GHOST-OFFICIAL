package GHOST.sk_ghost.dto.LoginDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUser {
    // Getter 및 Setter 메서드
    private String id;
    private String name;
    private String process;


    // 기본 생성자
    public UpdateUser() {
    }

    // 매개변수를 받는 생성자
    public UpdateUser(String id, String name, String process) {
        this.id = id;
        this.name = name;
        this.process = process;
    }

    @Override
    public String toString() {
        return "UpdateUser{" +
                "id='" + id +
                ", process='" + process + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
