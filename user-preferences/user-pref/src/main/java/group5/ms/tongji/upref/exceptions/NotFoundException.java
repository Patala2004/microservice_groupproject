package group5.ms.tongji.upref.exceptions;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String resource, int id) {
        super(resource + " with id " + id + " not found");
    }
}
