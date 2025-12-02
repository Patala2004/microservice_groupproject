package group5.ms.tongji.upref.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Error response format")
public class ErrorResponse {
    @Schema
    public String error;

    @Schema()
    public String timestamp;
}
