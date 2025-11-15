package group5.ms.tongji.recommendation.domain;

import java.util.Map;

public class InteractionTypesWeights {

    public static final Map<InteractionTypes, Float> WEIGHTS = Map.of(
            InteractionTypes.CLICK, 0.15f,
            InteractionTypes.POST, 0.30f,
            InteractionTypes.JOIN, 0.40f,
            InteractionTypes.SEARCH, 0.40f
    );
}
