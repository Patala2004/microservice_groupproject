package group5.ms.tongji.upref.repository.primary;

import group5.ms.tongji.upref.model.primary.UserFrequentTag;
import group5.ms.tongji.upref.model.primary.UserTagKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserTagsRepository extends JpaRepository<UserFrequentTag, UserTagKey> {

    List<UserFrequentTag> findByUserTag_UserId(int userId);
}