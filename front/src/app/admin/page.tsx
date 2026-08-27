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

  const [sortKey, setSortKey] =
    useState<SortKey>("deliveryDate");

  const [sortAsc, setSortAsc] = useState(true);

  /**
   * 그룹 주문 조회
   */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getGroupOrders();

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
   * 최초 페이지 진입 시 주문 조회
   */
  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * 주문의 전체 상품 수량
   */
  const getTotalQuantity = (
    order: GroupOrder
  ): number => {
    return order.productItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  };

  /**
   * 주문의 전체 금액
   */
  const getTotalAmount = (
    order: GroupOrder
  ): number => {
    return order.productItems.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );
  };

  /**
   * 검색 + 날짜 필터 + 정렬
   */
  const filteredOrders = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    const result = orders.filter((order) => {
      /**
       * 검색 조건
       *
       * 이메일
       * 주소
       * 우편번호
       * 상품명
       */
      const matchesSearch =
        keyword === "" ||
        order.email
          .toLowerCase()
          .includes(keyword) ||
        order.address
          .toLowerCase()
          .includes(keyword) ||
        order.postCode
          .toLowerCase()
          .includes(keyword) ||
        order.productItems.some((item) =>
          item.productName
            .toLowerCase()
            .includes(keyword)
        );

      /**
       * 배송일 필터
       */
      const matchesDate =
        deliveryDate === "" ||
        order.deliveryDate === deliveryDate;

      return (
        matchesSearch &&
        matchesDate
      );
    });

    /**
     * 정렬
     */
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case "deliveryDate":
          comparison =
            a.deliveryDate.localeCompare(
              b.deliveryDate
            );
          break;

        case "quantity":
          comparison =
            getTotalQuantity(a) -
            getTotalQuantity(b);
          break;

        case "amount":
          comparison =
            getTotalAmount(a) -
            getTotalAmount(b);
          break;
      }

      return sortAsc
        ? comparison
        : -comparison;
    });

    return result;
  }, [
    orders,
    search,
    deliveryDate,
    sortKey,
    sortAsc,
  ]);

  /**
   * 전체 상품 수량
   */
  const totalQuantity = orders.reduce(
    (sum, order) =>
      sum + getTotalQuantity(order),
    0
  );

  /**
   * 전체 주문 금액
   */
  const totalAmount = orders.reduce(
    (sum, order) =>
      sum + getTotalAmount(order),
    0
  );

  /**
   * 고객 수
   */
  const uniqueCustomers = new Set(
    orders.map((order) => order.email)
  ).size;

  /**
   * 정렬 변경
   */
  const changeSort = (
    key: SortKey
  ) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
      return;
    }

    setSortKey(key);
    setSortAsc(true);
  };

  /**
   * 금액 포맷
   */
  const formatPrice = (
    price: number
  ) => {
    return (
      price.toLocaleString("ko-KR") +
      "원"
    );
  };

  /**
   * 검색 / 날짜 초기화
   */
  const resetFilters = () => {
    setSearch("");
    setDeliveryDate("");
  };

  return (
    <div className={styles.container}>
      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside className={styles.sidebar}>
        {/* Logo */}

        <div className={styles.logo}>
          <div className={styles.logoMark}>
            G
          </div>

          <div>
            <div className={styles.logoTitle}>
              Grids & Circle
            </div>

            <div className={styles.logoSubtitle}>
              ADMIN
            </div>
          </div>
        </div>

        {/* Navigation */}

        <nav className={styles.navigation}>
          <div className={styles.navSection}>
            OVERVIEW
          </div>

          <button
            className={`${styles.navItem} ${styles.active}`}
          >
            <span className={styles.navIcon}>
              ▦
            </span>

            Dashboard
          </button>

          {/* <button className={styles.navItem}>
            <span className={styles.navIcon}>
              □
            </span>

            Orders
          </button>

          <button className={styles.navItem}>
            <span className={styles.navIcon}>
              ◇
            </span>

            Products
          </button>

          <button className={styles.navItem}>
            <span className={styles.navIcon}>
              ○
            </span>

            Customers
          </button>

          <div className={styles.navSection}>
            MANAGEMENT
          </div>

          <button className={styles.navItem}>
            <span className={styles.navIcon}>
              ⚙
            </span>

            Settings
          </button> */}
        </nav>

        {/* Admin */}

        <div className={styles.sidebarBottom}>
          <div className={styles.adminProfile}>
            <div className={styles.avatar}>
              A
            </div>

            <div>
              <div className={styles.adminName}>
                Administrator
              </div>

              <div className={styles.adminRole}>
                Manager
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================
          MAIN
      ======================================== */}

      <main className={styles.main}>
        {/* Header */}

        <header className={styles.header}>
          <div>
            <div className={styles.breadcrumb}>
              ADMIN / ORDERS
            </div>

            <h1 className={styles.pageTitle}>
              Group Orders
            </h1>

            <p className={styles.pageDescription}>
              그룹 주문 내역을 관리하고 확인합니다.
            </p>
          </div>

          <button
            className={styles.refreshButton}
            onClick={fetchOrders}
            disabled={loading}
          >
            <span className={styles.refreshIcon}>
              ↻
            </span>

            새로고침
          </button>
        </header>

        {/* ========================================
            STATISTICS
        ======================================== */}

        <section className={styles.stats}>
          {/* 전체 주문 */}

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span>전체 주문</span>

              <span className={styles.statIcon}>
                ▣
              </span>
            </div>

            <div className={styles.statValue}>
              {orders.length}

              <span>건</span>
            </div>

            <div className={styles.statDescription}>
              전체 그룹 주문
            </div>
          </div>

          {/* 상품 수량 */}

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span>상품 수량</span>

              <span className={styles.statIcon}>
                □
              </span>
            </div>

            <div className={styles.statValue}>
              {totalQuantity.toLocaleString()}

              <span>개</span>
            </div>

            <div className={styles.statDescription}>
              주문된 전체 상품
            </div>
          </div>

          {/* 주문 금액 */}

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span>주문 금액</span>

              <span className={styles.statIcon}>
                ₩
              </span>
            </div>

            <div className={styles.statValue}>
              {totalAmount.toLocaleString()}

              <span>원</span>
            </div>

            <div className={styles.statDescription}>
              전체 주문 금액
            </div>
          </div>

          {/* 고객 */}

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span>고객</span>

              <span className={styles.statIcon}>
                ○
              </span>
            </div>

            <div className={styles.statValue}>
              {uniqueCustomers}

              <span>명</span>
            </div>

            <div className={styles.statDescription}>
              중복 제외 고객 수
            </div>
          </div>
        </section>

        {/* ========================================
            ORDER LIST
        ======================================== */}

        <section className={styles.orderSection}>
          {/* Section Header */}

          <div className={styles.sectionHeader}>
            <div>
              <h2>
                Order List
              </h2>

              <p>
                총 {filteredOrders.length}개의 주문
              </p>
            </div>
          </div>

          {/* ========================================
              FILTER
          ======================================== */}

          <div className={styles.filters}>
            {/* Search */}

            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="이메일, 상품명, 주소 검색"
              />
            </div>

            {/* Delivery Date */}

            <input
              type="date"
              className={styles.dateInput}
              value={deliveryDate}
              onChange={(event) =>
                setDeliveryDate(
                  event.target.value
                )
              }
            />

            {/* Reset */}

            {(search ||
              deliveryDate) && (
              <button
                className={styles.resetButton}
                onClick={resetFilters}
              >
                초기화
              </button>
            )}
          </div>

          {/* ========================================
              LOADING
          ======================================== */}

          {loading && (
            <div className={styles.loading}>
              <div
                className={styles.spinner}
              />

              주문 데이터를 불러오는 중...
            </div>
          )}

          {/* ========================================
              ERROR
          ======================================== */}

          {!loading && error && (
            <div className={styles.error}>
              <div
                className={styles.errorIcon}
              >
                !
              </div>

              <div>
                <strong>
                  데이터를 불러오지 못했습니다.
                </strong>

                <p>
                  {error}
                </p>
              </div>

              <button
                className={styles.retryButton}
                onClick={fetchOrders}
              >
                다시 시도
              </button>
            </div>
          )}

          {/* ========================================
              EMPTY
          ======================================== */}

          {!loading &&
            !error &&
            filteredOrders.length === 0 && (
              <div className={styles.empty}>
                <div
                  className={styles.emptyIcon}
                >
                  □
                </div>

                <h3>
                  주문이 없습니다.
                </h3>

                <p>
                  검색 조건에 해당하는
                  주문을 찾을 수 없습니다.
                </p>
              </div>
            )}

          {/* ========================================
              TABLE
          ======================================== */}

          {!loading &&
            !error &&
            filteredOrders.length > 0 && (
              <div
                className={
                  styles.tableWrapper
                }
              >
                <table
                  className={styles.table}
                >
                  <thead>
                    <tr>
                      <th>
                        #
                      </th>

                      <th>
                        고객
                      </th>

                      <th>
                        상품
                      </th>

                      <th>
                        <button
                          className={
                            styles.sortButton
                          }
                          onClick={() =>
                            changeSort(
                              "quantity"
                            )
                          }
                        >
                          수량

                          {sortKey ===
                            "quantity" &&
                            (sortAsc
                              ? " ↑"
                              : " ↓")}
                        </button>
                      </th>

                      <th>
                        <button
                          className={
                            styles.sortButton
                          }
                          onClick={() =>
                            changeSort(
                              "amount"
                            )
                          }
                        >
                          금액

                          {sortKey ===
                            "amount" &&
                            (sortAsc
                              ? " ↑"
                              : " ↓")}
                        </button>
                      </th>

                      <th>
                        배송지
                      </th>

                      <th>
                        <button
                          className={
                            styles.sortButton
                          }
                          onClick={() =>
                            changeSort(
                              "deliveryDate"
                            )
                          }
                        >
                          배송일

                          {sortKey ===
                            "deliveryDate" &&
                            (sortAsc
                              ? " ↑"
                              : " ↓")}
                        </button>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map(
                      (
                        order,
                        index
                      ) => {
                        const quantity =
                          getTotalQuantity(
                            order
                          );

                        const amount =
                          getTotalAmount(
                            order
                          );

                        return (
                          <tr
                            key={`${order.email}-${index}`}
                          >
                            {/* Number */}

                            <td>
                              <span
                                className={
                                  styles.orderNumber
                                }
                              >
                                {(
                                  index + 1
                                )
                                  .toString()
                                  .padStart(
                                    2,
                                    "0"
                                  )}
                              </span>
                            </td>

                            {/* Customer */}

                            <td>
                              <div
                                className={
                                  styles.customer
                                }
                              >
                                <div
                                  className={
                                    styles.customerAvatar
                                  }
                                >
                                  {order.email
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase()}
                                </div>

                                <div>
                                  <div
                                    className={
                                      styles.email
                                    }
                                  >
                                    {
                                      order.email
                                    }
                                  </div>

                                  <div
                                    className={
                                      styles.postCode
                                    }
                                  >
                                    {order.postCode
                                      ? `우편번호 ${order.postCode}`
                                      : "주소 미등록"}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Products */}

                            <td>
                              <div
                                className={
                                  styles.products
                                }
                              >
                                {order.productItems.map(
                                  (
                                    item
                                  ) => (
                                    <div
                                      className={
                                        styles.product
                                      }
                                      key={
                                        item.productId
                                      }
                                    >
                                      <span
                                        className={
                                          styles.productName
                                        }
                                      >
                                        {
                                          item.productName
                                        }
                                      </span>

                                      <span
                                        className={
                                          styles.productQuantity
                                        }
                                      >
                                        ×{" "}
                                        {
                                          item.quantity
                                        }
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </td>

                            {/* Quantity */}

                            <td>
                              <span
                                className={
                                  styles.quantity
                                }
                              >
                                {
                                  quantity
                                }
                              </span>
                            </td>

                            {/* Amount */}

                            <td>
                              <strong
                                className={
                                  styles.amount
                                }
                              >
                                {formatPrice(
                                  amount
                                )}
                              </strong>
                            </td>

                            {/* Address */}

                            <td>
                              <div
                                className={
                                  styles.address
                                }
                              >
                                {order.address ? (
                                  order.address
                                ) : (
                                  <span
                                    className={
                                      styles.noAddress
                                    }
                                  >
                                    주소 없음
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Delivery Date */}

                            <td>
                              <span
                                className={
                                  styles.deliveryDate
                                }
                              >
                                {
                                  order.deliveryDate
                                }
                              </span>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            )}
        </section>
      </main>
    </div>
  );
}