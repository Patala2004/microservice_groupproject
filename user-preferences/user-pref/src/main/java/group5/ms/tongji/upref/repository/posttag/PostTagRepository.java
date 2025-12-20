package group5.ms.tongji.upref.repository.posttag;

import group5.ms.tongji.upref.model.posttag.PostTag;
import group5.ms.tongji.upref.model.posttag.PostTagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostTagRepository extends JpaRepository<PostTag, PostTagId> {
    @Query(
            value = "SELECT p.tag_id FROM post_tag p WHERE p.post_id = :postId",
            nativeQuery = true
            )
    List<Integer> findAllTagIds(int postId);

}
