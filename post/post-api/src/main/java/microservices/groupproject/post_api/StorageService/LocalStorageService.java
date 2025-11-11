package microservices.groupproject.post_api.StorageService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class LocalStorageService implements StorageService {

    private final Path uploadDir = Paths.get("uploads"); // folder to store files

    public LocalStorageService() throws IOException {
        // Ensure the folder exists
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
    }

    @Override
    public String saveFile(MultipartFile file) throws IOException {
        // Create a unique filename to avoid conflicts
        String originalFilename = file.getOriginalFilename();
        String filename = System.currentTimeMillis() + "_" + originalFilename;

        Path destination = uploadDir.resolve(filename);

        // Save the file
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        // Return relative path (or you could return a URL if serving via web server)
        return "/uploads/" + filename;
    }

    @Override
    public void deleteFile(String filePath) throws IOException {
        Path path = uploadDir.resolve(Paths.get(filePath).getFileName());
        Files.deleteIfExists(path);
    }
}
