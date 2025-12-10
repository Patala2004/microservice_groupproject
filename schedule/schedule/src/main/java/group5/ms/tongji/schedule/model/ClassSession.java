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
    LocalDateTime start;
    LocalDateTime end;

    public ClassSession(String code, String name, LocalDateTime start, LocalDateTime end) {
        this.code = code;
        this.name = name;
        this.start = start;
        this.end = end;
    }
}
