package GHOST.sk_ghost.dto.OP;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckIDInDB {
    public String id;

    public CheckIDInDB() {
    }

    public CheckIDInDB(String id) {
        this.id = id;
    }
}
