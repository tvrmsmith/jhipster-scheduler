package com.propio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.propio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UsStateTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UsState.class);
        UsState usState1 = new UsState();
        usState1.setId(1L);
        UsState usState2 = new UsState();
        usState2.setId(usState1.getId());
        assertThat(usState1).isEqualTo(usState2);
        usState2.setId(2L);
        assertThat(usState1).isNotEqualTo(usState2);
        usState1.setId(null);
        assertThat(usState1).isNotEqualTo(usState2);
    }
}
