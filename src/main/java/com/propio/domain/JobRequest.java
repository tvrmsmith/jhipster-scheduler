package com.propio.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A JobRequest.
 */
@Entity
@Table(name = "job_request")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class JobRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @NotNull
    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @JsonIgnoreProperties(value = { "address", "languages" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Interpreter assignedInterpreter;

    @JsonIgnoreProperties(value = { "interpreter" }, allowSetters = true)
    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private Language language;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "address", "organization" }, allowSetters = true)
    private Location location;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public JobRequest id(Long id) {
        this.id = id;
        return this;
    }

    public Instant getStartTime() {
        return this.startTime;
    }

    public JobRequest startTime(Instant startTime) {
        this.startTime = startTime;
        return this;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return this.endTime;
    }

    public JobRequest endTime(Instant endTime) {
        this.endTime = endTime;
        return this;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Interpreter getAssignedInterpreter() {
        return this.assignedInterpreter;
    }

    public JobRequest assignedInterpreter(Interpreter interpreter) {
        this.setAssignedInterpreter(interpreter);
        return this;
    }

    public void setAssignedInterpreter(Interpreter interpreter) {
        this.assignedInterpreter = interpreter;
    }

    public Language getLanguage() {
        return this.language;
    }

    public JobRequest language(Language language) {
        this.setLanguage(language);
        return this;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public Location getLocation() {
        return this.location;
    }

    public JobRequest location(Location location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof JobRequest)) {
            return false;
        }
        return id != null && id.equals(((JobRequest) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "JobRequest{" +
            "id=" + getId() +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            "}";
    }
}
