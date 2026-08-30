"use client";

import { useEffect, useMemo, useState } from "react";
import { getGroupOrders } from "@/lib/adminApi";
import { GroupOrder } from "@/types/admin";

import styles from "./admin.module.css";

type SortKey = "deliveryDate" | "quantity" | "amount";

export default function AdminPage() {
  const [orders, setOrders] = useState<GroupOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const [sortKey, setSortKey] = useState<SortKey>("deliveryDate");
  const [sortAsc, setSortAsc] = useState(true);

  /**
   * 그룹 주문 조회
   */
  const fetchOrders = async (customerId?: string, date?: string) => {
    try {
      setLoading(true);
      setError("");

      const data = await getGroupOrders(customerId, date);
      setOrders(data);
    } catch (error) {
      console.error("주문 조회 실패:", error);
      setError(
        error instanceof Error
          ? error.message
          : "주문 데이터를 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * 최초 페이지 진입 및 날짜/고객 변경 시 주문 조회
   */
  useEffect(() => {
    fetchOrders(selectedCustomer, deliveryDate);
  }, [selectedCustomer, deliveryDate]);

  /**
 * 관리자 페이지에서 SSE를 구독, 서버가 주문 알림을 보내면 팝업 띄움
 */
  useEffect(() => {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
  const es = new EventSource(`${base}/api/v1/admin/order-stream`);
  es.onmessage = (e) => {
    window.alert(e.data);
  };
  return () => {
    es.close();
  };
}, []);

  /**
   * 이메일 클릭 시 해당 고객 필터링
   */
  const handleCustomerClick = (email: string) => {
    if (selectedCustomer === email) {
      setSelectedCustomer(""); // 이미 선택된 고객이면 필터 해제
    } else {
      setSelectedCustomer(email);
    }
  };

  /**
   * 주문의 전체 상품 수량
   */
  const getTotalQuantity = (order: GroupOrder): number => {
    return order.productItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  /**
   * 주문의 전체 금액
   */
  const getTotalAmount = (order: GroupOrder): number => {
    return order.productItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  /**
   * 검색 + 날짜 필터 + 고객 필터 + 정렬
   */
  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const result = orders.filter((order) => {
      // 1. 선택된 고객 필터링 (클라이언트 측 보완)
      const matchesCustomer =
        selectedCustomer === "" ||
        order.email.toLowerCase() === selectedCustomer.toLowerCase();

      // 2. 검색어 필터링
      const matchesSearch =
        keyword === "" ||
        order.email.toLowerCase().includes(keyword) ||
        order.address.toLowerCase().includes(keyword) ||
        order.postCode.toLowerCase().includes(keyword) ||
        order.productItems.some((item) =>
          item.productName.toLowerCase().includes(keyword)
        );

      // 3. 배송일 필터링
      const matchesDate =
        deliveryDate === "" || order.deliveryDate === deliveryDate;

      return matchesCustomer && matchesSearch && matchesDate;
    });

    result.sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case "deliveryDate":
          comparison = a.deliveryDate.localeCompare(b.deliveryDate);
          break;
        case "quantity":
          comparison = getTotalQuantity(a) - getTotalQuantity(b);
          break;
        case "amount":
          comparison = getTotalAmount(a) - getTotalAmount(b);
          break;
      }

      return sortAsc ? comparison : -comparison;
    });

    return result;
  }, [orders, search, deliveryDate, selectedCustomer, sortKey, sortAsc]);

  const totalQuantity = orders.reduce(
    (sum, order) => sum + getTotalQuantity(order),
    0
  );

  const totalAmount = orders.reduce(
    (sum, order) => sum + getTotalAmount(order),
    0
  );

  const uniqueCustomers = new Set(orders.map((order) => order.email)).size;

  const changeSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
      return;
    }
    setSortKey(key);
    setSortAsc(true);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR") + "원";
  };

  const resetFilters = () => {
    setSearch("");
    setDeliveryDate("");
    setSelectedCustomer("");
  };

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>G</div>
          <div>
            <div className={styles.logoTitle}>Grids & Circle</div>
            <div className={styles.logoSubtitle}>ADMIN</div>
          </div>
        </div>

        <nav className={styles.navigation}>
          <div className={styles.navSection}>OVERVIEW</div>
          <button className={`${styles.navItem} ${styles.active}`}>
            <span className={styles.navIcon}>▦</span>
            Dashboard
          </button>
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.adminProfile}>
            <div className={styles.avatar}>A</div>
            <div>
              <div className={styles.adminName}>Administrator</div>
              <div className={styles.adminRole}>Manager</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <div className={styles.breadcrumb}>ADMIN / ORDERS</div>
            <h1 className={styles.pageTitle}>Group Orders</h1>
            <p className={styles.pageDescription}>
              그룹 주문 내역을 관리하고 확인합니다.
            </p>
          </div>

          <button
            className={styles.refreshButton}
            onClick={() => fetchOrders(selectedCustomer, deliveryDate)}
            disabled={loading}
          >
            <span className={styles.refreshIcon}>↻</span>
            새로고침
          </button>
        </header>

        {/* STATS */}
        <section className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span>전체 주문</span>
              <span className={styles.statIcon}>▣</span>
            </div>
            <div className={styles.statValue}>
              {orders.length}
              <span>건</span>
            </div>
            <div className={styles.statDescription}>전체 그룹 주문</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span>상품 수량</span>
              <span className={styles.statIcon}>□</span>
            </div>
            <div className={styles.statValue}>
              {totalQuantity.toLocaleString()}
              <span>개</span>
            </div>
            <div className={styles.statDescription}>주문된 전체 상품</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span>주문 금액</span>
              <span className={styles.statIcon}>₩</span>
            </div>
            <div className={styles.statValue}>
              {totalAmount.toLocaleString()}
              <span>원</span>
            </div>
            <div className={styles.statDescription}>전체 주문 금액</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span>고객</span>
              <span className={styles.statIcon}>○</span>
            </div>
            <div className={styles.statValue}>
              {uniqueCustomers}
              <span>명</span>
            </div>
            <div className={styles.statDescription}>중복 제외 고객 수</div>
          </div>
        </section>

        {/* ORDER LIST */}
        <section className={styles.orderSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Order List</h2>
              <p>총 {filteredOrders.length}개의 주문</p>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>⌕</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="이메일, 상품명, 주소 검색"
              />
            </div>

            <input
              type="date"
              className={styles.dateInput}
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />

            {(search || deliveryDate || selectedCustomer) && (
              <button className={styles.resetButton} onClick={resetFilters}>
                초기화
              </button>
            )}
          </div>

          {/* 고객 선택 상태 태그 */}
          {selectedCustomer && (
            <div
              style={{
                marginBottom: "16px",
                padding: "6px 12px",
                backgroundColor: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "6px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                color: "#1d4ed8",
              }}
            >
              <span>
                선택된 고객: <strong>{selectedCustomer}</strong>
              </span>
              <button
                onClick={() => setSelectedCustomer("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1d4ed8",
                  cursor: "pointer",
                  fontWeight: "bold",
                  padding: "0 2px",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              주문 데이터를 불러오는 중...
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className={styles.error}>
              <div className={styles.errorIcon}>!</div>
              <div>
                <strong>데이터를 불러오지 못했습니다.</strong>
                <p>{error}</p>
              </div>
              <button
                className={styles.retryButton}
                onClick={() => fetchOrders(selectedCustomer, deliveryDate)}
              >
                다시 시도
              </button>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && filteredOrders.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>□</div>
              <h3>주문이 없습니다.</h3>
              <p>검색 조건에 해당하는 주문을 찾을 수 없습니다.</p>
            </div>
          )}

          {/* TABLE */}
          {!loading && !error && filteredOrders.length > 0 && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>고객 (이메일 클릭 시 필터)</th>
                    <th>상품</th>
                    <th>
                      <button
                        className={styles.sortButton}
                        onClick={() => changeSort("quantity")}
                      >
                        수량 {sortKey === "quantity" && (sortAsc ? " ↑" : " ↓")}
                      </button>
                    </th>
                    <th>
                      <button
                        className={styles.sortButton}
                        onClick={() => changeSort("amount")}
                      >
                        금액 {sortKey === "amount" && (sortAsc ? " ↑" : " ↓")}
                      </button>
                    </th>
                    <th>배송지</th>
                    <th>
                      <button
                        className={styles.sortButton}
                        onClick={() => changeSort("deliveryDate")}
                      >
                        배송일 {sortKey === "deliveryDate" && (sortAsc ? " ↑" : " ↓")}
                      </button>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order, index) => {
                    const quantity = getTotalQuantity(order);
                    const amount = getTotalAmount(order);
                    const isSelected = selectedCustomer === order.email;

                    return (
                      <tr key={`${order.email}-${index}`}>
                        <td>
                          <span className={styles.orderNumber}>
                            {(index + 1).toString().padStart(2, "0")}
                          </span>
                        </td>

                        {/* Customer */}
                        <td>
                          <div className={styles.customer}>
                            <div className={styles.customerAvatar}>
                              {order.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div
                                onClick={() => handleCustomerClick(order.email)}
                                title="클릭하여 이 고객만 보기"
                                style={{
                                  cursor: "pointer",
                                  fontWeight: isSelected ? "bold" : "500",
                                  color: isSelected ? "#2563eb" : "#0f172a",
                                  textDecoration: "underline",
                                  textUnderlineOffset: "3px",
                                }}
                              >
                                {order.email}
                              </div>
                              <div className={styles.postCode}>
                                {order.postCode
                                  ? `우편번호 ${order.postCode}`
                                  : "주소 미등록"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Products */}
                        <td>
                          <div className={styles.products}>
                            {order.productItems.map((item) => (
                              <div className={styles.product} key={item.productId}>
                                <span className={styles.productName}>
                                  {item.productName}
                                </span>
                                <span className={styles.productQuantity}>
                                  × {item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td>
                          <span className={styles.quantity}>{quantity}</span>
                        </td>

                        <td>
                          <strong className={styles.amount}>
                            {formatPrice(amount)}
                          </strong>
                        </td>

                        <td>
                          <div className={styles.address}>
                            {order.address || (
                              <span className={styles.noAddress}>주소 없음</span>
                            )}
                          </div>
                        </td>

                        <td>
                          <span className={styles.deliveryDate}>
                            {order.deliveryDate}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
