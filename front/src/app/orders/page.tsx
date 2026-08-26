"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { getOrders } from "@/lib/orderApi";
import type { Order } from "@/types/order";
import styles from "./orders.module.css";

export default function OrdersPage() {
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("주문할 때 입력한 이메일을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await getOrders(normalizedEmail, date || undefined);
      setOrders(result);
      setSearched(true);
    } catch (caughtError) {
      setOrders([]);
      setSearched(true);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "주문 조회 중 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }

  const totalQuantity = orders.reduce((sum, order) => sum + order.quantity, 0);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          Grids &amp; Circle
        </Link>
        <span>MY ORDERS</span>
      </header>

      <section className={styles.card}>
        <aside className={styles.searchPanel}>
          <p className={styles.eyebrow}>ORDER LOOKUP</p>
          <h1>주문 내역 조회</h1>
          <p className={styles.description}>
            주문할 때 사용한 이메일로 주문 내역을 확인해보세요.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="coffee@example.com"
              autoComplete="email"
            />

            <label htmlFor="date">배송일</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <p className={styles.hint}>배송일을 비우면 전체 주문을 조회합니다.</p>

            <button type="submit" disabled={loading}>
              {loading ? "조회 중..." : "주문 조회하기"}
            </button>
          </form>

          {error && <p className={styles.error}>{error}</p>}
        </aside>

        <div className={styles.resultPanel}>
          <div className={styles.resultHeader}>
            <div>
              <p className={styles.eyebrow}>ORDER HISTORY</p>
              <h2>주문 목록</h2>
            </div>
            <div className={styles.count}>
              <strong>{orders.length}</strong>
              <span>건 · 총 {totalQuantity}개</span>
            </div>
          </div>

          {!searched && !loading && (
            <div className={styles.empty}>
              <span>01</span>
              <h3>이메일을 입력해주세요</h3>
              <p>조회 결과가 이곳에 표시됩니다.</p>
            </div>
          )}

          {searched && !loading && orders.length === 0 && !error && (
            <div className={styles.empty}>
              <span>00</span>
              <h3>주문 내역이 없습니다</h3>
              <p>이메일이나 배송일을 다시 확인해주세요.</p>
            </div>
          )}

          {orders.length > 0 && (
            <ul className={styles.orderList}>
              {orders.map((order) => (
                <li key={order.id} className={styles.orderItem}>
                  <div className={styles.orderNumber}>
                    <span>ORDER</span>
                    <strong>#{String(order.id).padStart(4, "0")}</strong>
                  </div>
                  <div className={styles.orderInfo}>
                    <div>
                      <span>상품</span>
                      <strong>상품 #{order.productId}</strong>
                    </div>
                    <div>
                      <span>수량</span>
                      <strong>{order.quantity}개</strong>
                    </div>
                    <div>
                      <span>배송일</span>
                      <strong>{order.deliveryDate}</strong>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
