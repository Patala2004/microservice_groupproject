package group5.ms.tongji.schedule.repository;

import group5.ms.tongji.schedule.model.ClassSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ClassesRepository extends JpaRepository<ClassSession, Integer> {
    /*@Query(value = """
            SELECT * FROM class_session c
            WHERE c.start < :end 
            AND c.end > :start;
            """,
            nativeQuery = true
    )
    List<ClassSession> findOverlapping(LocalDateTime start, LocalDateTime end);*/

    ClassSession findByClassCode(String classCode);

}
