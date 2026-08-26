package org.back.back.domain.customer.service;

import lombok.RequiredArgsConstructor;
import org.back.back.domain.customer.entity.Customer;
import org.back.back.domain.customer.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;

    @Transactional
    public Customer findOrCreate(String email, String address, String postcode){
        Optional<Customer> existingCustomer = customerRepository.findByEmail(email);
        if(existingCustomer.isPresent()){
            return existingCustomer.get();
        }
        Customer newCustomer = new Customer(email, address, postcode);
        return customerRepository.save(newCustomer);
    }
}
