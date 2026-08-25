package org.back.back.domain.product.dto;

import org.back.back.domain.product.entity.Product;

public record ProductDto(Long id, String name, String description, int price) {
    public static ProductDto from(Product product) {
        return new ProductDto(product.getId(), product.getName(), product.getDescription(), product.getPrice());
    }
}
