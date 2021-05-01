package com.propio.repository;

import com.propio.domain.JobRequest;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the JobRequest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JobRequestRepository extends JpaRepository<JobRequest, Long> {}
