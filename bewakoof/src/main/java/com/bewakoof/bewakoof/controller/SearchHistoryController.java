package com.bewakoof.bewakoof.controller;

import com.bewakoof.bewakoof.model.SearchHistory;
import com.bewakoof.bewakoof.service.SearchHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SearchHistoryController {

    @Autowired
    private SearchHistoryService searchHistoryService;

    @GetMapping("/search-history")
    public List<String> getSearchHistory(@AuthenticationPrincipal UserDetails userDetails) {
        return searchHistoryService.getSearchHistory(userDetails);
    }
    @PostMapping("/search-history/{text}")
    public void addSearchHistory(@AuthenticationPrincipal UserDetails userDetails , @PathVariable String text) {
        searchHistoryService.addSearchHistory(userDetails , text);
    }
    @DeleteMapping("/search-history/{text}")
    public void removeSearchHistroy(@AuthenticationPrincipal UserDetails userDetails , @PathVariable String text) {
        searchHistoryService.removeSearchHistory(userDetails , text);
    }

    @DeleteMapping("/search-history/all")
    public void deleteSearchHistory(@AuthenticationPrincipal UserDetails userDetails) {
        searchHistoryService.deleteSearchHistory(userDetails);
    }

}
