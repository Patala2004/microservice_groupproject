package microservices.groupproject.post_api.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import microservices.groupproject.post_api.StorageService.StorageService;
import microservices.groupproject.post_api.model.*;
import microservices.groupproject.post_api.model.DTO.PostGlobalDTO;
import microservices.groupproject.post_api.service.ExternalNotificationServiceClient;
import microservices.groupproject.post_api.service.ExternalRecomendationServiceClient;
import microservices.groupproject.post_api.service.PostService;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import microservices.groupproject.post_api.exception.*;
import microservices.groupproject.post_api.mapper.PostMapper;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;



@RestController
@RequestMapping("/post")
@Tag(name = "Posts", description = "Posts API")
public class PostController {

    private final PostMapper postMapper;

    private final PostService service;

    // Image storage
    private final StorageService documentStorage;

    // External services
    private final ExternalRecomendationServiceClient externalRecomClient;
    private final ExternalNotificationServiceClient externalNotifClient;

    public PostController(PostService service, StorageService documentStorage, 
            ExternalRecomendationServiceClient externalRecomClient,
            ExternalNotificationServiceClient externalNotifClient, PostMapper postMapper) {
        this.service = service;
        this.documentStorage = documentStorage;
        this.externalRecomClient = externalRecomClient;
        this.externalNotifClient = externalNotifClient;
        this.postMapper = postMapper;
    }

    @GetMapping
    public List<PostGlobalDTO> all(
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
        @RequestParam(required = false) Long participantId,
        @ParameterObject
        @PageableDefault(
            size = 20,
            page = 0,
            sort = "creationTime",
            direction = Sort.Direction.DESC
        ) Pageable pageable
    ) {
        return service.getAllPosts(titleStartsWith, titleContains, contentContains, type, locationTitle, 
        afterCreationDateStamp, beforeCreationDateStamp, afterEventDateStamp, beforeEventDateStamp, posterId,
        participantId, pageable).map(postMapper::toDTO).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostGlobalDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(postMapper.toDTO(service.getPostById(id)));
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

    @PostMapping
    public ResponseEntity<PostGlobalDTO> create(@Valid @RequestBody PostGlobalDTO dto) {

        Post post = postMapper.toEntity(dto);

        Post saved = service.createPost(post);

        PostGlobalDTO returnDTO = postMapper.toDTO(saved);
        return ResponseEntity.created(URI.create("/api/posts/" + saved.getId())).body(returnDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostGlobalDTO> editPostInfo(
            @PathVariable Long id,
            @Valid @RequestBody PostGlobalDTO post) {

        Post saved = service.updatePost(id, postMapper.toEntity(post));
        return ResponseEntity.ok(postMapper.toDTO(saved));
    }

    @PutMapping(value = "/{id}/image", 
            consumes = "multipart/form-data", produces = "application/json")
    public ResponseEntity<PostGlobalDTO> editPostImage(
        @PathVariable Long id, 
        @RequestPart(value = "image") MultipartFile imageFile) {

        if (imageFile == null || imageFile.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        
        Post post = service.getPostById(id);
        
        if(post.getImageUrl() != null){
            documentStorage.deleteFile(post.getImageUrl());
        }

        String imageUrl;

        try{
            imageUrl = documentStorage.saveFile(imageFile);
        } catch (FileStorageException e){
            // If there's an error after deletion of image -> Dont save url of prev image
            service.updatePostImage(id, null);
            throw new FileStorageException(imageFile.getOriginalFilename(), e);
        }

        post = service.updatePostImage(id, imageUrl);

        return ResponseEntity.ok(postMapper.toDTO(post));
    }

    @DeleteMapping("/{id}/image")
    public ResponseEntity<Void> deletePostImage(@PathVariable Long id ) {
        Post post = service.getPostById(id);

        if(post.getImageUrl() != null){
            documentStorage.deleteFile(post.getImageUrl());
            service.updatePostImage(id, null);
        }

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        Post post = service.getPostById(id);
        if(post.getImageUrl() != null){
            documentStorage.deleteFile(post.getImageUrl());
        }
        service.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/recomendations")
    public ResponseEntity<List<PostGlobalDTO>> getUserRecomendedPosts(
        @RequestParam(required = true) int userId,
        @RequestParam(required = false, defaultValue = "10") int limit
    ) {
        List<Integer> postIds = externalRecomClient.getUserRecom(userId, limit);

        List<PostGlobalDTO> postList = new ArrayList<>(service.getPostList(postIds.stream().map(Integer::longValue).toList())
        .stream()
        .map(postMapper::toDTO)
        .toList());

        if(postIds.size() < limit){ // If there are less usefull posts than asked for get the newest ones and add them
            List<PostGlobalDTO> otherPosts = service.getPostByIdNotOrderedByCreationTime(
                postIds.stream().map(Integer::longValue).toList(),
                limit - postIds.size())
            .stream()
            .map(postMapper::toDTO)
            .toList();

            postList.addAll(otherPosts);
        }

        return ResponseEntity.ok(postList);
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<String> joinPostEvent(
        @PathVariable Long id,
        @RequestParam Long userId) {

        boolean joined = service.joinEvent(id, userId);
        
        String message = joined? "Succesfully joined the event" : "User is already signed up for the event";

        // send notification to poster
        Post event = service.getPostById(id);
        Long poster = event.getPoster();
        final String NOTIF_MESSAGE = "A new user has joined your event \"" + event.getTitle() + "\". Enter the App to see who it is!"; 
        externalNotifClient.sendWechatNotification(poster, NOTIF_MESSAGE)
        .subscribe(
            null,
            ex -> System.out.println("Error sending notification:\n" + ex.getMessage())
        );

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
