package com.propio.repository;

import com.propio.domain.UsState;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the UsState entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UsStateRepository extends JpaRepository<UsState, Long> {}
