package com.portfolio.backend.util;

import com.portfolio.backend.service.CloudinaryStorageService;
import com.portfolio.backend.service.MediaCleanupService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StorageUtilTest {

    @TempDir
    Path tempDir;

    private CloudinaryStorageService cloudinary;
    private MediaCleanupService cleanup;
    private StorageUtil storageUtil;

    @BeforeEach
    void setUp() {
        cloudinary = mock(CloudinaryStorageService.class);
        cleanup = mock(MediaCleanupService.class);
        storageUtil = new StorageUtil(
            tempDir.toString(), cloudinary, cleanup
        );
    }

    @Test
    void uploadsValidPngToCloudinaryAndSchedulesCleanup() throws Exception {
        byte[] png = {
            (byte) 0x89, 'P', 'N', 'G', 0, 0, 0, 0
        };

        MockMultipartFile file = new MockMultipartFile(
            "file", "avatar.png", "image/png", png
        );

        String previousUrl =
            "https://res.cloudinary.com/demo/image/upload/portfolio/images/old.png";
        String newUrl =
            "https://res.cloudinary.com/demo/image/upload/portfolio/images/new.png";

        when(cloudinary.uploadImage(file)).thenReturn(newUrl);

        assertEquals(newUrl, storageUtil.storeImage(file, previousUrl));

        verify(cloudinary).uploadImage(file);
        verify(cleanup).scheduleCandidate(previousUrl);
        verify(cleanup).scheduleCandidate(newUrl);
    }

    @Test
    void rejectsEmptyFile() {
        MockMultipartFile file = new MockMultipartFile(
            "file", "empty.png", "image/png", new byte[0]
        );

        assertThrows(
            IllegalArgumentException.class,
            () -> storageUtil.storeImage(file, null)
        );

        verifyNoInteractions(cloudinary, cleanup);
    }

    @Test
    void rejectsUnsupportedContentType() {
        MockMultipartFile file = new MockMultipartFile(
            "file", "notes.txt", "text/plain",
            new byte[] { 1, 2, 3, 4 }
        );

        assertThrows(
            IllegalArgumentException.class,
            () -> storageUtil.storeImage(file, null)
        );

        verifyNoInteractions(cloudinary, cleanup);
    }

    @Test
    void rejectsInvalidImageContent() {
        MockMultipartFile file = new MockMultipartFile(
            "file", "fake.png", "image/png",
            new byte[] { 1, 2, 3, 4, 5, 6 }
        );

        assertThrows(
            IllegalArgumentException.class,
            () -> storageUtil.storeImage(file, null)
        );

        verifyNoInteractions(cloudinary, cleanup);
    }

    @Test
    void rejectsFilesOverFiveMegabytes() {
        byte[] oversized = new byte[5 * 1024 * 1024 + 1];

        MockMultipartFile file = new MockMultipartFile(
            "file", "large.png", "image/png", oversized
        );

        assertThrows(
            IllegalArgumentException.class,
            () -> storageUtil.storeImage(file, null)
        );

        verifyNoInteractions(cloudinary, cleanup);
    }
}