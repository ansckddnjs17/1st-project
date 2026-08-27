package org.back.back.domain.product.initData;

import lombok.RequiredArgsConstructor;
import org.back.back.domain.product.entity.Product;
import org.back.back.domain.product.repository.ProductRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductInitData implements ApplicationRunner {
    private final ProductRepository productRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (productRepository.count() > 0) return;

        productRepository.save(new Product("Colombia Nariño", "Colombia Nariño", 5000));
        productRepository.save(new Product("Brazil Serra Do Caparaó", "Brazil Serra Do Caparaó", 5000));
        productRepository.save(new Product("Ethiopia Sidamo", "Ethiopia Sidamo", 5500));
        productRepository.save(new Product("Colombia Quindio", "Colombia Quindio", 6000));
    }
}
