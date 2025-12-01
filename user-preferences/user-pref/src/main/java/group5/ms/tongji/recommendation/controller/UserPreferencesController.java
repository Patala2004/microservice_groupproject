package group5.ms.tongji.recommendation.controller;

import group5.ms.tongji.recommendation.domain.InteractionTypes;
import group5.ms.tongji.recommendation.dto.ErrorResponse;
import group5.ms.tongji.recommendation.dto.UserInteraction;
import group5.ms.tongji.recommendation.exceptions.InteractionTypeException;
import group5.ms.tongji.recommendation.exceptions.NotFoundException;
import group5.ms.tongji.recommendation.model.UserFrequentTag;
import group5.ms.tongji.recommendation.service.UserPreferencesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("upref/")
@Tag(name = "User Preferences", description = "User Preferences API")
@AllArgsConstructor
public class UserPreferencesController {

    private UserPreferencesService userPreferencesService;

    @Operation(summary = "Get user frequent tags")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tags found",
                    content = @Content(
                        mediaType = "application/json",
                        array = @ArraySchema(schema = @Schema(implementation = UserFrequentTag.class))
            )),
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = ErrorResponse.class)
            ))
    })
    @GetMapping("{userId}")
    public List<UserFrequentTag> getUserFrequentTags(@PathVariable int userId) {
        List<UserFrequentTag> frequents =  userPreferencesService.getUserFrequentTags(userId);
        if(frequents.isEmpty())
            throw new NotFoundException("User", userId);
        return frequents;
    }

    @Operation(summary = "Update user frequent tags")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tags succesfully updated")
    })
    @PostMapping("")
    public void updateUserFrequentTags(@RequestBody UserInteraction interaction) {
        int userId = interaction.getUserId();
        int itemId = interaction.getItemId();
        Date timestamp = interaction.getTimestamp();
        InteractionTypes interactionType = null;
        try{
            interactionType = InteractionTypes.valueOf(interaction.getType().toUpperCase());
        } catch ( IllegalArgumentException e ){
            throw new InteractionTypeException();
        }

        userPreferencesService.updateRecommendations(userId, itemId, timestamp, interactionType);
    }



}
