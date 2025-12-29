package group5.ms.tongji.upref.service.decay;

import group5.ms.tongji.upref.model.primary.UserFrequentTag;

import java.util.Date;
import java.util.HashMap;

public interface DecayCalculator {
    public void decayAll(HashMap<Integer, UserFrequentTag> userFrequentTags, Date timestamp, Date decayDate);
}
