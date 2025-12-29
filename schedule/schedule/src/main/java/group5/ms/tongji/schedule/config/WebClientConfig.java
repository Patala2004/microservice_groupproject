package group5.ms.tongji.schedule.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean(name = "postClient")
    public WebClient postClient(WebClient.Builder builder) {
        return builder
                .baseUrl("http://host.docker.internal:8082")
                .build();
    }

    @Bean(name = "tongjiClient")
    public WebClient tongjiClient(WebClient.Builder builder) {
        return builder
                .baseUrl("https://api.tongji.edu.cn")
                .build();
    }

    @Bean(name = "userSchedClient")
    public WebClient userClient(WebClient.Builder builder) {
        return builder
                .baseUrl("https://host.docker.internal:8081")
                .build();
    }

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}
