package group5.ms.tongji.upref.controller;

import group5.ms.tongji.upref.domain.InteractionTypes;
import group5.ms.tongji.upref.dto.ErrorResponse;
import group5.ms.tongji.upref.dto.FrequentTag;
import group5.ms.tongji.upref.dto.UserInteraction;
import group5.ms.tongji.upref.dto.UserRegisterTags;
import group5.ms.tongji.upref.exceptions.InteractionTypeException;
import group5.ms.tongji.upref.exceptions.NotFoundException;
import group5.ms.tongji.upref.model.primary.UserFrequentTag;
import group5.ms.tongji.upref.service.UserPreferencesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("upref")
@Tag(name = "User Preferences", description = "User Preferences API")
@AllArgsConstructor
public class UserPreferencesController {

    private UserPreferencesService userPreferencesService;
    


    @RabbitListener(queues = "inter.queue")
    public void receive(UserInteraction interaction){
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

    @Operation(summary = "Get user frequent tags")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tags found",
                    content = @Content(
                        mediaType = "application/json",
                        array = @ArraySchema(schema = @Schema(implementation = FrequentTag.class))
            )),
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(implementation = ErrorResponse.class)
            ))
    })
    @GetMapping("/{userId}")
    public List<FrequentTag> getUserFrequentTags(@PathVariable int userId) {
        List<FrequentTag> frequents =  userPreferencesService.getUserFrequentTags(userId);
        if(frequents.isEmpty())
            throw new NotFoundException("User", userId);
        return frequents;
    }

    @Operation(summary = "Establish first user frequent tags after registering")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Tags and user succesfully added.")
    })
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void updateUserFrequentTagsRegister(@RequestBody UserRegisterTags uTags) {
        int userId = uTags.getUserId();
        int[] tags = uTags.getTags();
        Date timestamp = uTags.getTimestamp();

        userPreferencesService.initializeRecommendations(userId, tags, timestamp);
    }

    @DeleteMapping("/user/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "User succesfully removed."),
            @ApiResponse(responseCode = "404", description = "User not found.")
    })
    public void deleteUserReferences(@PathVariable Integer userId){
        userPreferencesService.deleteUser(userId);
    }



}
