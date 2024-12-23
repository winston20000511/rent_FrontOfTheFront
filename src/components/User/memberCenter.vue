<template>
  <div>
    <div class="member-center">
      <div class="container mt-5">
        <!-- 新增會員資料區 -->
        <div class="member-info card mb-4 shadow">
          <div class="card-body d-flex align-items-center">
            <img
              :src="memberPicture"
              alt="會員大頭貼"
              class="member-avatar rounded-circle"
            />
            <div class="ml-3">
              <h5 class="mb-0">你好，{{ memberName }}！</h5>
              <p class="text-muted mb-0">歡迎來到會員中心</p>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="card shadow">
              <div class="card-header bg-primary text-white">
                <h4 class="mb-0">會員中心</h4>
              </div>
              <div class="card-body">
                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                  <!-- 使用 router-link 進行路由跳轉，並根據路由來設置 activeTab -->
                  <li class="nav-item" role="presentation">
                    <router-link
                      to="/member-center/edit-profile"
                      class="nav-link"
                      :class="{ active: activeTab === 'profile' }"
                      role="tab"
                    >
                      修改會員資料
                    </router-link>
                  </li>
                  <li class="nav-item" role="presentation">
                    <router-link
                      to="/member-center/bookmarked"
                      class="nav-link"
                      :class="{ active: activeTab === 'bookmarked' }"
                      role="tab"
                    >
                      房屋收藏
                    </router-link>
                  </li>
                  <li class="nav-item" role="presentation">
                    <router-link
                      to="/member-center/reservation"
                      class="nav-link"
                      :class="{ active: activeTab === 'reservation' }"
                      role="tab"
                    >
                      預約介面總覽
                    </router-link>
                  </li>
                  <li class="nav-item" role="presentation">
                    <router-link
                      to="{ name: 'MyAdvertisements' }"
                      class="nav-link"
                      :class="{ active: activeTab === 'my-advertisements' }"
                      role="tab"
                    >
                      我的VIP服務
                    </router-link>
                  </li>
                  <li class="nav-item" role="presentation">
                    <router-link
                      to="{ name: 'MyOrders' }"
                      class="nav-link"
                      :class="{ active: activeTab === 'my-orders' }"
                      role="tab"
                    >
                      我的VIP服務訂單
                    </router-link>
                  </li>
                </ul>

                <div class="tab-content" id="pills-tabContent">
                  <!-- 使用 router-view 來顯示子路由內容 -->
                  <router-view></router-view>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api/api'; // 假設 API 模組已設定 Authorization 標頭

export default {
  name: 'MemberCenter',
  data() {
    return {
      activeTab: '', // 初始值為空，會根據路由更新
      memberName: '', // 動態載入會員名稱
      memberPicture: '', // 動態載入會員頭像
    };
  },
  watch: {
    // 監聽路由的變化，根據當前路由更新 activeTab
    $route(to) {
      if (to.path === '/member-center/edit-profile') {
        this.activeTab = 'profile';
      } else if (to.path === '/member-center/bookmarked') {
        this.activeTab = 'bookmarked';
      } else if (to.path === '/member-center/reservation') {
        this.activeTab = 'reservation';
      } else if (to.path === '/member-center/ads') {
        this.activeTab = 'ads';
      }
    },
  },
  created() {
    // 初始化時根據當前路由設置 activeTab
    if (this.$route.path === '/member-center/edit-profile') {
      this.activeTab = 'profile';
    } else if (this.$route.path === '/member-center/bookmarked') {
      this.activeTab = 'bookmarked';
    } else if (this.$route.path === '/member-center/reservation') {
      this.activeTab = 'reservation';
    } else if (this.$route.path === '/member-center/ads') {
      this.activeTab = 'ads';
    }

    // 動態載入會員資料
    this.fetchMemberData();
  },
  methods: {
    handleSignInClick() {
      // 如果需要處理 HomeNavbar 傳來的事件，可以在這裡加入邏輯
      console.log('Sign In 按鈕被點擊');
    },
    async fetchMemberData() {
      try {
        // 從後端 API 獲取會員資料
        const response = await api.post("http://localhost:8080/api/user/userCenter"); // 待確認！後端 API 的路徑
        const { name, picture } = response.data;

        // 設定會員資料
        this.memberName = name;
        this.memberPicture = picture || 'https://via.placeholder.com/80'; // 預設圖片
      } catch (error) {
        console.error('無法取得會員資料', error);
      }
    },
  },
};
</script>

<style scoped>
.member-center {
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
}

.card {
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #007bff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.card-header h4 {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-pills .nav-link {
  border-radius: 30px;
}

.nav-pills .nav-link.active {
  background-color: #007bff;
  color: #fff;
}

.tab-content {
  padding: 20px;
}

.member-info {
  background-color: #fff;
  border-radius: 15px;
}

.member-avatar {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.ml-3 {
  margin-left: 1rem;
}

@media (max-width: 768px) {
  .card-header h4 {
    font-size: 1.2rem;
  }
}
</style>
