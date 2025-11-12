package group5.ms.tongji.recommendation.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "userTags")
@AllArgsConstructor
@NoArgsConstructor
public class UserFrequentTags {

    @EmbeddedId
    private UserTag userTag;

    private float weight;

    private Date timestamp;

}
