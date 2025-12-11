package microservices.groupproject.post_api.StorageService;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String saveFile(MultipartFile file);
    void deleteFile(String filePath);
}