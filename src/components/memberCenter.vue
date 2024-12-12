<template>
  <div class="container mt-3">
    <!-- 將頁籤選項包在一個專用的容器中 -->
    <div class="tabs-container">
      <ul class="nav nav-tabs" id="memberCenterTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#edit-profile" type="button" role="tab" aria-controls="edit-profile" aria-selected="true">
            修改會員資料
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#favorite-houses" type="button" role="tab" aria-controls="favorite-houses" aria-selected="false">
            房屋收藏
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#appointments-overview" type="button" role="tab" aria-controls="appointments-overview" aria-selected="false">
            預約介面總覽
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#my-ads" type="button" role="tab" aria-controls="my-ads" aria-selected="false">
            我申請的VIP服務
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#my-orders" type="button" role="tab" aria-controls="my-ads" aria-selected="false">
            我的VIP訂單
          </button>
        </li>
      </ul>
    </div>

    <!-- 頁籤內容 -->
    <div class="tab-content" id="memberCenterTabsContent">
      <div class="tab-pane fade show active" id="edit-profile" role="tabpanel" aria-labelledby="edit-profile-tab">
        <Profile />
      </div>
      <div class="tab-pane fade" id="favorite-houses" role="tabpanel" aria-labelledby="favorite-houses-tab">
        <FavoriteHouses />
      </div>
      <div class="tab-pane fade" id="appointments-overview" role="tabpanel" aria-labelledby="appointments-overview-tab">
        <AppointmentsOverview />
      </div>
      <div class="tab-pane fade" id="my-ads" role="tabpanel" aria-labelledby="my-ads-tab">
        <MyAds />
      </div>
      <div class="tab-pane fade" id="my-orders" role="tabpanel" aria-labelledby="my-orders-tab">
        <MyOrders />
      </div>
    </div>
  </div>
</template>

<script>
import Profile from '../components/Profile.vue';
import FavoriteHouses from '../components/FavoriteHouses.vue';
import AppointmentsOverview from '../components/AppointmentsOverview.vue';
import MyAds from '../components/MyAds.vue';
import MyOrders from '../components/MyOrders.vue';

export default {
  name: 'MemberCenter',
  components: {
    Profile,
    FavoriteHouses,
    AppointmentsOverview,
    MyAds,
    MyOrders
  }
};
</script>

<style scoped>
/* 清除任何不必要的間距，讓頁面緊貼上方 */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
}

.container {
  margin: 0 auto;
  padding: 0; /* 去除預設 padding */
  max-width: 1200px;
}

/* 調整頁籤按鈕容器 */
.tabs-container {
  display: flex;
  justify-content: space-between; /* 水平均勻分布 */
  align-items: center;           /* 垂直置中 */
  padding: 1rem 0;               /* 上下留空間 */
  background-color: #f8f9fa;     /* 可選背景色 */
  border-bottom: 1px solid #ddd; /* 加分隔線 */
}

/* 頁籤按鈕 */
.nav-tabs .nav-item {
  margin: 0; /* 清除內外間距 */
}

.nav-tabs .nav-link {
  padding: 10px 20px; /* 調整按鈕大小 */
  border-radius: 4px;
  font-size: 16px;
  text-align: center;
  transition: background-color 0.3s ease;
}

/* 按鈕效果 */
.nav-tabs .nav-link.active {
  background-color: #0d6efd;
  color: #fff;
}

.nav-tabs .nav-link:hover {
  background-color: #e0e0e0;
}

/* 頁籤內容間距 */
.tab-content {
  margin-top: 0; /* 取消額外的間距 */
}
</style>
