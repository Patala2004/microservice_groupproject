package group5.ms.tongji.recommendation.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "userTags")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserFrequentTag {

    @EmbeddedId
    private UserTagKey userTag;

    private float weight;

    private Date timestamp;

}
