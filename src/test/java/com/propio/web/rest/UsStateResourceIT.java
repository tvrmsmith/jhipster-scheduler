package com.propio.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.propio.IntegrationTest;
import com.propio.domain.UsState;
import com.propio.repository.UsStateRepository;
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
 * Integration tests for the {@link UsStateResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UsStateResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ABBREVIATION = "IE";
    private static final String UPDATED_ABBREVIATION = "QW";

    private static final String ENTITY_API_URL = "/api/us-states";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UsStateRepository usStateRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUsStateMockMvc;

    private UsState usState;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UsState createEntity(EntityManager em) {
        UsState usState = new UsState().name(DEFAULT_NAME).abbreviation(DEFAULT_ABBREVIATION);
        return usState;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UsState createUpdatedEntity(EntityManager em) {
        UsState usState = new UsState().name(UPDATED_NAME).abbreviation(UPDATED_ABBREVIATION);
        return usState;
    }

    @BeforeEach
    public void initTest() {
        usState = createEntity(em);
    }

    @Test
    @Transactional
    void createUsState() throws Exception {
        int databaseSizeBeforeCreate = usStateRepository.findAll().size();
        // Create the UsState
        restUsStateMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(usState))
            )
            .andExpect(status().isCreated());

        // Validate the UsState in the database
        List<UsState> usStateList = usStateRepository.findAll();
        assertThat(usStateList).hasSize(databaseSizeBeforeCreate + 1);
        UsState testUsState = usStateList.get(usStateList.size() - 1);
        assertThat(testUsState.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testUsState.getAbbreviation()).isEqualTo(DEFAULT_ABBREVIATION);
    }

    @Test
    @Transactional
    void createUsStateWithExistingId() throws Exception {
        // Create the UsState with an existing ID
        usState.setId(1L);

        int databaseSizeBeforeCreate = usStateRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUsStateMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(usState))
            )
            .andExpect(status().isBadRequest());

        // Validate the UsState in the database
        List<UsState> usStateList = usStateRepository.findAll();
        assertThat(usStateList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = usStateRepository.findAll().size();
        // set the field null
        usState.setName(null);

        // Create the UsState, which fails.

        restUsStateMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(usState))
            )
            .andExpect(status().isBadRequest());

        List<UsState> usStateList = usStateRepository.findAll();
        assertThat(usStateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAbbreviationIsRequired() throws Exception {
        int databaseSizeBeforeTest = usStateRepository.findAll().size();
        // set the field null
        usState.setAbbreviation(null);

        // Create the UsState, which fails.

        restUsStateMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(usState))
            )
            .andExpect(status().isBadRequest());

        List<UsState> usStateList = usStateRepository.findAll();
        assertThat(usStateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUsStates() throws Exception {
        // Initialize the database
        usStateRepository.saveAndFlush(usState);

        // Get all the usStateList
        restUsStateMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(usState.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].abbreviation").value(hasItem(DEFAULT_ABBREVIATION)));
    }

    @Test
    @Transactional
    void getUsState() throws Exception {
        // Initialize the database
        usStateRepository.saveAndFlush(usState);

        // Get the usState
        restUsStateMockMvc
            .perform(get(ENTITY_API_URL_ID, usState.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(usState.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.abbreviation").value(DEFAULT_ABBREVIATION));
    }

    @Test
    @Transactional
    void getNonExistingUsState() throws Exception {
        // Get the usState
        restUsStateMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUsState() throws Exception {
        // Initialize the database
        usStateRepository.saveAndFlush(usState);

        int databaseSizeBeforeUpdate = usStateRepository.findAll().size();

        // Update the usState
        UsState updatedUsState = usStateRepository.findById(usState.getId()).get();
        // Disconnect from session so that the updates on updatedUsState are not directly saved in db
        em.detach(updatedUsState);
        updatedUsState.name(UPDATED_NAME).abbreviation(UPDATED_ABBREVIATION);

        restUsStateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUsState.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUsState))
            )
            .andExpect(status().isOk());

        // Validate the UsState in the database
        List<UsState> usStateList = usStateRepository.findAll();
        assertThat(usStateList).hasSize(databaseSizeBeforeUpdate);
        UsState testUsState = usStateList.get(usStateList.size() - 1);
        assertThat(testUsState.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testUsState.getAbbreviation()).isEqualTo(UPDATED_ABBREVIATION);
    }

    @Test
    @Transactional
    void putNonExistingUsState() throws Exception {
        int databaseSizeBeforeUpdate = usStateRepository.findAll().size();
        usState.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUsStateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, usState.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(usState))
            )
            .andExpect(status().isBadRequest());

        // Validate the UsState in the database
        List<UsState> usStateList = usStateRepository.findAll();
        assertThat(usStateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUsState() throws Exception {
        int databaseSizeBeforeUpdate = usStateRepository.findAll().size();
        usState.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsStateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(usState))
            )
            .andExpect(status().isBadRequest());

        // Validate the UsState in the database
        List<UsState> usStateList = usStateRepository.findAll();
        assertThat(usStateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUsState() throws Exception {
        int databaseSizeBeforeUpdate = usStateRepository.findAll().size();
        usState.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsStateMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(usState))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UsState in the database
        List<UsState> usStateList = usStateRepository.findAll();
        assertThat(usStateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUsStateWithPatch() throws Exception {
        // Initialize the database
        usStateRepository.saveAndFlush(usState);

        int databaseSizeBeforeUpdate = usStateRepository.findAll().size();

        // Update the usState using partial update
        UsState partialUpdatedUsState = new UsState();
        partialUpdatedUsState.setId(usState.getId());

        partialUpdatedUsState.name(UPDATED_NAME);

        restUsStateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUsState.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUsState))
            )
            .andExpect(status().isOk());

        // Validate the UsState in the database
        List<UsState> usStateList = usStateRepository.findAll();
        assertThat(usStateList).hasSize(databaseSizeBeforeUpdate);
        UsState testUsState = usStateList.get(usStateList.size() - 1);
        assertThat(testUsState.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testUsState.getAbbreviation()).isEqualTo(DEFAULT_ABBREVIATION);
    }

    @Test
    @Transactional
    void fullUpdateUsStateWithPatch() throws Exception {
        // Initialize the database
        usStateRepository.saveAndFlush(usState);

        int databaseSizeBeforeUpdate = usStateRepository.findAll().size();

        // Update the usState using partial update
        UsState partialUpdatedUsState = new UsState();
        partialUpdatedUsState.setId(usState.getId());

        partialUpdatedUsState.name(UPDATED_NAME).abbreviation(UPDATED_ABBREVIATION);

        restUsStateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUsState.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUsState))
            )
            .andExpect(status().isOk());

        // Validate the UsState in the database
        List<UsState> usStateList = usStateRepository.findAll();
        assertThat(usStateList).hasSize(databaseSizeBeforeUpdate);
        UsState testUsState = usStateList.get(usStateList.size() - 1);
        assertThat(testUsState.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testUsState.getAbbreviation()).isEqualTo(UPDATED_ABBREVIATION);
    }

    @Test
    @Transactional
    void patchNonExistingUsState() throws Exception {
        int databaseSizeBeforeUpdate = usStateRepository.findAll().size();
        usState.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUsStateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, usState.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(usState))
            )
            .andExpect(status().isBadRequest());

        // Validate the UsState in the database
        List<UsState> usStateList = usStateRepository.findAll();
        assertThat(usStateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUsState() throws Exception {
        int databaseSizeBeforeUpdate = usStateRepository.findAll().size();
        usState.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsStateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(usState))
            )
            .andExpect(status().isBadRequest());

        // Validate the UsState in the database
        List<UsState> usStateList = usStateRepository.findAll();
        assertThat(usStateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUsState() throws Exception {
        int databaseSizeBeforeUpdate = usStateRepository.findAll().size();
        usState.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsStateMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(usState))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UsState in the database
        List<UsState> usStateList = usStateRepository.findAll();
        assertThat(usStateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUsState() throws Exception {
        // Initialize the database
        usStateRepository.saveAndFlush(usState);

        int databaseSizeBeforeDelete = usStateRepository.findAll().size();

        // Delete the usState
        restUsStateMockMvc
            .perform(delete(ENTITY_API_URL_ID, usState.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UsState> usStateList = usStateRepository.findAll();
        assertThat(usStateList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
