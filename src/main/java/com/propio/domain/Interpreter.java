package com.propio.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Interpreter.
 */
@Entity
@Table(name = "interpreter")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Interpreter implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @JsonIgnoreProperties(value = { "state", "zipCode" }, allowSetters = true)
    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private Address address;

    @OneToMany(mappedBy = "interpreter")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "interpreter" }, allowSetters = true)
    private Set<Language> languages = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Interpreter id(Long id) {
        this.id = id;
        return this;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Interpreter firstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Interpreter lastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Address getAddress() {
        return this.address;
    }

    public Interpreter address(Address address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Set<Language> getLanguages() {
        return this.languages;
    }

    public Interpreter languages(Set<Language> languages) {
        this.setLanguages(languages);
        return this;
    }

    public Interpreter addLanguages(Language language) {
        this.languages.add(language);
        language.setInterpreter(this);
        return this;
    }

    public Interpreter removeLanguages(Language language) {
        this.languages.remove(language);
        language.setInterpreter(null);
        return this;
    }

    public void setLanguages(Set<Language> languages) {
        if (this.languages != null) {
            this.languages.forEach(i -> i.setInterpreter(null));
        }
        if (languages != null) {
            languages.forEach(i -> i.setInterpreter(this));
        }
        this.languages = languages;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Interpreter)) {
            return false;
        }
        return id != null && id.equals(((Interpreter) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Interpreter{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            "}";
    }
}
