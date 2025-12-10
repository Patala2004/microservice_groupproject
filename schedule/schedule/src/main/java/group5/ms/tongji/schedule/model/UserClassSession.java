package group5.ms.tongji.schedule.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_class")
public class UserClassSession {
    @EmbeddedId
    UserClassId userClass;
}
