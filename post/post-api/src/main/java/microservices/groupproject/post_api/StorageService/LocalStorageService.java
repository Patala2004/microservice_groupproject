package microservices.groupproject.post_api.StorageService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import microservices.groupproject.post_api.exception.FileStorageException;

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
    public String saveFile(MultipartFile file) {
        // Create a unique filename to avoid conflicts
        String originalFilename = file.getOriginalFilename();
        String filename = System.currentTimeMillis() + "_" + originalFilename;

        Path destination = uploadDir.resolve(filename);

        // Save the file
        try{
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch(IOException e){
            throw new FileStorageException(originalFilename, e);
        }

        return "/uploads/" + filename;
    }

    @Override
    public void deleteFile(String filePath) {
        Path path = uploadDir.resolve(Paths.get(filePath).getFileName());

        try{
            Files.deleteIfExists(path);
        } catch (IOException e){
            throw new FileStorageException(Paths.get(filePath).getFileName().toString(), e);
        }
    }
}
