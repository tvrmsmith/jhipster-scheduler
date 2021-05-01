package com.propio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.propio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InterpreterTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Interpreter.class);
        Interpreter interpreter1 = new Interpreter();
        interpreter1.setId(1L);
        Interpreter interpreter2 = new Interpreter();
        interpreter2.setId(interpreter1.getId());
        assertThat(interpreter1).isEqualTo(interpreter2);
        interpreter2.setId(2L);
        assertThat(interpreter1).isNotEqualTo(interpreter2);
        interpreter1.setId(null);
        assertThat(interpreter1).isNotEqualTo(interpreter2);
    }
}
