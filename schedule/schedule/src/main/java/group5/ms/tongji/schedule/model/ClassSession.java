package group5.ms.tongji.schedule.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "class_session")
@NoArgsConstructor
@Getter
@Setter
public class ClassSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer sessionId;
    String code;
    String name;
    LocalDateTime startDate;
    LocalDateTime endDate;

    public ClassSession(String code, String name, LocalDateTime startDate, LocalDateTime endDate) {
        this.code = code;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
