package org.back.back.domain.product.service;

import lombok.RequiredArgsConstructor;
import org.back.back.domain.product.dto.ProductDto;
import org.back.back.domain.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<ProductDto> findAll() {
        return productRepository
                .findAll()
                .stream()
                .map(ProductDto::from)
                .toList();
    }
}
