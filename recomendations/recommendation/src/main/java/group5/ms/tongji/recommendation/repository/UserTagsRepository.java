package group5.ms.tongji.recommendation.repository;

import group5.ms.tongji.recommendation.model.UserFrequentTag;
import group5.ms.tongji.recommendation.model.UserTagKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserTagsRepository extends JpaRepository<UserFrequentTag, UserTagKey> {

    List<UserFrequentTag> findByUserTag_UserId(int userId);
}