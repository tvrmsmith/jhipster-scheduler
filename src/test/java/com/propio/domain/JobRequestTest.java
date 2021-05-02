package com.propio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.propio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class JobRequestTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(JobRequest.class);
        JobRequest jobRequest1 = new JobRequest();
        jobRequest1.setId(1L);
        JobRequest jobRequest2 = new JobRequest();
        jobRequest2.setId(jobRequest1.getId());
        assertThat(jobRequest1).isEqualTo(jobRequest2);
        jobRequest2.setId(2L);
        assertThat(jobRequest1).isNotEqualTo(jobRequest2);
        jobRequest1.setId(null);
        assertThat(jobRequest1).isNotEqualTo(jobRequest2);
    }
}
