package microservices.groupproject.post_api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
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

    private String address;

    private Integer latitude;
    private Integer longitude;

    @AssertTrue(message = "Both latitude and longitude must be set or both empty")
    @JsonIgnore
    public boolean isCoordinatesValid() {
        return (latitude != null && longitude != null) || (latitude == null && longitude == null);
    }
}
