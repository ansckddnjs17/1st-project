package org.back.back.domain.admin.repository;

import org.back.back.domain.admin.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin,Integer> {
}
