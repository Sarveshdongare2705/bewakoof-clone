package com.bewakoof.bewakoof.repository;

import com.bewakoof.bewakoof.model.AppUser;
import com.bewakoof.bewakoof.model.SearchHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {

    // Fetch list of search texts for a specific user
    @Query("SELECT s.text FROM SearchHistory s WHERE s.user = :user ORDER BY s.timestamp DESC")
    List<String> findSearchTextsByUser(@Param("user") AppUser user);

    @Query("SELECT s FROM SearchHistory s WHERE LOWER(s.text) = :text")
    List<SearchHistory> findByText(@Param("text") String text);

    @Query("SELECT s FROM SearchHistory s WHERE s.user = :user")
    List<SearchHistory> findByUser(@Param("user") AppUser user);

    @Query("SELECT s FROM SearchHistory  s WHERE s.user = :user AND LOWER(s.text) = :text")
    SearchHistory findByUserAndText(@Param("user") AppUser user, @Param("text") String text);

    @Query("SELECT s FROM SearchHistory s WHERE s.user = :user ORDER BY s.timestamp DESC")
    List<SearchHistory> findTop5SearchOfUser(@Param("user") AppUser user);

}
