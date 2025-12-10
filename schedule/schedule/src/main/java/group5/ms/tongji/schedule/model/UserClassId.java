package group5.ms.tongji.schedule.model;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class UserClassId implements Serializable {
    private Integer userId;
    private Integer sessionId;

}