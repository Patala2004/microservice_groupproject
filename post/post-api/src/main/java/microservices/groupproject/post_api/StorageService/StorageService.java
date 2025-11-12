package microservices.groupproject.post_api.StorageService;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface StorageService {
    String saveFile(MultipartFile file) throws IOException; // saves the file and returns its path or URL
    void deleteFile(String filePath) throws IOException;    // optional: delete file
}