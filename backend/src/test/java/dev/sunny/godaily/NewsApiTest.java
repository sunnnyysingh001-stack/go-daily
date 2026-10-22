package dev.sunny.godaily;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class NewsApiTest {

  @Autowired
  MockMvc http;

  @Autowired
  ObjectMapper mapper;

  @Autowired
  NewsService service;

  @Test
  void archiveIsAvailableAndHonestAboutFreshness() throws Exception {
    http
      .perform(get("/api/news"))
      .andExpect(status().isOk())
      .andExpect(header().string("Cache-Control", "no-store"))
      .andExpect(jsonPath("$.status").value("manual"))
      .andExpect(jsonPath("$.items").isArray());
    assertFalse(service.archive().path("items").isEmpty());
  }

  @Test
  void rejectsWrites() throws Exception {
    http.perform(post("/api/news")).andExpect(status().isMethodNotAllowed());
  }

  @Test
  void healthWorks() throws Exception {
    http
      .perform(get("/api/health"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.status").value("ok"));
  }

  @Test
  void validatesPublisherUrlDateAndAttribution() throws Exception {
    var item = mapper
      .createObjectNode()
      .put("url", "https://www.thehindu.com/news/test")
      .put("source", "The Hindu")
      .put("date", "2026-10-20T00:00:00Z");
    assertTrue(NewsService.isAllowed(item));
    for (String url : new String[] {
      "http://thehindu.com",
      "https://thehindu.com.evil.test",
      "https://user@thehindu.com",
      "javascript:alert(1)",
    }) {
      assertFalse(NewsService.isAllowed(item.deepCopy().put("url", url)));
    }
    assertFalse(
      NewsService.isAllowed(item.deepCopy().put("source", "Unknown"))
    );
    assertFalse(NewsService.isAllowed(item.deepCopy().put("date", "invalid")));
    assertFalse(NewsService.isAllowed(item.deepCopy().put("kind", "video")));
  }

  @Test
  void resultsAreUniqueSortedAndIndependent() {
    var archive = service.archive();
    var ids = new java.util.HashSet<String>();
    java.time.Instant previous = java.time.Instant.MAX;
    for (var item : archive.path("items")) {
      assertTrue(ids.add(item.path("id").asText()));
      var date = java.time.Instant.parse(item.path("date").asText());
      assertFalse(date.isAfter(previous));
      previous = date;
    }
    archive.remove("items");
    assertTrue(service.archive().has("items"));
  }
}
