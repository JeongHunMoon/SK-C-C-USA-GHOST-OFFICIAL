package GHOST.sk_ghost.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LastShiftDate {
    public String date = null;
    public LastShiftDate() {

    }
    public LastShiftDate(String date) {
        this.date = date;
    }
}
