package com.propio.web.rest;

import com.propio.domain.ZipCode;
import com.propio.repository.ZipCodeRepository;
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
 * REST controller for managing {@link com.propio.domain.ZipCode}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ZipCodeResource {

    private final Logger log = LoggerFactory.getLogger(ZipCodeResource.class);

    private static final String ENTITY_NAME = "zipCode";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ZipCodeRepository zipCodeRepository;

    public ZipCodeResource(ZipCodeRepository zipCodeRepository) {
        this.zipCodeRepository = zipCodeRepository;
    }

    /**
     * {@code POST  /zip-codes} : Create a new zipCode.
     *
     * @param zipCode the zipCode to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new zipCode, or with status {@code 400 (Bad Request)} if the zipCode has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/zip-codes")
    public ResponseEntity<ZipCode> createZipCode(@Valid @RequestBody ZipCode zipCode) throws URISyntaxException {
        log.debug("REST request to save ZipCode : {}", zipCode);
        if (zipCode.getId() != null) {
            throw new BadRequestAlertException("A new zipCode cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ZipCode result = zipCodeRepository.save(zipCode);
        return ResponseEntity
            .created(new URI("/api/zip-codes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /zip-codes/:id} : Updates an existing zipCode.
     *
     * @param id the id of the zipCode to save.
     * @param zipCode the zipCode to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated zipCode,
     * or with status {@code 400 (Bad Request)} if the zipCode is not valid,
     * or with status {@code 500 (Internal Server Error)} if the zipCode couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/zip-codes/{id}")
    public ResponseEntity<ZipCode> updateZipCode(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ZipCode zipCode
    ) throws URISyntaxException {
        log.debug("REST request to update ZipCode : {}, {}", id, zipCode);
        if (zipCode.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, zipCode.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!zipCodeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ZipCode result = zipCodeRepository.save(zipCode);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, zipCode.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /zip-codes/:id} : Partial updates given fields of an existing zipCode, field will ignore if it is null
     *
     * @param id the id of the zipCode to save.
     * @param zipCode the zipCode to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated zipCode,
     * or with status {@code 400 (Bad Request)} if the zipCode is not valid,
     * or with status {@code 404 (Not Found)} if the zipCode is not found,
     * or with status {@code 500 (Internal Server Error)} if the zipCode couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/zip-codes/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ZipCode> partialUpdateZipCode(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ZipCode zipCode
    ) throws URISyntaxException {
        log.debug("REST request to partial update ZipCode partially : {}, {}", id, zipCode);
        if (zipCode.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, zipCode.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!zipCodeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ZipCode> result = zipCodeRepository
            .findById(zipCode.getId())
            .map(
                existingZipCode -> {
                    if (zipCode.getValue() != null) {
                        existingZipCode.setValue(zipCode.getValue());
                    }

                    return existingZipCode;
                }
            )
            .map(zipCodeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, zipCode.getId().toString())
        );
    }

    /**
     * {@code GET  /zip-codes} : get all the zipCodes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of zipCodes in body.
     */
    @GetMapping("/zip-codes")
    public List<ZipCode> getAllZipCodes() {
        log.debug("REST request to get all ZipCodes");
        return zipCodeRepository.findAll();
    }

    /**
     * {@code GET  /zip-codes/:id} : get the "id" zipCode.
     *
     * @param id the id of the zipCode to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the zipCode, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/zip-codes/{id}")
    public ResponseEntity<ZipCode> getZipCode(@PathVariable Long id) {
        log.debug("REST request to get ZipCode : {}", id);
        Optional<ZipCode> zipCode = zipCodeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(zipCode);
    }

    /**
     * {@code DELETE  /zip-codes/:id} : delete the "id" zipCode.
     *
     * @param id the id of the zipCode to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/zip-codes/{id}")
    public ResponseEntity<Void> deleteZipCode(@PathVariable Long id) {
        log.debug("REST request to delete ZipCode : {}", id);
        zipCodeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
