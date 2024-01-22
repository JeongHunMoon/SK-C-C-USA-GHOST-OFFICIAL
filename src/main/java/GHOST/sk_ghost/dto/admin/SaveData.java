package GHOST.sk_ghost.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaveData {
    String datas;

    public SaveData() {}
    public SaveData(String datas) {
        this.datas = datas;
    }
}
