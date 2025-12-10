package group5.ms.tongji.schedule.repository;

import group5.ms.tongji.schedule.dto.ScheduleItem;
import group5.ms.tongji.schedule.model.UserClassId;
import group5.ms.tongji.schedule.model.UserClassSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface UserClassesRepository extends JpaRepository<UserClassSession, UserClassId> {
    /*@Query("""
            SELECT u.userId FROM user_class u
            WHERE u.userId = :userId
            AND u.classCode IN :classCodes;
            """)
    UserClassSession findUserCoincidences(List<String> classCodes, Integer userId);*/

    @Query(value = """
            SELECT c.className as title, c.start, c.end FROM user_class u
            JOIN class_session c ON u.sessionId = c.sessionId
            WHERE u.userId = :userId
            AND c.start < :end
            AND c.end > :start;
            """,
            nativeQuery = true)
    List<ScheduleItem> findUserCoincidences(LocalDateTime start, LocalDateTime end, Integer userId);

    @Query()
    UserClassSession findByIdUserId(Integer userId);
}
