package group5.ms.tongji.recommendation.repository.posttag;

import group5.ms.tongji.recommendation.dto.RecommendableItem;
import group5.ms.tongji.recommendation.model.posttag.PostTag;
import group5.ms.tongji.recommendation.model.posttag.PostTagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostTagRepository extends JpaRepository<PostTag, PostTagId> {
    @Query(value = "SELECT p.postTagId.postId AS id, array_agg(p.postTagId.tagId) AS tags FROM PostTag p GROUP BY p.postTagId.postId")
    RecommendableItem[] findAllRecommendablePosts();

}
