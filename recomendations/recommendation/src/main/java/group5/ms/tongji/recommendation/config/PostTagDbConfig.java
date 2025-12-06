package group5.ms.tongji.recommendation.config;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "group5.ms.tongji.recommendation.repository.posttag",
        entityManagerFactoryRef = "postTagEntityManagerFactory",
        transactionManagerRef = "postTagTransactionManager"
)
public class PostTagDbConfig {
    @Bean
    @ConfigurationProperties("spring.datasource.posttag")
    public DataSource postTagDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "postTagEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean posttagEntityManagerFactory(
            EntityManagerFactoryBuilder builder) {
        return builder
                .dataSource(postTagDataSource())
                .packages("group5.ms.tongji.recommendation.model.posttag")
                .build();
    }

    @Bean(name = "postTagTransactionManager")
    public PlatformTransactionManager postTagTransactionManager(
            @Qualifier("postTagEntityManagerFactory") EntityManagerFactory emf) {

        return new JpaTransactionManager(emf);
    }
}
