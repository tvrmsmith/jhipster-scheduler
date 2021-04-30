package com.propio.repository;

import com.propio.domain.Interpreter;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Interpreter entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InterpreterRepository extends JpaRepository<Interpreter, Long> {}
