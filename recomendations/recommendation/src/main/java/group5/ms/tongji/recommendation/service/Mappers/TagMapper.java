package group5.ms.tongji.recommendation.service.Mappers;

import group5.ms.tongji.recommendation.dto.FrequentTag;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@AllArgsConstructor
@Component
public class TagMapper {
    public HashMap<Integer, Float> toWeightMap(FrequentTag[] tags) {
            HashMap<Integer, Float> map = new HashMap<>();
        for (FrequentTag t : tags) {
            map.put(t.getTagId(), t.getWeight());
        }
        return map;
    }
}
