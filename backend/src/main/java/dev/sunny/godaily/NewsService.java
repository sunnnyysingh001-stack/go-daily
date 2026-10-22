package dev.sunny.godaily;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.net.URI;
import java.time.Instant;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class NewsService {

  private final ObjectNode archive;

  public NewsService(ObjectMapper mapper) throws IOException {
    JsonNode seed = read(mapper, "data/news-seed.json");
    JsonNode curated = read(mapper, "data/current-affairs-seed.json");
    Map<String, JsonNode> entries = new LinkedHashMap<>();
    seed
      .path("items")
      .forEach(item -> entries.putIfAbsent(item.path("id").asText(), item));
    curated
      .path("items")
      .forEach(item -> entries.put(item.path("id").asText(), item));
    var items = entries
      .values()
      .stream()
      .filter(NewsService::isAllowed)
      .sorted(
        Comparator.comparing((JsonNode n) ->
          Instant.parse(n.path("date").asText())
        ).reversed()
      )
      .toList();
    archive = mapper.createObjectNode();
    archive.set("items", mapper.valueToTree(items));
    archive.set("checked", curated.path("checked"));
    archive.put("status", "manual");
    archive.put("message", "Showing the manually published archive.");
    archive.putNull("lastSuccessfulCheck");
    if (items.isEmpty()) archive.putNull("latestPublished");
    else archive.set("latestPublished", items.get(0).path("date"));
    ObjectNode curation = archive.putObject("curation");
    curation.set("checked", curated.path("checked"));
    curation.set("edition", curated.path("edition"));
    curation.set("note", curated.path("note"));
    curation.put("status", "partial");
    long count = java.util.stream.StreamSupport.stream(
      curated.path("items").spliterator(),
      false
    )
      .filter(n ->
        n.path("date").asText().startsWith(curated.path("edition").asText())
      )
      .count();
    curation.put("count", count);
  }

  private static JsonNode read(ObjectMapper mapper, String path)
    throws IOException {
    try (var stream = new ClassPathResource(path).getInputStream()) {
      return mapper.readTree(stream);
    }
  }

  public ObjectNode archive() {
    return archive.deepCopy();
  }

  static boolean isAllowed(JsonNode item) {
    try {
      URI uri = URI.create(item.path("url").asText());
      if (
        !"https".equalsIgnoreCase(uri.getScheme()) ||
        uri.getUserInfo() != null ||
        uri.getPort() != -1 ||
        "video".equals(item.path("kind").asText())
      ) return false;
      String host = uri.getHost();
      if (host == null) return false;
      host = host
        .toLowerCase(java.util.Locale.ROOT)
        .replaceFirst("^www\\.", "");
      String source = item.path("source").asText();
      Instant.parse(item.path("date").asText());
      return switch (host) {
        case "thehindu.com" -> source.equals("The Hindu") ||
          source.equals("The Hindu · via Google News");
        case "news.google.com" -> source.equals("The Hindu · via Google News");
        case "indianexpress.com" -> source.equals("The Indian Express");
        case "pib.gov.in" -> source.equals("PIB") ||
          source.equals("Press Information Bureau");
        default -> false;
      };
    } catch (RuntimeException invalid) {
      return false;
    }
  }
}
