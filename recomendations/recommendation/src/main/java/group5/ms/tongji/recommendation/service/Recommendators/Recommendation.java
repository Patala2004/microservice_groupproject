package group5.ms.tongji.recommendation.service.Recommendators;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class Recommendation implements Comparable<Recommendation> {

    private int recommendedId;
    private float weight;

    @Override
    public int compareTo(Recommendation r) {
        return Float.compare(weight, r.weight);
    }
}