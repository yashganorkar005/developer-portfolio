package com.portfolio.backend.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class StorageUtilTest {

    @TempDir
    Path tempDir;

    private StorageUtil storageUtil;

    @BeforeEach
    void setUp() throws IOException {
        storageUtil = new StorageUtil(tempDir.toString());
    }

    @Test
    void storeImage_withValidPng_savesSuccessfully() throws IOException {
        // PNG magic bytes: 89 50 4E 47
        byte[] validPng = new byte[]{(byte) 0x89, (byte) 0x50, (byte) 0x4E, (byte) 0x47, 0, 0, 0, 0};
        MockMultipartFile file = new MockMultipartFile(
                "file", "avatar.png", "image/png", validPng
        );

        String path = storageUtil.storeImage(file);

        assertNotNull(path);
        assertTrue(path.startsWith("/api/media/"));
        assertTrue(path.endsWith(".png"));

        Path resolved = storageUtil.resolveMedia(path);
        assertTrue(resolved.toFile().exists());
    }

    @Test
    void storeImage_withInvalidMagicBytes_throwsIllegalArgumentException() {
        // Plain text content disguised as image/png
        byte[] fakePng = "NOT_A_REAL_PNG".getBytes();
        MockMultipartFile file = new MockMultipartFile(
                "file", "fake.png", "image/png", fakePng
        );

        assertThrows(IllegalArgumentException.class, () -> storageUtil.storeImage(file));
    }

    @Test
    void storeImage_exceedingSizeLimit_throwsIllegalArgumentException() {
        byte[] oversized = new byte[6 * 1024 * 1024]; // 6MB > 5MB
        MockMultipartFile file = new MockMultipartFile(
                "file", "large.png", "image/png", oversized
        );

        assertThrows(IllegalArgumentException.class, () -> storageUtil.storeImage(file));
    }

    @Test
    void resolveMedia_withPathTraversal_throwsIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, () -> storageUtil.resolveMedia("/api/media/../../etc/passwd"));
    }
}
