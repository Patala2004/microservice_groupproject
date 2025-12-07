package microservices.groupproject.post_api.specification;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import microservices.groupproject.post_api.model.*;

public class PostSpecification {

    public static Specification<Post> titleStartsWith(String prefix) {
        return (root, query, cb) -> prefix == null ? null : cb.like(root.get("title"), prefix + "%");
    }

    public static Specification<Post> titleContains(String keyword) {
        return (root, query, cb) -> keyword == null ? null : cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%");
    }

    public static Specification<Post> contentContains(String keyword) {
        return (root, query, cb) -> keyword == null ? null : cb.like(cb.lower(root.get("content")), "%" + keyword.toLowerCase() + "%");
    }

    public static Specification<Post> hasType(PostType type) {
        return (root, query, cb) -> type == null ? null : cb.equal(root.get("type"), type);
    }

    public static Specification<Post> locationTitleContains(String locationTitle) {
        return (root, query, cb) -> {
            if (locationTitle == null) return null;
            Join<Post, Location> locationJoin = root.join("location", JoinType.LEFT);
            return cb.like(cb.lower(locationJoin.get("title")), "%" + locationTitle.toLowerCase() + "%");
        };
    }

    public static Specification<Post> postedBy(Long userId) {
        return (root, query, cb) -> userId == null ? null : cb.equal(root.get("poster"), userId);
    }
}