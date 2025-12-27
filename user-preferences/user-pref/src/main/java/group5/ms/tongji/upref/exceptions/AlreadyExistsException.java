package group5.ms.tongji.upref.exceptions;

public class AlreadyExistsException extends RuntimeException{
    public AlreadyExistsException(String item, int id){
        super(item+" with id "+id+" already exists.");
    }
}
