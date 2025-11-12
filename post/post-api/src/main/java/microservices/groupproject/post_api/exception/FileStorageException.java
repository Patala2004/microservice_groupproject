package microservices.groupproject.post_api.exception;

public class FileStorageException extends RuntimeException{
    public FileStorageException(String location, Throwable cause){
        super("Failed to store file: "+ location, cause);
    }
}