package group5.ms.tongji.recommendation.repository.posttag;

import group5.ms.tongji.recommendation.dto.RecommendableItem;
import group5.ms.tongji.recommendation.dto.UserFrequentTag;
import group5.ms.tongji.recommendation.model.posttag.PostTag;
import group5.ms.tongji.recommendation.model.posttag.PostTagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostTagRepository extends JpaRepository<PostTag, PostTagId> {
    @Query(
            value = """
        SELECT p.post_id AS id,
               array_agg(p.tag_id) AS tags
        FROM post_tag p
        WHERE p.post_id IN (
            SELECT DISTINCT post_id FROM post_tag
            WHERE tag_id = ANY(:uTags)
            )
        GROUP BY p.post_id;
        """,
            nativeQuery = true
    )
    List<RecommendableItem> findAllRecommendablePosts(Integer[] uTags);

}
