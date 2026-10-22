package dev.sunny.godaily;

import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.Map;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NewsController {

  private final NewsService news;

  public NewsController(NewsService news) {
    this.news = news;
  }

  @GetMapping("/api/news")
  public ResponseEntity<ObjectNode> news() {
    return ResponseEntity.ok()
      .cacheControl(CacheControl.noStore())
      .body(news.archive());
  }

  @GetMapping("/api/health")
  public Map<String, String> health() {
    return Map.of("status", "ok", "service", "go-daily-api");
  }
}
