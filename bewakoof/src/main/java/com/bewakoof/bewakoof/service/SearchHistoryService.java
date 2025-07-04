package com.bewakoof.bewakoof.service;

import com.bewakoof.bewakoof.model.AppUser;
import com.bewakoof.bewakoof.model.SearchHistory;
import com.bewakoof.bewakoof.repository.SearchHistoryRepository;
import com.bewakoof.bewakoof.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchHistoryService {

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<String> getSearchHistory(UserDetails userDetails) {
        String email = userDetails.getUsername();
        AppUser user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException(email);
        }
        return searchHistoryRepository.findSearchTextsByUser(user);
    }

    public void addSearchHistory(UserDetails userDetails , String text) {
        String email = userDetails.getUsername();
        AppUser user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException(email);
        }
        List<SearchHistory> prevHistory = searchHistoryRepository.findByText(text.toLowerCase());
        boolean alreadyExists = false;
        alreadyExists = prevHistory.stream().anyMatch(searchHistory -> searchHistory.getText().toLowerCase().equals(text));

        if (alreadyExists) return;
        SearchHistory searchHistory = new SearchHistory();
        searchHistory.setUser(user);
        searchHistory.setText(text);
        searchHistoryRepository.save(searchHistory);
    }

    public void removeSearchHistory(UserDetails userDetails ,  String text) {
        String email = userDetails.getUsername();
        AppUser user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException(email);
        }
        SearchHistory s = searchHistoryRepository.findByUserAndText(user, text);
        if (s == null) {return ;}
        else{
            searchHistoryRepository.delete(s);
        }
    }
    public void deleteSearchHistory(UserDetails userDetails) {
        String email = userDetails.getUsername();
        AppUser user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException(email);
        }

        List<SearchHistory> prevHistory = searchHistoryRepository.findByUser(user);
        if (!prevHistory.isEmpty()) {
            searchHistoryRepository.deleteAll(prevHistory);
        }
    }




}
