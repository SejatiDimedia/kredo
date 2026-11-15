package com.kredo.backend.coa.repository;

import com.kredo.backend.coa.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface untuk operasi database pada tabel account.
 * Spring Data JPA otomatis meng-generate query SQL dari nama method-nya!
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    // Otomatis men-generate: SELECT * FROM account WHERE entity_id = ? ORDER BY
    // code ASC
    List<Account> findByEntityIdOrderByCodeAsc(Long entityId);

    // Otomatis men-generate: SELECT * FROM account WHERE entity_id = ? AND code = ?
    Optional<Account> findByEntityIdAndCode(Long entityId, String code);

    // Otomatis men-generate: SELECT COUNT(*) > 0 FROM account WHERE entity_id = ?
    // AND code = ?
    boolean existsByEntityIdAndCode(Long entityId, String code);
}