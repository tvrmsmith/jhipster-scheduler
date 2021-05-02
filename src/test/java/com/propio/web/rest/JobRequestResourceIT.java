package com.propio.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.propio.IntegrationTest;
import com.propio.domain.JobRequest;
import com.propio.domain.Language;
import com.propio.domain.Location;
import com.propio.repository.JobRequestRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link JobRequestResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class JobRequestResourceIT {

    private static final Instant DEFAULT_START_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/job-requests";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JobRequestRepository jobRequestRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJobRequestMockMvc;

    private JobRequest jobRequest;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JobRequest createEntity(EntityManager em) {
        JobRequest jobRequest = new JobRequest().startTime(DEFAULT_START_TIME).endTime(DEFAULT_END_TIME);
        // Add required entity
        Language language;
        if (TestUtil.findAll(em, Language.class).isEmpty()) {
            language = LanguageResourceIT.createEntity(em);
            em.persist(language);
            em.flush();
        } else {
            language = TestUtil.findAll(em, Language.class).get(0);
        }
        jobRequest.setLanguage(language);
        // Add required entity
        Location location;
        if (TestUtil.findAll(em, Location.class).isEmpty()) {
            location = LocationResourceIT.createEntity(em);
            em.persist(location);
            em.flush();
        } else {
            location = TestUtil.findAll(em, Location.class).get(0);
        }
        jobRequest.setLocation(location);
        return jobRequest;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JobRequest createUpdatedEntity(EntityManager em) {
        JobRequest jobRequest = new JobRequest().startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);
        // Add required entity
        Language language;
        if (TestUtil.findAll(em, Language.class).isEmpty()) {
            language = LanguageResourceIT.createUpdatedEntity(em);
            em.persist(language);
            em.flush();
        } else {
            language = TestUtil.findAll(em, Language.class).get(0);
        }
        jobRequest.setLanguage(language);
        // Add required entity
        Location location;
        if (TestUtil.findAll(em, Location.class).isEmpty()) {
            location = LocationResourceIT.createUpdatedEntity(em);
            em.persist(location);
            em.flush();
        } else {
            location = TestUtil.findAll(em, Location.class).get(0);
        }
        jobRequest.setLocation(location);
        return jobRequest;
    }

    @BeforeEach
    public void initTest() {
        jobRequest = createEntity(em);
    }

    @Test
    @Transactional
    void createJobRequest() throws Exception {
        int databaseSizeBeforeCreate = jobRequestRepository.findAll().size();
        // Create the JobRequest
        restJobRequestMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobRequest))
            )
            .andExpect(status().isCreated());

        // Validate the JobRequest in the database
        List<JobRequest> jobRequestList = jobRequestRepository.findAll();
        assertThat(jobRequestList).hasSize(databaseSizeBeforeCreate + 1);
        JobRequest testJobRequest = jobRequestList.get(jobRequestList.size() - 1);
        assertThat(testJobRequest.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testJobRequest.getEndTime()).isEqualTo(DEFAULT_END_TIME);
    }

    @Test
    @Transactional
    void createJobRequestWithExistingId() throws Exception {
        // Create the JobRequest with an existing ID
        jobRequest.setId(1L);

        int databaseSizeBeforeCreate = jobRequestRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJobRequestMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobRequest in the database
        List<JobRequest> jobRequestList = jobRequestRepository.findAll();
        assertThat(jobRequestList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStartTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobRequestRepository.findAll().size();
        // set the field null
        jobRequest.setStartTime(null);

        // Create the JobRequest, which fails.

        restJobRequestMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobRequest))
            )
            .andExpect(status().isBadRequest());

        List<JobRequest> jobRequestList = jobRequestRepository.findAll();
        assertThat(jobRequestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEndTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = jobRequestRepository.findAll().size();
        // set the field null
        jobRequest.setEndTime(null);

        // Create the JobRequest, which fails.

        restJobRequestMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobRequest))
            )
            .andExpect(status().isBadRequest());

        List<JobRequest> jobRequestList = jobRequestRepository.findAll();
        assertThat(jobRequestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllJobRequests() throws Exception {
        // Initialize the database
        jobRequestRepository.saveAndFlush(jobRequest);

        // Get all the jobRequestList
        restJobRequestMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(jobRequest.getId().intValue())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(DEFAULT_END_TIME.toString())));
    }

    @Test
    @Transactional
    void getJobRequest() throws Exception {
        // Initialize the database
        jobRequestRepository.saveAndFlush(jobRequest);

        // Get the jobRequest
        restJobRequestMockMvc
            .perform(get(ENTITY_API_URL_ID, jobRequest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(jobRequest.getId().intValue()))
            .andExpect(jsonPath("$.startTime").value(DEFAULT_START_TIME.toString()))
            .andExpect(jsonPath("$.endTime").value(DEFAULT_END_TIME.toString()));
    }

    @Test
    @Transactional
    void getNonExistingJobRequest() throws Exception {
        // Get the jobRequest
        restJobRequestMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewJobRequest() throws Exception {
        // Initialize the database
        jobRequestRepository.saveAndFlush(jobRequest);

        int databaseSizeBeforeUpdate = jobRequestRepository.findAll().size();

        // Update the jobRequest
        JobRequest updatedJobRequest = jobRequestRepository.findById(jobRequest.getId()).get();
        // Disconnect from session so that the updates on updatedJobRequest are not directly saved in db
        em.detach(updatedJobRequest);
        updatedJobRequest.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restJobRequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJobRequest.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedJobRequest))
            )
            .andExpect(status().isOk());

        // Validate the JobRequest in the database
        List<JobRequest> jobRequestList = jobRequestRepository.findAll();
        assertThat(jobRequestList).hasSize(databaseSizeBeforeUpdate);
        JobRequest testJobRequest = jobRequestList.get(jobRequestList.size() - 1);
        assertThat(testJobRequest.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testJobRequest.getEndTime()).isEqualTo(UPDATED_END_TIME);
    }

    @Test
    @Transactional
    void putNonExistingJobRequest() throws Exception {
        int databaseSizeBeforeUpdate = jobRequestRepository.findAll().size();
        jobRequest.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJobRequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, jobRequest.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobRequest in the database
        List<JobRequest> jobRequestList = jobRequestRepository.findAll();
        assertThat(jobRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJobRequest() throws Exception {
        int databaseSizeBeforeUpdate = jobRequestRepository.findAll().size();
        jobRequest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobRequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobRequest in the database
        List<JobRequest> jobRequestList = jobRequestRepository.findAll();
        assertThat(jobRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJobRequest() throws Exception {
        int databaseSizeBeforeUpdate = jobRequestRepository.findAll().size();
        jobRequest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobRequestMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobRequest))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JobRequest in the database
        List<JobRequest> jobRequestList = jobRequestRepository.findAll();
        assertThat(jobRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJobRequestWithPatch() throws Exception {
        // Initialize the database
        jobRequestRepository.saveAndFlush(jobRequest);

        int databaseSizeBeforeUpdate = jobRequestRepository.findAll().size();

        // Update the jobRequest using partial update
        JobRequest partialUpdatedJobRequest = new JobRequest();
        partialUpdatedJobRequest.setId(jobRequest.getId());

        partialUpdatedJobRequest.startTime(UPDATED_START_TIME);

        restJobRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJobRequest.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJobRequest))
            )
            .andExpect(status().isOk());

        // Validate the JobRequest in the database
        List<JobRequest> jobRequestList = jobRequestRepository.findAll();
        assertThat(jobRequestList).hasSize(databaseSizeBeforeUpdate);
        JobRequest testJobRequest = jobRequestList.get(jobRequestList.size() - 1);
        assertThat(testJobRequest.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testJobRequest.getEndTime()).isEqualTo(DEFAULT_END_TIME);
    }

    @Test
    @Transactional
    void fullUpdateJobRequestWithPatch() throws Exception {
        // Initialize the database
        jobRequestRepository.saveAndFlush(jobRequest);

        int databaseSizeBeforeUpdate = jobRequestRepository.findAll().size();

        // Update the jobRequest using partial update
        JobRequest partialUpdatedJobRequest = new JobRequest();
        partialUpdatedJobRequest.setId(jobRequest.getId());

        partialUpdatedJobRequest.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restJobRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJobRequest.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJobRequest))
            )
            .andExpect(status().isOk());

        // Validate the JobRequest in the database
        List<JobRequest> jobRequestList = jobRequestRepository.findAll();
        assertThat(jobRequestList).hasSize(databaseSizeBeforeUpdate);
        JobRequest testJobRequest = jobRequestList.get(jobRequestList.size() - 1);
        assertThat(testJobRequest.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testJobRequest.getEndTime()).isEqualTo(UPDATED_END_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingJobRequest() throws Exception {
        int databaseSizeBeforeUpdate = jobRequestRepository.findAll().size();
        jobRequest.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJobRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, jobRequest.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jobRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobRequest in the database
        List<JobRequest> jobRequestList = jobRequestRepository.findAll();
        assertThat(jobRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJobRequest() throws Exception {
        int databaseSizeBeforeUpdate = jobRequestRepository.findAll().size();
        jobRequest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jobRequest))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobRequest in the database
        List<JobRequest> jobRequestList = jobRequestRepository.findAll();
        assertThat(jobRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJobRequest() throws Exception {
        int databaseSizeBeforeUpdate = jobRequestRepository.findAll().size();
        jobRequest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobRequestMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jobRequest))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JobRequest in the database
        List<JobRequest> jobRequestList = jobRequestRepository.findAll();
        assertThat(jobRequestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJobRequest() throws Exception {
        // Initialize the database
        jobRequestRepository.saveAndFlush(jobRequest);

        int databaseSizeBeforeDelete = jobRequestRepository.findAll().size();

        // Delete the jobRequest
        restJobRequestMockMvc
            .perform(delete(ENTITY_API_URL_ID, jobRequest.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<JobRequest> jobRequestList = jobRequestRepository.findAll();
        assertThat(jobRequestList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
