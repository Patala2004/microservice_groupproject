package group5.ms.tongji.upref.service.decay;

import group5.ms.tongji.upref.model.primary.UserFrequentTag;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;

@AllArgsConstructor
@Component("Basic")
public class BasicDecayCalculator implements DecayCalculator {

    public void decayAll(HashMap<Integer, UserFrequentTag> userFrequentTags, Date timestamp, Date decayDate) {
        for(UserFrequentTag u : userFrequentTags.values()) {
            float forgetRate = -0.0231f; //30 days bajará un 50%
            float timeDiff = (timestamp.getTime() - decayDate.getTime())/(1000f * 60f * 60f * 24f);
            float decay = (float) Math.pow(Math.E, forgetRate*timeDiff);
            float decayedWeight = u.getWeight()*decay;
            if(decayedWeight>0.05f)
                u.setWeight(u.getWeight() * decay);
            else
                u.setWeight(0.05f);
        }
    }
}
