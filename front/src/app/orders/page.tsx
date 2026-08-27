"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { getOrders, deleteOrder, updateOrder } from "@/lib/orderApi";
import type { Order } from "@/types/order";
import styles from "./orders.module.css";
import { getProducts } from "@/lib/productApi"
import { Product }from "@/types/product"

export default function OrdersPage() {
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => {});
  }, []);

  //배송중인지 확인하는 함수
  //배송일 이전일 시 true -> +/-, 삭제 활성화
  function isOrderEditable(order: Order){
    const [year, month, day] = order.deliveryDate.split("-").map(Number);
    const shippingStartsAt = new Date(year,month -1, day, 14, 0, 0);
    return new Date() < shippingStartsAt;
  }

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

  //수량 변경 함수
  //수량 1 미만은 금지
  // updateOrder로 PUT 하여 업데이트
  // 성공하면 해당 id의 order만 updated로 교체
  async function handleQuantityChange(order: Order, nextQuantity: number) {
  if (nextQuantity < 1 || busyId !== null) {
    return;
  }
  try {
    setBusyId(order.id);
    setError("");
    const updated = await updateOrder(order.id, nextQuantity);
    setOrders((current) =>
      current.map((item) => (item.id === order.id ? updated : item)),
    );
  } catch (caughtError) {
    setError(
      caughtError instanceof Error
        ? caughtError.message
        : "수량 변경 중 오류가 발생했습니다.",
    );
  } finally {
    setBusyId(null);
  }
}

  //삭제 함수
  async function  handleDelete(order: Order) {
    if (busyId !==null){
      return;
    }

    const confirmed = window.confirm("이 주문을 삭제하시겠습니까?");
    if(!confirmed) {
      return;
    }

    try {
      setBusyId(order.id);
      setError("");
      await deleteOrder(order.id);
      setOrders((current) => current.filter((item) => item.id !== order.id));
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "주문 삭제 중 오류가 발생했습니다.",
      );
    } finally {
      setBusyId(null);
    }
    
  }

  const totalQuantity = orders.reduce((sum, order) => sum + order.quantity, 0);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          Grids &amp; Circle
        </Link>
        <Link className={styles.myOrders} href="/">MY ORDERS</Link>
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
                      <strong>{products.find((product) => product.id === order.productId)?.name}</strong>
                    </div>
                    <div>
                      <span>금액</span>
                      <strong>{(order.price*order.quantity).toLocaleString("ko-KR")}원
                      </strong>
                    </div>
                    <div>
                      {/*수량 변경, 삭제 버튼 추가*/}
                      <span>수량</span>
                      {isOrderEditable(order) ? (
                        <div className={styles.quantityControls}>
                          <button
                            type="button"
                            disabled={busyId !== null || order.quantity <= 1}
                            onClick={() => handleQuantityChange(order, order.quantity -1)}
                          >
                            -
                          </button>
                          <strong>{order.quantity}</strong>
                          <button
                            type="button"
                            disabled={busyId !== null}
                            onClick={() => handleQuantityChange(order, order.quantity +1)}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className={styles.deleteButton}
                            disabled={busyId !== null}
                            onClick={() => handleDelete(order)}
                          >
                            삭제
                          </button>
                          </div>
                      ) : (
                        <strong>{order.quantity}개</strong>
                      )}
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
