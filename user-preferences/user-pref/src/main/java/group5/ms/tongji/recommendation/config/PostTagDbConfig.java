package group5.ms.tongji.recommendation.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "group5.ms.tongji.recommendation.repository.posttag",
        entityManagerFactoryRef = "postTagEntityManagerFactory",
        transactionManagerRef = "`postTagTransactionManager"
)
public class PostTagDbConfig {
    @Bean
    @ConfigurationProperties("spring.datasource.posttag")
    public DataSource postTagDataSource() {
        return DataSourceBuilder.create().build();
    }
}
