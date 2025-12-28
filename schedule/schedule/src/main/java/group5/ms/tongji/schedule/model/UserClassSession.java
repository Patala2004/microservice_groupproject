package group5.ms.tongji.schedule.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_class")
@AllArgsConstructor
@NoArgsConstructor
public class UserClassSession {
    @EmbeddedId
    UserClassId userClass;
}
