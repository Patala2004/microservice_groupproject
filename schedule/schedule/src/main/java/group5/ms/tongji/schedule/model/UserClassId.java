package group5.ms.tongji.schedule.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class UserClassId implements Serializable {
    private Integer userId;
    private Integer sessionId;

}