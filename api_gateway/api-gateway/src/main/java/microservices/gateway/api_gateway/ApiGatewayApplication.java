package microservices.gateway.api_gateway;

import java.io.IOException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingResponseWrapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
    

    @Bean
    public OncePerRequestFilter schemaModificationFilter() {
        return new OncePerRequestFilter() {
            private final ObjectMapper objectMapper = new ObjectMapper();

            @Override
            protected void doFilterInternal(
                    HttpServletRequest request,
                    HttpServletResponse response,
                    FilterChain filterChain) throws ServletException, IOException {

                ContentCachingResponseWrapper wrapped = new ContentCachingResponseWrapper(response);
                filterChain.doFilter(request, wrapped);

                String contentType = response.getContentType();
                byte[] data = wrapped.getContentAsByteArray();

                // Only modify JSON
                if (contentType != null && contentType.contains("application/json")) {
                    try {
                        String body = new String(data);

                        // Only modify OpenAPI-like docs
                        if (body.contains("\"openapi\"")) {

                            JsonNode root = objectMapper.readTree(body);
                            if (root instanceof ObjectNode obj) {

                                ArrayNode servers = objectMapper.createArrayNode();
                                ObjectNode server = objectMapper.createObjectNode();
                                server.put("url", "/api/v1");
                                server.put("description", "Gateway API (v1)");
                                servers.add(server);

                                obj.set("servers", servers);

                                byte[] modified = objectMapper.writeValueAsBytes(obj);

                                wrapped.resetBuffer();
                                wrapped.getOutputStream().write(modified);
                                wrapped.copyBodyToResponse();
                                return;
                            }
                        }

                    } catch (Exception ignored) {
                    }
                }

                // Default behavior
                wrapped.copyBodyToResponse();
            }
        };
    }

}
