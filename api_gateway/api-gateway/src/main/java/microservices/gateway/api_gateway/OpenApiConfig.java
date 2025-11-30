package microservices.gateway.api_gateway;

import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenApiCustomizer openApiCustomizer() {
        return openApi -> {
            Server server = new Server();
            server.setUrl("/api/v1");
            server.setDescription("Gateway API (v1)");
            openApi.addServersItem(server);
        };
    }
}