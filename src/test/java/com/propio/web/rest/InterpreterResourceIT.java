package com.propio.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.propio.IntegrationTest;
import com.propio.domain.Address;
import com.propio.domain.Interpreter;
import com.propio.domain.Language;
import com.propio.repository.InterpreterRepository;
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
 * Integration tests for the {@link InterpreterResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InterpreterResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/interpreters";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InterpreterRepository interpreterRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInterpreterMockMvc;

    private Interpreter interpreter;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Interpreter createEntity(EntityManager em) {
        Interpreter interpreter = new Interpreter().firstName(DEFAULT_FIRST_NAME).lastName(DEFAULT_LAST_NAME);
        // Add required entity
        Address address;
        if (TestUtil.findAll(em, Address.class).isEmpty()) {
            address = AddressResourceIT.createEntity(em);
            em.persist(address);
            em.flush();
        } else {
            address = TestUtil.findAll(em, Address.class).get(0);
        }
        interpreter.setAddress(address);
        // Add required entity
        Language language;
        if (TestUtil.findAll(em, Language.class).isEmpty()) {
            language = LanguageResourceIT.createEntity(em);
            em.persist(language);
            em.flush();
        } else {
            language = TestUtil.findAll(em, Language.class).get(0);
        }
        interpreter.setLanguages(language);
        return interpreter;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Interpreter createUpdatedEntity(EntityManager em) {
        Interpreter interpreter = new Interpreter().firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME);
        // Add required entity
        Address address;
        if (TestUtil.findAll(em, Address.class).isEmpty()) {
            address = AddressResourceIT.createUpdatedEntity(em);
            em.persist(address);
            em.flush();
        } else {
            address = TestUtil.findAll(em, Address.class).get(0);
        }
        interpreter.setAddress(address);
        // Add required entity
        Language language;
        if (TestUtil.findAll(em, Language.class).isEmpty()) {
            language = LanguageResourceIT.createUpdatedEntity(em);
            em.persist(language);
            em.flush();
        } else {
            language = TestUtil.findAll(em, Language.class).get(0);
        }
        interpreter.setLanguages(language);
        return interpreter;
    }

    @BeforeEach
    public void initTest() {
        interpreter = createEntity(em);
    }

    @Test
    @Transactional
    void createInterpreter() throws Exception {
        int databaseSizeBeforeCreate = interpreterRepository.findAll().size();
        // Create the Interpreter
        restInterpreterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(interpreter)))
            .andExpect(status().isCreated());

        // Validate the Interpreter in the database
        List<Interpreter> interpreterList = interpreterRepository.findAll();
        assertThat(interpreterList).hasSize(databaseSizeBeforeCreate + 1);
        Interpreter testInterpreter = interpreterList.get(interpreterList.size() - 1);
        assertThat(testInterpreter.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testInterpreter.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
    }

    @Test
    @Transactional
    void createInterpreterWithExistingId() throws Exception {
        // Create the Interpreter with an existing ID
        interpreter.setId(1L);

        int databaseSizeBeforeCreate = interpreterRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInterpreterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(interpreter)))
            .andExpect(status().isBadRequest());

        // Validate the Interpreter in the database
        List<Interpreter> interpreterList = interpreterRepository.findAll();
        assertThat(interpreterList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInterpreters() throws Exception {
        // Initialize the database
        interpreterRepository.saveAndFlush(interpreter);

        // Get all the interpreterList
        restInterpreterMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(interpreter.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)));
    }

    @Test
    @Transactional
    void getInterpreter() throws Exception {
        // Initialize the database
        interpreterRepository.saveAndFlush(interpreter);

        // Get the interpreter
        restInterpreterMockMvc
            .perform(get(ENTITY_API_URL_ID, interpreter.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(interpreter.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME));
    }

    @Test
    @Transactional
    void getNonExistingInterpreter() throws Exception {
        // Get the interpreter
        restInterpreterMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewInterpreter() throws Exception {
        // Initialize the database
        interpreterRepository.saveAndFlush(interpreter);

        int databaseSizeBeforeUpdate = interpreterRepository.findAll().size();

        // Update the interpreter
        Interpreter updatedInterpreter = interpreterRepository.findById(interpreter.getId()).get();
        // Disconnect from session so that the updates on updatedInterpreter are not directly saved in db
        em.detach(updatedInterpreter);
        updatedInterpreter.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME);

        restInterpreterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInterpreter.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInterpreter))
            )
            .andExpect(status().isOk());

        // Validate the Interpreter in the database
        List<Interpreter> interpreterList = interpreterRepository.findAll();
        assertThat(interpreterList).hasSize(databaseSizeBeforeUpdate);
        Interpreter testInterpreter = interpreterList.get(interpreterList.size() - 1);
        assertThat(testInterpreter.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testInterpreter.getLastName()).isEqualTo(UPDATED_LAST_NAME);
    }

    @Test
    @Transactional
    void putNonExistingInterpreter() throws Exception {
        int databaseSizeBeforeUpdate = interpreterRepository.findAll().size();
        interpreter.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInterpreterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, interpreter.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(interpreter))
            )
            .andExpect(status().isBadRequest());

        // Validate the Interpreter in the database
        List<Interpreter> interpreterList = interpreterRepository.findAll();
        assertThat(interpreterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInterpreter() throws Exception {
        int databaseSizeBeforeUpdate = interpreterRepository.findAll().size();
        interpreter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterpreterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(interpreter))
            )
            .andExpect(status().isBadRequest());

        // Validate the Interpreter in the database
        List<Interpreter> interpreterList = interpreterRepository.findAll();
        assertThat(interpreterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInterpreter() throws Exception {
        int databaseSizeBeforeUpdate = interpreterRepository.findAll().size();
        interpreter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterpreterMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(interpreter)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Interpreter in the database
        List<Interpreter> interpreterList = interpreterRepository.findAll();
        assertThat(interpreterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInterpreterWithPatch() throws Exception {
        // Initialize the database
        interpreterRepository.saveAndFlush(interpreter);

        int databaseSizeBeforeUpdate = interpreterRepository.findAll().size();

        // Update the interpreter using partial update
        Interpreter partialUpdatedInterpreter = new Interpreter();
        partialUpdatedInterpreter.setId(interpreter.getId());

        partialUpdatedInterpreter.firstName(UPDATED_FIRST_NAME);

        restInterpreterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInterpreter.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInterpreter))
            )
            .andExpect(status().isOk());

        // Validate the Interpreter in the database
        List<Interpreter> interpreterList = interpreterRepository.findAll();
        assertThat(interpreterList).hasSize(databaseSizeBeforeUpdate);
        Interpreter testInterpreter = interpreterList.get(interpreterList.size() - 1);
        assertThat(testInterpreter.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testInterpreter.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
    }

    @Test
    @Transactional
    void fullUpdateInterpreterWithPatch() throws Exception {
        // Initialize the database
        interpreterRepository.saveAndFlush(interpreter);

        int databaseSizeBeforeUpdate = interpreterRepository.findAll().size();

        // Update the interpreter using partial update
        Interpreter partialUpdatedInterpreter = new Interpreter();
        partialUpdatedInterpreter.setId(interpreter.getId());

        partialUpdatedInterpreter.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME);

        restInterpreterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInterpreter.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInterpreter))
            )
            .andExpect(status().isOk());

        // Validate the Interpreter in the database
        List<Interpreter> interpreterList = interpreterRepository.findAll();
        assertThat(interpreterList).hasSize(databaseSizeBeforeUpdate);
        Interpreter testInterpreter = interpreterList.get(interpreterList.size() - 1);
        assertThat(testInterpreter.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testInterpreter.getLastName()).isEqualTo(UPDATED_LAST_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingInterpreter() throws Exception {
        int databaseSizeBeforeUpdate = interpreterRepository.findAll().size();
        interpreter.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInterpreterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, interpreter.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(interpreter))
            )
            .andExpect(status().isBadRequest());

        // Validate the Interpreter in the database
        List<Interpreter> interpreterList = interpreterRepository.findAll();
        assertThat(interpreterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInterpreter() throws Exception {
        int databaseSizeBeforeUpdate = interpreterRepository.findAll().size();
        interpreter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterpreterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(interpreter))
            )
            .andExpect(status().isBadRequest());

        // Validate the Interpreter in the database
        List<Interpreter> interpreterList = interpreterRepository.findAll();
        assertThat(interpreterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInterpreter() throws Exception {
        int databaseSizeBeforeUpdate = interpreterRepository.findAll().size();
        interpreter.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInterpreterMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(interpreter))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Interpreter in the database
        List<Interpreter> interpreterList = interpreterRepository.findAll();
        assertThat(interpreterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInterpreter() throws Exception {
        // Initialize the database
        interpreterRepository.saveAndFlush(interpreter);

        int databaseSizeBeforeDelete = interpreterRepository.findAll().size();

        // Delete the interpreter
        restInterpreterMockMvc
            .perform(delete(ENTITY_API_URL_ID, interpreter.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Interpreter> interpreterList = interpreterRepository.findAll();
        assertThat(interpreterList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
