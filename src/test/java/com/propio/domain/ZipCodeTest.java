package com.propio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.propio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ZipCodeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ZipCode.class);
        ZipCode zipCode1 = new ZipCode();
        zipCode1.setId(1L);
        ZipCode zipCode2 = new ZipCode();
        zipCode2.setId(zipCode1.getId());
        assertThat(zipCode1).isEqualTo(zipCode2);
        zipCode2.setId(2L);
        assertThat(zipCode1).isNotEqualTo(zipCode2);
        zipCode1.setId(null);
        assertThat(zipCode1).isNotEqualTo(zipCode2);
    }
}
