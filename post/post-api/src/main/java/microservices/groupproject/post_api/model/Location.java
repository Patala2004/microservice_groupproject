package microservices.groupproject.post_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Data
@AttributeOverrides({
    @AttributeOverride(name = "title", column = @Column(name = "location_title"))
})
public class Location {

    @NotBlank(message = "a title is required")
    private String title;
}
