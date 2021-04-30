package com.propio.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.propio.IntegrationTest;
import com.propio.domain.ZipCode;
import com.propio.repository.ZipCodeRepository;
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
 * Integration tests for the {@link ZipCodeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ZipCodeResourceIT {

    private static final String DEFAULT_VALUE = "92065";
    private static final String UPDATED_VALUE = "02584";

    private static final String ENTITY_API_URL = "/api/zip-codes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ZipCodeRepository zipCodeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restZipCodeMockMvc;

    private ZipCode zipCode;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ZipCode createEntity(EntityManager em) {
        ZipCode zipCode = new ZipCode().value(DEFAULT_VALUE);
        return zipCode;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ZipCode createUpdatedEntity(EntityManager em) {
        ZipCode zipCode = new ZipCode().value(UPDATED_VALUE);
        return zipCode;
    }

    @BeforeEach
    public void initTest() {
        zipCode = createEntity(em);
    }

    @Test
    @Transactional
    void createZipCode() throws Exception {
        int databaseSizeBeforeCreate = zipCodeRepository.findAll().size();
        // Create the ZipCode
        restZipCodeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(zipCode)))
            .andExpect(status().isCreated());

        // Validate the ZipCode in the database
        List<ZipCode> zipCodeList = zipCodeRepository.findAll();
        assertThat(zipCodeList).hasSize(databaseSizeBeforeCreate + 1);
        ZipCode testZipCode = zipCodeList.get(zipCodeList.size() - 1);
        assertThat(testZipCode.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void createZipCodeWithExistingId() throws Exception {
        // Create the ZipCode with an existing ID
        zipCode.setId(1L);

        int databaseSizeBeforeCreate = zipCodeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restZipCodeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(zipCode)))
            .andExpect(status().isBadRequest());

        // Validate the ZipCode in the database
        List<ZipCode> zipCodeList = zipCodeRepository.findAll();
        assertThat(zipCodeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = zipCodeRepository.findAll().size();
        // set the field null
        zipCode.setValue(null);

        // Create the ZipCode, which fails.

        restZipCodeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(zipCode)))
            .andExpect(status().isBadRequest());

        List<ZipCode> zipCodeList = zipCodeRepository.findAll();
        assertThat(zipCodeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllZipCodes() throws Exception {
        // Initialize the database
        zipCodeRepository.saveAndFlush(zipCode);

        // Get all the zipCodeList
        restZipCodeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(zipCode.getId().intValue())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)));
    }

    @Test
    @Transactional
    void getZipCode() throws Exception {
        // Initialize the database
        zipCodeRepository.saveAndFlush(zipCode);

        // Get the zipCode
        restZipCodeMockMvc
            .perform(get(ENTITY_API_URL_ID, zipCode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(zipCode.getId().intValue()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE));
    }

    @Test
    @Transactional
    void getNonExistingZipCode() throws Exception {
        // Get the zipCode
        restZipCodeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewZipCode() throws Exception {
        // Initialize the database
        zipCodeRepository.saveAndFlush(zipCode);

        int databaseSizeBeforeUpdate = zipCodeRepository.findAll().size();

        // Update the zipCode
        ZipCode updatedZipCode = zipCodeRepository.findById(zipCode.getId()).get();
        // Disconnect from session so that the updates on updatedZipCode are not directly saved in db
        em.detach(updatedZipCode);
        updatedZipCode.value(UPDATED_VALUE);

        restZipCodeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedZipCode.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedZipCode))
            )
            .andExpect(status().isOk());

        // Validate the ZipCode in the database
        List<ZipCode> zipCodeList = zipCodeRepository.findAll();
        assertThat(zipCodeList).hasSize(databaseSizeBeforeUpdate);
        ZipCode testZipCode = zipCodeList.get(zipCodeList.size() - 1);
        assertThat(testZipCode.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingZipCode() throws Exception {
        int databaseSizeBeforeUpdate = zipCodeRepository.findAll().size();
        zipCode.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restZipCodeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, zipCode.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(zipCode))
            )
            .andExpect(status().isBadRequest());

        // Validate the ZipCode in the database
        List<ZipCode> zipCodeList = zipCodeRepository.findAll();
        assertThat(zipCodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchZipCode() throws Exception {
        int databaseSizeBeforeUpdate = zipCodeRepository.findAll().size();
        zipCode.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restZipCodeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(zipCode))
            )
            .andExpect(status().isBadRequest());

        // Validate the ZipCode in the database
        List<ZipCode> zipCodeList = zipCodeRepository.findAll();
        assertThat(zipCodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamZipCode() throws Exception {
        int databaseSizeBeforeUpdate = zipCodeRepository.findAll().size();
        zipCode.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restZipCodeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(zipCode)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ZipCode in the database
        List<ZipCode> zipCodeList = zipCodeRepository.findAll();
        assertThat(zipCodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateZipCodeWithPatch() throws Exception {
        // Initialize the database
        zipCodeRepository.saveAndFlush(zipCode);

        int databaseSizeBeforeUpdate = zipCodeRepository.findAll().size();

        // Update the zipCode using partial update
        ZipCode partialUpdatedZipCode = new ZipCode();
        partialUpdatedZipCode.setId(zipCode.getId());

        partialUpdatedZipCode.value(UPDATED_VALUE);

        restZipCodeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedZipCode.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedZipCode))
            )
            .andExpect(status().isOk());

        // Validate the ZipCode in the database
        List<ZipCode> zipCodeList = zipCodeRepository.findAll();
        assertThat(zipCodeList).hasSize(databaseSizeBeforeUpdate);
        ZipCode testZipCode = zipCodeList.get(zipCodeList.size() - 1);
        assertThat(testZipCode.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateZipCodeWithPatch() throws Exception {
        // Initialize the database
        zipCodeRepository.saveAndFlush(zipCode);

        int databaseSizeBeforeUpdate = zipCodeRepository.findAll().size();

        // Update the zipCode using partial update
        ZipCode partialUpdatedZipCode = new ZipCode();
        partialUpdatedZipCode.setId(zipCode.getId());

        partialUpdatedZipCode.value(UPDATED_VALUE);

        restZipCodeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedZipCode.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedZipCode))
            )
            .andExpect(status().isOk());

        // Validate the ZipCode in the database
        List<ZipCode> zipCodeList = zipCodeRepository.findAll();
        assertThat(zipCodeList).hasSize(databaseSizeBeforeUpdate);
        ZipCode testZipCode = zipCodeList.get(zipCodeList.size() - 1);
        assertThat(testZipCode.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingZipCode() throws Exception {
        int databaseSizeBeforeUpdate = zipCodeRepository.findAll().size();
        zipCode.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restZipCodeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, zipCode.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(zipCode))
            )
            .andExpect(status().isBadRequest());

        // Validate the ZipCode in the database
        List<ZipCode> zipCodeList = zipCodeRepository.findAll();
        assertThat(zipCodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchZipCode() throws Exception {
        int databaseSizeBeforeUpdate = zipCodeRepository.findAll().size();
        zipCode.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restZipCodeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(zipCode))
            )
            .andExpect(status().isBadRequest());

        // Validate the ZipCode in the database
        List<ZipCode> zipCodeList = zipCodeRepository.findAll();
        assertThat(zipCodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamZipCode() throws Exception {
        int databaseSizeBeforeUpdate = zipCodeRepository.findAll().size();
        zipCode.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restZipCodeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(zipCode)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ZipCode in the database
        List<ZipCode> zipCodeList = zipCodeRepository.findAll();
        assertThat(zipCodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteZipCode() throws Exception {
        // Initialize the database
        zipCodeRepository.saveAndFlush(zipCode);

        int databaseSizeBeforeDelete = zipCodeRepository.findAll().size();

        // Delete the zipCode
        restZipCodeMockMvc
            .perform(delete(ENTITY_API_URL_ID, zipCode.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ZipCode> zipCodeList = zipCodeRepository.findAll();
        assertThat(zipCodeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
