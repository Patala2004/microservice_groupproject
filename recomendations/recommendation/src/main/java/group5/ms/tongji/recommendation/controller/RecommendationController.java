package group5.ms.tongji.recommendation.controller;

import group5.ms.tongji.recommendation.dto.ErrorResponse;
import group5.ms.tongji.recommendation.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("recom/")
@Tag(name = "Recommendation", description = "Recommendation API")
@AllArgsConstructor
public class RecommendationController {

    private RecommendationService recommendationService;

    @Operation(summary = "Get recommended posts for user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Post succesfully obtained",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(type = "integer"))
                    )),
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )),
            @ApiResponse(responseCode = "502", description = "Posts service unavailable ",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
            ))

    })

    @GetMapping("{userId}")
    public int[] getRecommendedItems(@PathVariable int userId, @RequestParam(defaultValue = "10") int limit) {
        return recommendationService.getRecommendedItems(userId, limit);
    }



}
