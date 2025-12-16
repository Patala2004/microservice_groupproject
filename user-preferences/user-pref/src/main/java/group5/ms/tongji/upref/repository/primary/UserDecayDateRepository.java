package group5.ms.tongji.upref.repository.primary;

import group5.ms.tongji.upref.model.primary.UserDecayDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Repository
public interface UserDecayDateRepository extends JpaRepository<UserDecayDate, Integer> {
    @Query("SELECT u.decayDate FROM UserDecayDate u WHERE u.id = :id")
    Date findDecayDateById(int id);

    @Modifying
    @Transactional
    @Query("UPDATE UserDecayDate u SET u.decayDate = :decayDate WHERE u.id = :id")
    void updateDecayDate(int id, Date decayDate);
}
