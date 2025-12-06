package microservices.groupproject.post_api.repository;

import microservices.groupproject.post_api.model.Post;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
    boolean existsByTitle(String title);
    Page<Post> findByTitle(String title, Pageable paginable);
    Page<Post> findByTitleContainingIgnoreCase(String title, Pageable paginable);

    Page<Post> findByContentContainingIgnoreCase(String title, Pageable paginable);
}
