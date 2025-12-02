package group5.ms.tongji.recommendation.repository.posttag;

import group5.ms.tongji.recommendation.model.posttag.PostTag;
import group5.ms.tongji.recommendation.model.posttag.PostTagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostTagRepository extends JpaRepository<PostTag, PostTagId> {
    @Query("SELECT p.postTagId.tagId FROM PostTag p WHERE p.postTagId.postId = :postId")
    List<Integer> findAllTagIds(int postId);

}
