package com.kredo.backend.auth.repository;

import com.kredo.backend.auth.domain.UserEntityRole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserEntityRoleRepository extends JpaRepository<UserEntityRole, Long> {
    List<UserEntityRole> findByUserId(Long userId);
    Optional<UserEntityRole> findByUserIdAndEntityId(Long userId, Long entityId);
}
