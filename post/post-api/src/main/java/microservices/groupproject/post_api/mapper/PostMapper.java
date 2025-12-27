package microservices.groupproject.post_api.mapper;

import org.springframework.stereotype.Component;

import microservices.groupproject.post_api.model.Location;
import microservices.groupproject.post_api.model.Post;
import microservices.groupproject.post_api.model.PostType;
import microservices.groupproject.post_api.model.DTO.PostActivityDTO;
import microservices.groupproject.post_api.model.DTO.PostGlobalDTO;
import microservices.groupproject.post_api.model.DTO.PostSellBuyDTO;

@Component
public class PostMapper {
    public Post toEntity(PostGlobalDTO dto) {
        Post post = new Post();
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setPoster(dto.getPoster());
        post.setType(dto.getType());
        post.setLocation(mapLocation(dto.getLocation()));

        if (dto instanceof PostActivityDTO activityDTO) {
            post.setEventTime(activityDTO.getEventTime());
            post.setJoinedUsers(activityDTO.getJoinedUsers());
        }

        return post;
    }

    public PostGlobalDTO toDTO(Post post) {
        PostGlobalDTO dto;
        if (post.getType() == PostType.ACTIVITY) {
            PostActivityDTO activityDTO = new PostActivityDTO();
            activityDTO.setEventTime(post.getEventTime());
            activityDTO.setJoinedUsers(post.getJoinedUsers());
            dto = activityDTO;
        } else if (post.getType() == PostType.SELL || post.getType() == PostType.BUY) {
            dto = new PostSellBuyDTO();
        } else {
            dto = new PostGlobalDTO();
        }

        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setPoster(post.getPoster());
        dto.setType(post.getType());
        dto.setLocation(post.getLocation());
        dto.setImageUrl(post.getImageUrl());
        dto.setCreationTime(post.getCreationTime());

        return dto;
    }

    private Location mapLocation(Location location) {
        return location;
    }
}
