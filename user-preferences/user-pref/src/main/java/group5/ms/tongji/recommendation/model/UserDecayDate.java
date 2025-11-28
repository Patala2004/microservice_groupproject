package group5.ms.tongji.recommendation.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.util.Date;

@Entity
@Table
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserDecayDate {
    @Id
    private int id;
    private Date decayDate;
}
