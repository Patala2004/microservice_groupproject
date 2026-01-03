package group5.ms.tongji.upref.service;

import group5.ms.tongji.upref.domain.InteractionTypes;
import group5.ms.tongji.upref.dto.FrequentTag;
import group5.ms.tongji.upref.exceptions.AlreadyExistsException;
import group5.ms.tongji.upref.exceptions.NotFoundException;
import group5.ms.tongji.upref.model.primary.UserDecayDate;
import group5.ms.tongji.upref.model.primary.UserFrequentTag;
import group5.ms.tongji.upref.model.primary.UserTagKey;
import group5.ms.tongji.upref.repository.posttag.PostTagRepository;
import group5.ms.tongji.upref.repository.primary.UserTagsRepository;
import group5.ms.tongji.upref.repository.primary.UserDecayDateRepository;
import group5.ms.tongji.upref.service.decay.DecayCalculator;
import group5.ms.tongji.upref.service.weight.WeightCalculator;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Service
@AllArgsConstructor
public class UserPreferencesService {

    private final UserTagsRepository userTagsRepository;

    private final UserDecayDateRepository userDecayDateRepository;

    private final PostTagRepository postTagRepository;
    @Autowired
    @Qualifier("Basic")
    private final DecayCalculator basicDecayCalculator;

    @Autowired
    @Qualifier("BasicWeightCalculator")
    private final WeightCalculator basicWeightCalculator;

    public void updateRecommendations(int userId, int itemId, Date timestamp, InteractionTypes interactionType) {
        HashMap<Integer, UserFrequentTag> userFrequentTags = obtainUserFrequentTagInfo(userId);
        List<Integer> tags = postTagRepository.findAllTagIds(itemId);
        decayAll(userId, userFrequentTags, timestamp);
        basicWeightCalculator.computeWeights(userId, tags, userFrequentTags, timestamp, interactionType);
        userTagsRepository.saveAll(userFrequentTags.values());
    }

    private void decayAll(int userId, HashMap<Integer, UserFrequentTag> userFrequentTags, Date timestamp) {
        Date decayDate = userDecayDateRepository.findDecayDateById(userId);
        if(decayDate == null) {
            userDecayDateRepository.save(new UserDecayDate(userId, timestamp));
            decayDate = timestamp;
        }
        basicDecayCalculator.decayAll(userFrequentTags, timestamp, decayDate);
        userDecayDateRepository.updateDecayDate(userId, timestamp);
    }

    private HashMap<Integer, UserFrequentTag> obtainUserFrequentTagInfo(int userId) {
        List<UserFrequentTag> userFrequentTags = userTagsRepository.findByUserTag_UserId(userId);
        if(userFrequentTags.isEmpty())
            throw new NotFoundException("existing tags or user", userId);
        HashMap<Integer, UserFrequentTag> tagWeight = new HashMap<>();
        for(UserFrequentTag u : userFrequentTags) {
            tagWeight.put(u.getUserTag().getTagId(), u);
        }
        return tagWeight;
    }

    public List<FrequentTag> getUserFrequentTags(int userId) {
        List<UserFrequentTag> userFrequentTags =  userTagsRepository.findByUserTag_UserId(userId);
        List<FrequentTag> tags = new ArrayList<>();
        for(UserFrequentTag u : userFrequentTags){
            tags.add(new FrequentTag(u.getUserTag().getTagId(), u.getWeight()));
        }
        return tags;
    }


    public void initializeRecommendations(int userId, int[] tags, Date timestamp) {
        List<UserFrequentTag> userFrequentTags = new ArrayList<>();
        if(!userTagsRepository.findByUserTag_UserId(userId).isEmpty())
            throw new AlreadyExistsException("User", userId);
        for(Integer tag : tags) {
            UserTagKey userTag = new UserTagKey(userId, tag);
            UserFrequentTag newFrequentTag = new UserFrequentTag(userTag, 0.5f, timestamp);
            userFrequentTags.add(newFrequentTag);
        }
        userTagsRepository.saveAll(userFrequentTags);
    }

    @Transactional
    public void deleteUser(Integer userId) {
        long deletedRows = userTagsRepository.deleteByUserTag_UserId(userId);
        if(deletedRows == 0)
            throw new EntityNotFoundException("User with id "+userId+" not found.");
        deletedRows = userDecayDateRepository.deleteByUserId(userId);
        if(deletedRows == 0)
            throw new EntityNotFoundException("User with id "+userId+" not found.");
    }
}
