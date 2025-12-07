package microservices.groupproject.post_api.exception;

public class PostNotFoundException extends RuntimeException{
    public PostNotFoundException(Long id) {
        super("Post with the id '" + id + "' not found");
    }
}