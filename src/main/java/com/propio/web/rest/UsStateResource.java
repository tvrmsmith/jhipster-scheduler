package com.propio.web.rest;

import com.propio.domain.UsState;
import com.propio.repository.UsStateRepository;
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
 * REST controller for managing {@link com.propio.domain.UsState}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UsStateResource {

    private final Logger log = LoggerFactory.getLogger(UsStateResource.class);

    private static final String ENTITY_NAME = "usState";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UsStateRepository usStateRepository;

    public UsStateResource(UsStateRepository usStateRepository) {
        this.usStateRepository = usStateRepository;
    }

    /**
     * {@code POST  /us-states} : Create a new usState.
     *
     * @param usState the usState to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new usState, or with status {@code 400 (Bad Request)} if the usState has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/us-states")
    public ResponseEntity<UsState> createUsState(@Valid @RequestBody UsState usState) throws URISyntaxException {
        log.debug("REST request to save UsState : {}", usState);
        if (usState.getId() != null) {
            throw new BadRequestAlertException("A new usState cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UsState result = usStateRepository.save(usState);
        return ResponseEntity
            .created(new URI("/api/us-states/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /us-states/:id} : Updates an existing usState.
     *
     * @param id the id of the usState to save.
     * @param usState the usState to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated usState,
     * or with status {@code 400 (Bad Request)} if the usState is not valid,
     * or with status {@code 500 (Internal Server Error)} if the usState couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/us-states/{id}")
    public ResponseEntity<UsState> updateUsState(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UsState usState
    ) throws URISyntaxException {
        log.debug("REST request to update UsState : {}, {}", id, usState);
        if (usState.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, usState.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!usStateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UsState result = usStateRepository.save(usState);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, usState.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /us-states/:id} : Partial updates given fields of an existing usState, field will ignore if it is null
     *
     * @param id the id of the usState to save.
     * @param usState the usState to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated usState,
     * or with status {@code 400 (Bad Request)} if the usState is not valid,
     * or with status {@code 404 (Not Found)} if the usState is not found,
     * or with status {@code 500 (Internal Server Error)} if the usState couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/us-states/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<UsState> partialUpdateUsState(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UsState usState
    ) throws URISyntaxException {
        log.debug("REST request to partial update UsState partially : {}, {}", id, usState);
        if (usState.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, usState.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!usStateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UsState> result = usStateRepository
            .findById(usState.getId())
            .map(
                existingUsState -> {
                    if (usState.getName() != null) {
                        existingUsState.setName(usState.getName());
                    }
                    if (usState.getAbbreviation() != null) {
                        existingUsState.setAbbreviation(usState.getAbbreviation());
                    }

                    return existingUsState;
                }
            )
            .map(usStateRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, usState.getId().toString())
        );
    }

    /**
     * {@code GET  /us-states} : get all the usStates.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of usStates in body.
     */
    @GetMapping("/us-states")
    public List<UsState> getAllUsStates() {
        log.debug("REST request to get all UsStates");
        return usStateRepository.findAll();
    }

    /**
     * {@code GET  /us-states/:id} : get the "id" usState.
     *
     * @param id the id of the usState to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the usState, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/us-states/{id}")
    public ResponseEntity<UsState> getUsState(@PathVariable Long id) {
        log.debug("REST request to get UsState : {}", id);
        Optional<UsState> usState = usStateRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(usState);
    }

    /**
     * {@code DELETE  /us-states/:id} : delete the "id" usState.
     *
     * @param id the id of the usState to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/us-states/{id}")
    public ResponseEntity<Void> deleteUsState(@PathVariable Long id) {
        log.debug("REST request to delete UsState : {}", id);
        usStateRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
