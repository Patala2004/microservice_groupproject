package group5.ms.tongji.recommendation.dto;

import jakarta.persistence.EmbeddedId;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

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
