package microservices.groupproject.post_api.repository;

import microservices.groupproject.post_api.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Long> {

}
