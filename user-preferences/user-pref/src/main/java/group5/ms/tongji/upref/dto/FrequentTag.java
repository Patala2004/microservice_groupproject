package group5.ms.tongji.upref.dto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;

@Schema(description = "Frequent tag and weight")
@AllArgsConstructor
public class FrequentTag {
    @Schema
    public Integer tagId;

    @Schema()
    public float weight;
}
