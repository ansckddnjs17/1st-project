package org.back.back.domain.customer.service;

import lombok.RequiredArgsConstructor;
import org.back.back.domain.customer.entity.Customer;
import org.back.back.domain.customer.repository.CustomerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;

    @Transactional
    public Customer findOrCreate(
            String email,
            String address,
            String postcode
    ) {
        return customerRepository.findByEmail(email)
                .map(customer -> {
                    boolean differentAddress =
                            !customer.getAddress().equals(address);

                    boolean differentPostcode =
                            !customer.getPostcode().equals(postcode);

                    if (differentAddress || differentPostcode) {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "이미 등록된 이메일의 주소와 일치하지 않습니다."
                        );
                    }

                    return customer;
                })
                .orElseGet(() ->
                        customerRepository.save(
                                new Customer(email, address, postcode)
                        )
                );
    }
}
