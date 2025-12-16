package group5.ms.tongji.upref.config;

import group5.ms.tongji.upref.exceptions.InteractionTypeException;
import group5.ms.tongji.upref.exceptions.NotFoundException;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BrokerQueueConfig {
    @Bean
    public Queue interQueue() {
        return new Queue("inter.queue", true);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory,
            Jackson2JsonMessageConverter messageConverter) {

        SimpleRabbitListenerContainerFactory factory =
                new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter);

        factory.setErrorHandler(t -> {
            Throwable cause = t.getCause();

            if (cause instanceof org.springframework.messaging.converter.MessageConversionException ||
                    cause instanceof com.fasterxml.jackson.databind.JsonMappingException ||
                    cause instanceof InteractionTypeException ||
                    cause instanceof IllegalArgumentException ||
                    cause instanceof NotFoundException
                    ) {
                System.err.println("Invalid message detected: discarded");
                throw new AmqpRejectAndDontRequeueException("Invalid message", cause);
            }

            // ⚠️ Otros errores → se reintenta (red, broker, etc.)
            System.err.println("Temporary error: retry");
            throw new RuntimeException(cause);
        });
        return factory;
    }
}
