package group5.ms.tongji.schedule.repository;

import group5.ms.tongji.schedule.dto.ScheduleItem;
import group5.ms.tongji.schedule.model.UserClassId;
import group5.ms.tongji.schedule.model.UserClassSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface UserClassesRepository extends JpaRepository<UserClassSession, UserClassId> {

    @Query(value = """
            SELECT c.start_date as start, c.end_date as end, c.name as title FROM user_class u
            JOIN class_session c ON u.session_id = c.session_id
            WHERE u.user_id = :userId
            AND c.start_date < :end
            AND c.end_date > :start;
            """,
            nativeQuery = true)
    List<ScheduleItem> findUserCoincidences(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("userId") Integer userId
    );

    @Query()
    UserClassSession findByUserClassUserId(Integer userId);

    @Query
    boolean existsByUserClassUserId(Integer userId);
    @Query
    long deleteByUserClassUserId(Integer userId);
}
