package microservices.groupproject.post_api.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import microservices.groupproject.post_api.StorageService.StorageService;
import microservices.groupproject.post_api.model.*;
import microservices.groupproject.post_api.repository.LocationRepository;
import microservices.groupproject.post_api.service.ExternalRecomendationServiceClient;
import microservices.groupproject.post_api.service.PostService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import microservices.groupproject.post_api.exception.*;

import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/post")
@Tag(name = "Posts", description = "Posts API")
public class PostController {

    private final PostService service;
    private final LocationRepository locationRepository;

    // Image storage
    private final StorageService documentStorage;

    // External services
    private final ExternalRecomendationServiceClient externalRecomClient;

    public PostController(PostService service, LocationRepository locationRepository,
            StorageService documentStorage, ExternalRecomendationServiceClient externalRecomClient) {
        this.service = service;
        this.locationRepository = locationRepository;
        this.documentStorage = documentStorage;
        this.externalRecomClient = externalRecomClient;
    }

    @GetMapping
    public List<Post> all(
        @RequestParam(required = false) String titleStartsWith,
        @RequestParam(required = false) String titleContains,
        @RequestParam(required = false) String contentContains,
        @RequestParam(required = false) PostType type,
        @RequestParam(required = false) String locationTitle,
        @RequestParam(required = false) LocalDateTime beforeCreationDateStamp,
        @RequestParam(required = false) LocalDateTime afterCreationDateStamp,
        @RequestParam(required = false) LocalDateTime beforeEventDateStamp,
        @RequestParam(required = false) LocalDateTime afterEventDateStamp,
        @RequestParam(required = false) Long posterId,
        @RequestParam(required = false) Long participantId
    ) {
        return service.getAllPosts(titleStartsWith, titleContains, contentContains, type, locationTitle, 
        afterCreationDateStamp, beforeCreationDateStamp, afterEventDateStamp, beforeEventDateStamp, posterId,
        participantId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPostById(id));
    }

    // In case schedule endpoints wants a boolean "is occupied" endpoint
    // @GetMapping("/userIsOcupied")
    // public boolean userIsOcupied(
    //     @RequestParam Long userId,
    //     @RequestParam LocalDateTime beforeEventDateStamp,
    //     @RequestParam(required = false) LocalDateTime afterEventDateStamp
    // ) {
    //     List<Post> posts = service.getAllPosts(null, null, null, null, null, null, null, afterEventDateStamp, beforeEventDateStamp, null, userId);
    //     if(posts != null && !posts.isEmpty()) return true;
    //     return false;
    // }

    @PostMapping(consumes = "multipart/form-data", produces = "application/json")
    public ResponseEntity<Post> create(
            @RequestParam("title") @NotBlank(message = "a title is required") String title,
            @RequestParam("content") @NotBlank(message = "content is required") String content,
            @RequestParam("type") PostType type,
            @RequestParam("locationTitle") String locationTitle,
            @RequestParam("poster") @Positive(message = "user id of poster must be positive") Long poster,
            @RequestParam(value = "eventTime", required = false) LocalDateTime eventTime,
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
        post.setEventTime(eventTime);

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

        Post saved = service.createPost(post);
        return ResponseEntity.created(URI.create("/api/posts/" + saved.getId())).body(saved);
    }

    @GetMapping("/recomendations")
    public ResponseEntity<List<Post>> getUserRecomendedPosts(
        @RequestParam(required = false) int userId
    ) {
        UserRecomResponse externalResponse = externalRecomClient.getUserRecom(userId);
        List<Integer> postIds = externalResponse.getPostIds();

        List<Post> postList = service.getPostList(postIds.stream().map(Integer::longValue).toList());

        return ResponseEntity.ok(postList);
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<String> joinPostEvent(
        @PathVariable Long id,
        @RequestParam Long userId) {

        boolean joined = service.joinEvent(id, userId);
        
        String message = joined? "Succesfully joined the event" : "User is already signed up for the event";

        return ResponseEntity.ok(message);
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<String> leavePostEvent(
        @PathVariable Long id,
        @RequestParam Long userId) {

        boolean left = service.leaveEvent(id, userId);
        
        if(left){
            return ResponseEntity.ok("Succesfully left the event");
        } else{
            return ResponseEntity.badRequest().body("User wasn't included in the event list");
        }
    }
    
}
