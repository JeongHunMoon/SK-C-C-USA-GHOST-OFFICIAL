package GHOST.sk_ghost.dto.loginDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserNameJudgement {
    private String name;
    public UserNameJudgement() {

    }

    public UserNameJudgement(String name) {
        this.name = name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
