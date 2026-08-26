"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { createOrder } from "@/lib/orderApi";
import { getProducts } from "@/lib/productApi";
import type { Product } from "@/types/product";
import styles from "./page.module.css";

type Cart = Record<number, number>;

const numberFormatter = new Intl.NumberFormat("ko-KR");

const productImages: Record<string, string> = {
  "Colombia Nariño": "/images/products/colombia-narino.png",
  "Brazil Serra Do Caparaó":
    "/images/products/brazil-serra-do-caparao.png",
  "Ethiopia Sidamo": "/images/products/ethiopia-sidamo.png",
  "Colombia Quindio": "/images/products/colombia-quindio.png",
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart>({});
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setError("");
        setProducts(await getProducts());
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "상품 목록을 불러오지 못했습니다.",
        );
      } finally {
        setLoadingProducts(false);
      }
    }

    void loadProducts();
  }, []);

  const selectedProducts = useMemo(
    () =>
      products
        .filter((product) => (cart[product.id] ?? 0) > 0)
        .map((product) => ({ ...product, quantity: cart[product.id] })),
    [cart, products],
  );

  const totalPrice = selectedProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  const totalQuantity = selectedProducts.reduce(
    (sum, product) => sum + product.quantity,
    0,
  );

  function changeQuantity(productId: number, amount: number) {
    setCart((currentCart) => {
      const nextQuantity = Math.max(0, (currentCart[productId] ?? 0) + amount);

      if (nextQuantity === 0) {
        const nextCart = { ...currentCart };
        delete nextCart[productId];
        return nextCart;
      }

      return { ...currentCart, [productId]: nextQuantity };
    });
    setSuccess("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedProducts.length === 0) {
      setError("주문할 상품을 한 개 이상 선택해주세요.");
      return;
    }

    if (!email.trim() || !address.trim() || !postcode.trim()) {
      setError("이메일, 주소, 우편번호를 모두 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const response = await createOrder({
        email: email.trim(),
        address: address.trim(),
        postcode: postcode.trim(),
        items: selectedProducts.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
        })),
      });

      setSuccess(`${response.data.length}개 상품의 주문이 접수되었습니다.`);
      setCart({});
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "주문 처리 중 오류가 발생했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p>COFFEE BEAN SHOP</p>
          <h1>Grids &amp; Circle</h1>
        </div>
        <Link href="/orders">내 주문 조회</Link>
      </header>

      <section className={styles.card}>
        <div className={styles.productsPanel}>
          <div className={styles.sectionHeading}>
            <div>
              <p>OUR SELECTION</p>
              <h2>상품 목록</h2>
            </div>
            <span>{products.length} PRODUCTS</span>
          </div>

          {loadingProducts && <p className={styles.notice}>상품을 불러오는 중입니다.</p>}

          {!loadingProducts && products.length === 0 && (
            <p className={styles.notice}>등록된 상품이 없습니다.</p>
          )}

          <ul className={styles.productList}>
            {products.map((product, index) => {
              const quantity = cart[product.id] ?? 0;

              return (
                <li key={product.id} className={styles.productItem}>
                  <div className={styles.productImage}>
                    <Image
                    src={productImages[product.description]}
                    alt={product.description}
                    width={110}
                    height={110}
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <span>ROASTED COFFEE</span>
                    <h3>{product.description}</h3>
                  </div>
                  <strong className={styles.price}>
                    {numberFormatter.format(product.price)}원
                  </strong>
                  <div className={styles.quantityControl}>
                    <button
                      type="button"
                      onClick={() => changeQuantity(product.id, -1)}
                      disabled={quantity === 0}
                      aria-label={`${product.name} 수량 줄이기`}
                    >
                      −
                    </button>
                    <span>{quantity}</span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(product.id, 1)}
                      aria-label={`${product.name} 수량 늘리기`}
                    >
                      +
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className={styles.summaryPanel}>
          <div className={styles.summaryHeading}>
            <div>
              <p>YOUR ORDER</p>
              <h2>주문서</h2>
            </div>
            <span>{totalQuantity}개</span>
          </div>

          <div className={styles.summaryItems}>
            {selectedProducts.length === 0 ? (
              <p className={styles.emptyCart}>왼쪽에서 상품을 선택해주세요.</p>
            ) : (
              selectedProducts.map((product) => (
                <div key={product.id} className={styles.summaryItem}>
                  <div>
                    <strong>{product.description}</strong>
                    <span>{product.quantity}개</span>
                  </div>
                  <span>
                    {numberFormatter.format(product.price * product.quantity,
                    )}원
                  </span>
                </div>
              ))
            )}
          </div>

          <form className={styles.orderForm} onSubmit={handleSubmit}>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="coffee@example.com"
              autoComplete="email"
            />

            <label htmlFor="address">주소</label>
            <input
              id="address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="서울시 광진구..."
              autoComplete="street-address"
            />

            <label htmlFor="postcode">우편번호</label>
            <input
              id="postcode"
              value={postcode}
              onChange={(event) => setPostcode(event.target.value)}
              placeholder="05000"
              autoComplete="postal-code"
            />

            <p className={styles.deliveryNotice}>
              당일 오후 2시 이후 주문은 다음 날 주문 건으로 처리됩니다.
            </p>

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <div className={styles.total}>
              <span>총금액</span>
              <strong>{numberFormatter.format(totalPrice)}원</strong>
            </div>

            <button className={styles.orderButton} type="submit" disabled={submitting}>
              {submitting ? "주문 처리 중..." : "주문하기"}
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}
