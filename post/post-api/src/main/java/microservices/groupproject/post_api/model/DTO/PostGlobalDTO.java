package microservices.groupproject.post_api.model.DTO;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import microservices.groupproject.post_api.model.PostType;
import microservices.groupproject.post_api.model.Location;

@Data
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type",
    visible = true
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = PostActivityDTO.class, name = "ACTIVITY"),
    @JsonSubTypes.Type(value = PostSellBuyDTO.class, name = "SELL"),
    @JsonSubTypes.Type(value = PostSellBuyDTO.class, name = "BUY")
})
public class PostGlobalDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    @NotBlank
    private String title;
    @NotBlank
    private String content;
    @NotNull
    private PostType type;
    private Location location;
    @NotNull
    @Positive
    private Long poster;
    private String imageUrl;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime creationTime;
}
