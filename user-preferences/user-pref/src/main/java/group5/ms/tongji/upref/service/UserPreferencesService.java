package group5.ms.tongji.upref.service;

import group5.ms.tongji.upref.domain.InteractionTypes;
import group5.ms.tongji.upref.domain.InteractionTypesWeights;
import group5.ms.tongji.upref.model.primary.UserDecayDate;
import group5.ms.tongji.upref.model.primary.UserFrequentTag;
import group5.ms.tongji.upref.model.primary.UserTagKey;
import group5.ms.tongji.upref.repository.posttag.PostTagRepository;
import group5.ms.tongji.upref.repository.primary.UserTagsRepository;
import group5.ms.tongji.upref.repository.primary.UserDecayDateRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Service
@AllArgsConstructor
public class UserPreferencesService {

    private UserTagsRepository userTagsRepository;

    private UserDecayDateRepository userDecayDateRepository;

    private PostTagRepository postTagRepository;

    public void updateRecommendations(int userId, int itemId, Date timestamp, InteractionTypes iteractionType) {
        HashMap<Integer, UserFrequentTag> userFrequentTags = obtainUserFrequentTagInfo(userId);
        List<Integer> tags = postTagRepository.findAllTagIds(itemId);
        decayAll(userId, userFrequentTags, timestamp);
        for(Integer tag : tags) {
            if(!userFrequentTags.containsKey(tag)) {
                UserTagKey userTag = new UserTagKey(userId, tag);
                UserFrequentTag newFrequentTag = new UserFrequentTag(userTag, 0.1f, timestamp);
                userFrequentTags.put(tag, newFrequentTag);
            }
            UserFrequentTag userFrequentTag = userFrequentTags.get(tag);
            updateWeight(userFrequentTag, iteractionType);
            userFrequentTag.setTimestamp(timestamp);
        }
        userTagsRepository.saveAll(userFrequentTags.values());
    }

    private void updateWeight(UserFrequentTag u, InteractionTypes iteractionType) {
        float impact = 1 / (1 + u.getWeight());
        float typeWeight = InteractionTypesWeights.WEIGHTS.get(iteractionType);
        u.setWeight(u.getWeight()+impact*typeWeight);
    }

    private void decayAll(int userId, HashMap<Integer, UserFrequentTag> userFrequentTags, Date timestamp) {
        Date decayDate = userDecayDateRepository.findDecayDateById(userId);
        if(decayDate == null) {
            userDecayDateRepository.save(new UserDecayDate(userId, timestamp));
        }
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
        userDecayDateRepository.updateDecayDate(userId, timestamp);
    }

    private HashMap<Integer, UserFrequentTag> obtainUserFrequentTagInfo(int userId) {
        List<UserFrequentTag> userFrequentTags = userTagsRepository.findByUserTag_UserId(userId);
        HashMap<Integer, UserFrequentTag> tagWeight = new HashMap<>();
        for(UserFrequentTag u : userFrequentTags) {
            tagWeight.put(u.getUserTag().getTagId(), u);
        }
        return tagWeight;
    }

    public List<UserFrequentTag> getUserFrequentTags(int userId) {
        return userTagsRepository.findByUserTag_UserId(userId);
    }


}
