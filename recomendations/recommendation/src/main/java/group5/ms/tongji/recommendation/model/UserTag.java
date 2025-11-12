package group5.ms.tongji.recommendation.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class UserTag {
    private int userId;
    private int tagId;
}
