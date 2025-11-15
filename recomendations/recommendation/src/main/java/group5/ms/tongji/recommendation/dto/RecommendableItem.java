package group5.ms.tongji.recommendation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class RecommendableItem {

    private int id;

    private int[] tags;

    private String type;

}
