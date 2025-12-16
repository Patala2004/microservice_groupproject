package microservices.groupproject.post_api.model;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Entity
@Table(name = "posts")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "a title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "content is required")
    @Column(length = 10000, nullable = false)
    private String content;

    @Column(nullable = false)
    @NotNull(message = "Post type is required")
    @Enumerated(EnumType.STRING)
    private PostType type;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "location_id", nullable = true)
    private Location location;

    @NotNull
    @Column(nullable = false)
    @Positive(message = "user id of poster must be positive")
    private Long poster; // Userid of poster user

    @ElementCollection
    private List<Long> joinedUsers = new ArrayList<>();

    @Column(length = 500)
    private String imageUrl;

    @Column(updatable = false, nullable = false)
    @CreationTimestamp // Automatically sets it to LocalDateTime.now() on creation
    private LocalDateTime creationTime;

    private LocalDateTime eventTime;
}
