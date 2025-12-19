package microservices.groupproject.post_api.service;

import microservices.groupproject.post_api.model.Post;
import microservices.groupproject.post_api.model.PostType;
import microservices.groupproject.post_api.repository.PostRepository;
import microservices.groupproject.post_api.specification.PostSpecification;
import microservices.groupproject.post_api.exception.PostNotFoundException;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> getAllPosts(
            String titleStartsWith,
            String titleContains,
            String contentContains,
            PostType type,
            String locationTitle,
            LocalDateTime afterCreationTime,
            LocalDateTime beforeCreationTime,
            LocalDateTime afterEventTime,
            LocalDateTime beforeEventTime,
            Long posterId,
            Long participantId) {
        Specification<Post> spec = Specification.<Post>unrestricted()
                .and(PostSpecification.titleStartsWith(titleStartsWith))
                .and(PostSpecification.titleContains(titleContains))
                .and(PostSpecification.contentContains(contentContains))
                .and(PostSpecification.hasType(type))
                .and(PostSpecification.locationTitleContains(locationTitle))
                .and(PostSpecification.postedBy(posterId))
                .and(PostSpecification.creationBefore(beforeCreationTime))
                .and(PostSpecification.creationAfter(afterCreationTime))
                .and(PostSpecification.eventBefore(beforeEventTime))
                .and(PostSpecification.eventAfter(afterEventTime))
                .and(PostSpecification.hasJoined(participantId));

        return postRepository.findAll(spec);
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(id));
    }

    public List<Post> getPostByIdNotOrderedByCreationTime(List<Long> ids, int pageSize){
        PageRequest pageable = PageRequest.of(0, pageSize, Sort.by("creationTime").descending());
        
        if(ids == null || ids.isEmpty()){
            // If no IDs to exclude, just return the newest posts
            return postRepository.findAll(pageable).getContent();
        }

        return postRepository.findByIdNotIn(ids, pageable).getContent();
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post updatePost(Long postId, Post post) {
        Post existing = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));

        existing.setTitle(post.getTitle());
        existing.setContent(post.getContent());
        existing.setEventTime(post.getEventTime());
        existing.setLocation(post.getLocation());

        return postRepository.save(existing);
    }

    public Post updatePostImage(Long postId, String imageUrl){
        Post existing = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));
        
        existing.setImageUrl(imageUrl);
        return postRepository.save(existing);
    }

    public boolean joinEvent(Long postId, Long userId) {
        Post existing = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));

        if (!existing.getJoinedUsers().contains(userId)) {
            existing.getJoinedUsers().add(userId);
            postRepository.save(existing);
            return true;
        }
        
        return false;
    }

    public boolean leaveEvent(Long postId, Long userId) {
        Post existing = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException(postId));

        if (existing.getJoinedUsers().contains(userId)) {
            existing.getJoinedUsers().remove(userId);
            postRepository.save(existing);
            return true;
        }
        
        return false;
    }

    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        postRepository.delete(post);
    }

    public List<Post> getPostList(List<Long> postIds) {
        List<Post> postList = new ArrayList<>();
        for (Long id : postIds) {
            Post post = postRepository.findById(id)
                    .orElseThrow(() -> new PostNotFoundException(id));

            postList.add(post);
        }

        return postList;
    }
}