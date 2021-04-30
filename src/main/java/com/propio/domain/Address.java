package com.propio.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Address.
 */
@Entity
@Table(name = "address")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Address implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "line_1", nullable = false)
    private String line1;

    @Column(name = "line_2")
    private String line2;

    @NotNull
    @Column(name = "city", nullable = false)
    private String city;

    @ManyToOne(optional = false)
    @NotNull
    private UsState state;

    @ManyToOne(optional = false)
    @NotNull
    private ZipCode zipCode;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Address id(Long id) {
        this.id = id;
        return this;
    }

    public String getLine1() {
        return this.line1;
    }

    public Address line1(String line1) {
        this.line1 = line1;
        return this;
    }

    public void setLine1(String line1) {
        this.line1 = line1;
    }

    public String getLine2() {
        return this.line2;
    }

    public Address line2(String line2) {
        this.line2 = line2;
        return this;
    }

    public void setLine2(String line2) {
        this.line2 = line2;
    }

    public String getCity() {
        return this.city;
    }

    public Address city(String city) {
        this.city = city;
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public UsState getState() {
        return this.state;
    }

    public Address state(UsState usState) {
        this.setState(usState);
        return this;
    }

    public void setState(UsState usState) {
        this.state = usState;
    }

    public ZipCode getZipCode() {
        return this.zipCode;
    }

    public Address zipCode(ZipCode zipCode) {
        this.setZipCode(zipCode);
        return this;
    }

    public void setZipCode(ZipCode zipCode) {
        this.zipCode = zipCode;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Address)) {
            return false;
        }
        return id != null && id.equals(((Address) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Address{" +
            "id=" + getId() +
            ", line1='" + getLine1() + "'" +
            ", line2='" + getLine2() + "'" +
            ", city='" + getCity() + "'" +
            "}";
    }
}
