package microservices.groupproject.post_api.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import microservices.groupproject.post_api.StorageService.StorageService;
import microservices.groupproject.post_api.model.*;
import microservices.groupproject.post_api.repository.LocationRepository;
import microservices.groupproject.post_api.repository.PostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import microservices.groupproject.post_api.exception.*;

import java.io.IOException;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/post")
@Tag(name = "Posts", description = "Posts API")
@CrossOrigin
public class PostController {

    private final PostRepository repository;
    private final LocationRepository locationRepository;

    // Image storage
    private final StorageService documentStorage;

    public PostController(PostRepository repository, LocationRepository locationRepository,
            StorageService documentStorage) {
        this.repository = repository;
        this.locationRepository = locationRepository;
        this.documentStorage = documentStorage;
    }

    @GetMapping
    public List<Post> all() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = "multipart/form-data", produces = "application/json")
    public ResponseEntity<Post> create(
            @RequestParam("title") @NotBlank(message = "a title is required") String title,
            @RequestParam("content") @NotBlank(message = "content is required") String content,
            @RequestParam("type") PostType type,
            @RequestParam("locationTitle") String locationTitle,
            @RequestParam("poster") @Positive(message = "user id of poster must be positive") Long poster,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        // Create Location
        Location location = new Location();
        location.setTitle(locationTitle);
        locationRepository.save(location);

        // Create Post
        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setType(type);
        post.setLocation(location);
        post.setPoster(poster);

        // Handle image if present
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl;
            try {
                imageUrl = documentStorage.saveFile(imageFile);
            } catch (IOException e) {
                throw new FileStorageException(imageFile.getOriginalFilename(), e);
            }
            post.setImageUrl(imageUrl);
        }

        Post saved = repository.save(post);
        return ResponseEntity.created(URI.create("/api/posts/" + saved.getId())).body(saved);
    }
}
