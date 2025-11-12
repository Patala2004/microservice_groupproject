package group5.ms.tongji.recommendation.service;

import group5.ms.tongji.recommendation.model.UserFrequentTags;
import group5.ms.tongji.recommendation.repository.RecommendationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Service
@AllArgsConstructor
public class RecommendationService {

    private RecommendationRepository recommendationRepository;

    public void updateRecommendation(int userId, int[] tags, Date timestamp) {
        //buscar en la base datos al usuario y recoger sus tags y pesos
        List<UserFrequentTags> userFrequentTags = recommendationRepository.findByUserId(userId);
        HashMap<Integer,Float> tagWeight = new HashMap<>();
        //añadir nuevos tags y actualizar los que ya estaban
        //actualizar el resto con degradación
    }

    public int[] getRecommendedPosts(int userId, int limit) {
        //se recogen las tags buscadas por el usuario
        //se hace la request a POST para obtener las tags de los posts
        //se itera por los posts y se devuelven los limit más concordantes
        return null;
    }
}
