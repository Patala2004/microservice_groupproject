package microservices.groupproject.post_api.model.DTO;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class PostActivityDTO extends PostGlobalDTO{

    private List<Long> joinedUsers = new ArrayList<>();

    private LocalDateTime eventTime;
}
