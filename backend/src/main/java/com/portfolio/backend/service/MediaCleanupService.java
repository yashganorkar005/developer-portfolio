package com.portfolio.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;

@Service
public class MediaCleanupService {
    private final JdbcTemplate jdbc;
    private final DataSource dataSource;
    private final CloudinaryStorageService cloudinary;
    private final Path mediaDir;

    public MediaCleanupService(JdbcTemplate jdbc, DataSource dataSource, CloudinaryStorageService cloudinary,
                               @Value("${app.media.storage-dir:./portfolio-media}") String storageDir) {
        this.jdbc = jdbc;
        this.dataSource = dataSource;
        this.cloudinary = cloudinary;
        this.mediaDir = Paths.get(storageDir).toAbsolutePath().normalize();
    }

    public void scheduleCandidate(String url) {
        if (!isManagedUrl(url)) return;
        try {
            jdbc.update("INSERT INTO media_cleanup_queue(asset_url, url_hash, not_before, attempts) VALUES (?, ?, ?, 0) " +
                "ON DUPLICATE KEY UPDATE asset_url=VALUES(asset_url), not_before=VALUES(not_before), last_error=NULL",
                url, sha256(url), Timestamp.from(Instant.now().plus(24, ChronoUnit.HOURS)));
        } catch (Exception e) {
            // Upload succeeds even if the cleanup queue cannot be written; log-free failure is safe.
        }
    }

    public void scheduleCandidateIfAbsent(String url) {
        if (!isManagedUrl(url)) return;
        try {
            jdbc.update("INSERT IGNORE INTO media_cleanup_queue(asset_url, url_hash, not_before, attempts) VALUES (?, ?, ?, 0)",
                url, sha256(url), Timestamp.from(Instant.now().plus(24, ChronoUnit.HOURS)));
        } catch (Exception ignored) {}
    }

    public void cleanupCandidates(List<String> urls) {
        if (urls == null) return;
        for (String url : urls) scheduleCandidate(url);
    }

    private boolean isManagedUrl(String url) {
        return cloudinary.isManagedCloudinaryUrl(url) ||
            (url != null && url.matches("^/api/media/[A-Za-z0-9_-]+\\.(jpg|jpeg|png|webp)$"));
    }

    @Scheduled(fixedDelay = 600000L, initialDelay = 60000L)
    public void processDueCandidates() {
        List<Map<String, Object>> candidates;
        try {
            candidates = jdbc.queryForList("SELECT id, asset_url FROM media_cleanup_queue WHERE not_before <= CURRENT_TIMESTAMP ORDER BY not_before LIMIT 50");
        } catch (Exception e) {
            return;
        }
        for (Map<String, Object> candidate : candidates) {
            long id = ((Number) candidate.get("id")).longValue();
            String url = (String) candidate.get("asset_url");
            try {
                if (isReferenced(url)) {
                    // Keep checking: the URL may be removed from a record later.
                    jdbc.update("UPDATE media_cleanup_queue SET not_before=?, attempts=attempts+1, last_error=NULL WHERE id=?",
                        Timestamp.from(Instant.now().plus(24, ChronoUnit.HOURS)), id);
                    continue;
                }
                if (cloudinary.isManagedCloudinaryUrl(url)) {
                    cloudinary.deleteManagedAsset(url);
                } else {
                    deleteLocalMedia(url);
                }
                jdbc.update("DELETE FROM media_cleanup_queue WHERE id=?", id);
            } catch (Exception e) {
                try {
                    jdbc.update("UPDATE media_cleanup_queue SET not_before=?, attempts=attempts+1, last_error=? WHERE id=?",
                        Timestamp.from(Instant.now().plus(6, ChronoUnit.HOURS)), safeError(e), id);
                } catch (Exception ignored) {}
            }
        }
        // Discover legacy local files. Each gets a 24-hour grace period and is retained while referenced.
        scheduleLocalOrphanCandidates();
    }

    private void scheduleLocalOrphanCandidates() {
        if (!Files.isDirectory(mediaDir)) return;
        try (var files = Files.list(mediaDir)) {
            files.filter(Files::isRegularFile).forEach(path -> scheduleCandidateIfAbsent("/api/media/" + path.getFileName()));
        } catch (Exception ignored) {}
    }

    private void deleteLocalMedia(String url) throws Exception {
        if (url == null || !url.matches("^/api/media/[A-Za-z0-9_-]+\\.(jpg|jpeg|png|webp)$")) return;
        String name = url.substring("/api/media/".length());
        Path path = mediaDir.resolve(name).normalize();
        if (!path.startsWith(mediaDir)) throw new IllegalArgumentException("Invalid local media path");
        Files.deleteIfExists(path);
    }

    private boolean isReferenced(String url) throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData meta = connection.getMetaData();
            String catalog = connection.getCatalog();
            try (ResultSet tables = meta.getTables(catalog, null, "%", new String[]{"TABLE"})) {
                while (tables.next()) {
                    String table = tables.getString("TABLE_NAME");
                    if (table == null || table.equalsIgnoreCase("media_cleanup_queue") || table.equalsIgnoreCase("flyway_schema_history")) continue;
                    String tableCatalog = tables.getString("TABLE_CAT");
                    String tableSchema = tables.getString("TABLE_SCHEM");
                    try (ResultSet columns = meta.getColumns(tableCatalog, tableSchema, table, "%")) {
                        while (columns.next()) {
                            int type = columns.getInt("DATA_TYPE");
                            if (!isTextType(type)) continue;
                            String column = columns.getString("COLUMN_NAME");
                            String sql = "SELECT 1 FROM " + quote(table) + " WHERE LOCATE(?, CAST(" + quote(column) + " AS CHAR)) > 0 LIMIT 1";
                            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                                statement.setString(1, url);
                                statement.setQueryTimeout(3);
                                try (ResultSet found = statement.executeQuery()) {
                                    if (found.next()) return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        }
    }

    private boolean isTextType(int type) {
        return type == Types.CHAR || type == Types.VARCHAR || type == Types.LONGVARCHAR ||
            type == Types.NCHAR || type == Types.NVARCHAR || type == Types.LONGNVARCHAR ||
            type == Types.CLOB || type == Types.NCLOB;
    }

    private String quote(String identifier) { return "`" + identifier.replace("`", "``") + "`"; }

    private String sha256(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) { throw new IllegalStateException("SHA-256 unavailable", e); }
    }

    private String safeError(Exception error) {
        String value = error.getClass().getSimpleName() + ": " + String.valueOf(error.getMessage());
        return value.length() > 950 ? value.substring(0, 950) : value;
    }
}