package microservices.groupproject.post_api.model;

import java.util.List;

import lombok.Data;

@Data
public class UserRecomResponse {
    private List<Integer> postIds;
    // private int total;
}
