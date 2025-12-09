package microservices.groupproject.post_api.service;

import microservices.groupproject.post_api.model.Post;
import microservices.groupproject.post_api.model.PostType;
import microservices.groupproject.post_api.repository.PostRepository;
import microservices.groupproject.post_api.specification.PostSpecification;
import microservices.groupproject.post_api.exception.PostNotFoundException;

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
        Long posterId
    ) {
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
            .and(PostSpecification.eventAfter(afterEventTime));

        return postRepository.findAll(spec);
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
        .orElseThrow(() -> new PostNotFoundException(id));
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post updatePost(Long id, Post postDetails) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        post.setTitle(postDetails.getTitle());
        post.setContent(postDetails.getContent());

        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
            
        postRepository.delete(post);
    }

    public List<Post> getPostList(List<Long> postIds){
        List<Post> postList = new ArrayList<>();
        for(Long id: postIds){
            Post post = postRepository.findById(id)
            .orElseThrow(() -> new PostNotFoundException(id));

            postList.add(post);
        }

        return postList;
    }
}