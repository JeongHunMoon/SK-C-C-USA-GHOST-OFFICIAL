package GHOST.sk_ghost.dto.OP;

import lombok.Getter;

@Getter
public class AdminShiftParam {
    private String date;
    private String shift;

    public AdminShiftParam() {
        // 기본 생성자의 내용 (아무것도 추가하지 않아도 됨)
    }

    public AdminShiftParam(String date, String shift) {
        this.date = date;
        this.shift = shift;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setShift(String shift) {
        this.shift = shift;
    }

    @Override
    public String toString() {
        return "AdminShiftParam{" +
                "date='" + date + '\'' +
                ", shift='" + shift + '\'' +
                '}';
    }
}
