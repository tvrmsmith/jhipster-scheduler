package com.propio.web.rest;

import com.propio.domain.JobRequest;
import com.propio.repository.JobRequestRepository;
import com.propio.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.propio.domain.JobRequest}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class JobRequestResource {

    private final Logger log = LoggerFactory.getLogger(JobRequestResource.class);

    private static final String ENTITY_NAME = "jobRequest";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JobRequestRepository jobRequestRepository;

    public JobRequestResource(JobRequestRepository jobRequestRepository) {
        this.jobRequestRepository = jobRequestRepository;
    }

    /**
     * {@code POST  /job-requests} : Create a new jobRequest.
     *
     * @param jobRequest the jobRequest to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new jobRequest, or with status {@code 400 (Bad Request)} if the jobRequest has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/job-requests")
    public ResponseEntity<JobRequest> createJobRequest(@Valid @RequestBody JobRequest jobRequest) throws URISyntaxException {
        log.debug("REST request to save JobRequest : {}", jobRequest);
        if (jobRequest.getId() != null) {
            throw new BadRequestAlertException("A new jobRequest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        JobRequest result = jobRequestRepository.save(jobRequest);
        return ResponseEntity
            .created(new URI("/api/job-requests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /job-requests/:id} : Updates an existing jobRequest.
     *
     * @param id the id of the jobRequest to save.
     * @param jobRequest the jobRequest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jobRequest,
     * or with status {@code 400 (Bad Request)} if the jobRequest is not valid,
     * or with status {@code 500 (Internal Server Error)} if the jobRequest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/job-requests/{id}")
    public ResponseEntity<JobRequest> updateJobRequest(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody JobRequest jobRequest
    ) throws URISyntaxException {
        log.debug("REST request to update JobRequest : {}, {}", id, jobRequest);
        if (jobRequest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jobRequest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jobRequestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        JobRequest result = jobRequestRepository.save(jobRequest);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, jobRequest.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /job-requests/:id} : Partial updates given fields of an existing jobRequest, field will ignore if it is null
     *
     * @param id the id of the jobRequest to save.
     * @param jobRequest the jobRequest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jobRequest,
     * or with status {@code 400 (Bad Request)} if the jobRequest is not valid,
     * or with status {@code 404 (Not Found)} if the jobRequest is not found,
     * or with status {@code 500 (Internal Server Error)} if the jobRequest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/job-requests/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<JobRequest> partialUpdateJobRequest(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody JobRequest jobRequest
    ) throws URISyntaxException {
        log.debug("REST request to partial update JobRequest partially : {}, {}", id, jobRequest);
        if (jobRequest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jobRequest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jobRequestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<JobRequest> result = jobRequestRepository
            .findById(jobRequest.getId())
            .map(
                existingJobRequest -> {
                    if (jobRequest.getStartTime() != null) {
                        existingJobRequest.setStartTime(jobRequest.getStartTime());
                    }
                    if (jobRequest.getEndTime() != null) {
                        existingJobRequest.setEndTime(jobRequest.getEndTime());
                    }

                    return existingJobRequest;
                }
            )
            .map(jobRequestRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, jobRequest.getId().toString())
        );
    }

    /**
     * {@code GET  /job-requests} : get all the jobRequests.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of jobRequests in body.
     */
    @GetMapping("/job-requests")
    public List<JobRequest> getAllJobRequests() {
        log.debug("REST request to get all JobRequests");
        return jobRequestRepository.findAll();
    }

    /**
     * {@code GET  /job-requests/:id} : get the "id" jobRequest.
     *
     * @param id the id of the jobRequest to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the jobRequest, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/job-requests/{id}")
    public ResponseEntity<JobRequest> getJobRequest(@PathVariable Long id) {
        log.debug("REST request to get JobRequest : {}", id);
        Optional<JobRequest> jobRequest = jobRequestRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(jobRequest);
    }

    /**
     * {@code DELETE  /job-requests/:id} : delete the "id" jobRequest.
     *
     * @param id the id of the jobRequest to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/job-requests/{id}")
    public ResponseEntity<Void> deleteJobRequest(@PathVariable Long id) {
        log.debug("REST request to delete JobRequest : {}", id);
        jobRequestRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
