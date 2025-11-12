package group5.ms.tongji.recommendation.repository;

import group5.ms.tongji.recommendation.model.UserFrequentTags;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<UserFrequentTags, Long> {

    List<UserFrequentTags> findByUserId(int userId);
}