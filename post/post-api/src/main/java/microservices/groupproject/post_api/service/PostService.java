package microservices.groupproject.post_api.service;

import microservices.groupproject.post_api.model.Post;
import microservices.groupproject.post_api.repository.PostRepository;
import microservices.groupproject.post_api.exception.PostNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
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