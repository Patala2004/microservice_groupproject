package group5.ms.tongji.recommendation.model.posttag;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class PostTagId {
    private int postId;
    private int tagId;
}
