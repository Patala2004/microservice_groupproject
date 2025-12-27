package group5.ms.tongji.recommendation.model.posttag;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "post_tag")
@AllArgsConstructor
@NoArgsConstructor
public class PostTag {
    @EmbeddedId
    PostTagId postTagId;
}
