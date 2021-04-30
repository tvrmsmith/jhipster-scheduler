package com.propio.repository;

import com.propio.domain.ZipCode;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ZipCode entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ZipCodeRepository extends JpaRepository<ZipCode, Long> {}
