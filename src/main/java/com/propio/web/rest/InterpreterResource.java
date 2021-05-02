package com.propio.web.rest;

import com.propio.domain.Interpreter;
import com.propio.repository.InterpreterRepository;
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
 * REST controller for managing {@link com.propio.domain.Interpreter}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class InterpreterResource {

    private final Logger log = LoggerFactory.getLogger(InterpreterResource.class);

    private static final String ENTITY_NAME = "interpreter";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InterpreterRepository interpreterRepository;

    public InterpreterResource(InterpreterRepository interpreterRepository) {
        this.interpreterRepository = interpreterRepository;
    }

    /**
     * {@code POST  /interpreters} : Create a new interpreter.
     *
     * @param interpreter the interpreter to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new interpreter, or with status {@code 400 (Bad Request)} if the interpreter has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/interpreters")
    public ResponseEntity<Interpreter> createInterpreter(@Valid @RequestBody Interpreter interpreter) throws URISyntaxException {
        log.debug("REST request to save Interpreter : {}", interpreter);
        if (interpreter.getId() != null) {
            throw new BadRequestAlertException("A new interpreter cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Interpreter result = interpreterRepository.save(interpreter);
        return ResponseEntity
            .created(new URI("/api/interpreters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /interpreters/:id} : Updates an existing interpreter.
     *
     * @param id the id of the interpreter to save.
     * @param interpreter the interpreter to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated interpreter,
     * or with status {@code 400 (Bad Request)} if the interpreter is not valid,
     * or with status {@code 500 (Internal Server Error)} if the interpreter couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/interpreters/{id}")
    public ResponseEntity<Interpreter> updateInterpreter(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Interpreter interpreter
    ) throws URISyntaxException {
        log.debug("REST request to update Interpreter : {}, {}", id, interpreter);
        if (interpreter.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, interpreter.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!interpreterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Interpreter result = interpreterRepository.save(interpreter);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, interpreter.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /interpreters/:id} : Partial updates given fields of an existing interpreter, field will ignore if it is null
     *
     * @param id the id of the interpreter to save.
     * @param interpreter the interpreter to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated interpreter,
     * or with status {@code 400 (Bad Request)} if the interpreter is not valid,
     * or with status {@code 404 (Not Found)} if the interpreter is not found,
     * or with status {@code 500 (Internal Server Error)} if the interpreter couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/interpreters/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Interpreter> partialUpdateInterpreter(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Interpreter interpreter
    ) throws URISyntaxException {
        log.debug("REST request to partial update Interpreter partially : {}, {}", id, interpreter);
        if (interpreter.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, interpreter.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!interpreterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Interpreter> result = interpreterRepository
            .findById(interpreter.getId())
            .map(
                existingInterpreter -> {
                    if (interpreter.getFirstName() != null) {
                        existingInterpreter.setFirstName(interpreter.getFirstName());
                    }
                    if (interpreter.getLastName() != null) {
                        existingInterpreter.setLastName(interpreter.getLastName());
                    }

                    return existingInterpreter;
                }
            )
            .map(interpreterRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, interpreter.getId().toString())
        );
    }

    /**
     * {@code GET  /interpreters} : get all the interpreters.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of interpreters in body.
     */
    @GetMapping("/interpreters")
    public List<Interpreter> getAllInterpreters() {
        log.debug("REST request to get all Interpreters");
        return interpreterRepository.findAll();
    }

    /**
     * {@code GET  /interpreters/:id} : get the "id" interpreter.
     *
     * @param id the id of the interpreter to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the interpreter, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/interpreters/{id}")
    public ResponseEntity<Interpreter> getInterpreter(@PathVariable Long id) {
        log.debug("REST request to get Interpreter : {}", id);
        Optional<Interpreter> interpreter = interpreterRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(interpreter);
    }

    /**
     * {@code DELETE  /interpreters/:id} : delete the "id" interpreter.
     *
     * @param id the id of the interpreter to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/interpreters/{id}")
    public ResponseEntity<Void> deleteInterpreter(@PathVariable Long id) {
        log.debug("REST request to delete Interpreter : {}", id);
        interpreterRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
