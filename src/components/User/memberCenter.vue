<template>
  <div>
    <div class="member-center">
      <div class="container mt-5">
        <!-- 會員資料區 -->
        <div class="member-info card mb-4 shadow">
          <div class="card-body d-flex align-items-center">
            <img :src="memberPicture" alt="會員大頭貼" class="member-avatar rounded-circle" />
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
                  <!-- 修改會員資料 -->
                  <li class="nav-item" role="presentation">
                    <router-link to="/member-center/edit-profile" class="nav-link"
                      :class="{ active: activeTab === 'profile' }" role="tab">
                      修改會員資料
                    </router-link>
                  </li>

                  <!-- 我的房屋 -->
                  <li class="nav-item" role="presentation">
                    <router-link
                      to="/member-center/my-houses"
                      class="nav-link"
                      :class="{ active: activeTab === 'houses' }"
                      role="tab"
                    >
                      我的房屋
                    </router-link>
                  </li>

                  <!-- 我的收藏 -->
                  <li class="nav-item" role="presentation">
                    <router-link
                      to="/member-center/my-collections"
                      class="nav-link"
                      :class="{ active: activeTab === 'collections' }"
                      role="tab"
                    >
                      我的收藏
                    </router-link>
                  </li>

                  <!-- 預約介面總覽 -->
                  <li class="nav-item" role="presentation">
                    <router-link to="/member-center/my-booking" class="nav-link"
                      :class="{ active: activeTab === 'booking' }" role="tab">
                      我的預約
                    </router-link>
                  </li>

                  <!-- 我的廣告 -->
                  <li class="nav-item" role="presentation">
                    <router-link
                      to="/member-center/my-advertisements"
                      class="nav-link"
                      :class="{ active: activeTab === 'ads' }"
                      role="tab"
                    >
                      我的VIP物件清單
                    </router-link>
                  </li>

                  <!-- 我的訂單 -->
                  <li class="nav-item" role="presentation">
                    <router-link
                      to="/member-center/my-orders"
                      class="nav-link"
                      :class="{ active: activeTab === 'orders' }"
                      role="tab"
                    >
                      VIP物件訂單
                    </router-link>
                  </li>

                  <!-- 屋主介面總覽 -->
                  <li class="nav-item" role="presentation">
                    <router-link to="/member-center/homeowner" class="nav-link"
                      :class="{ active: activeTab === 'homeowner' }" role="tab">
                      屋主預約管理
                    </router-link>
                  </li>
                </ul>

                <!-- 使用 router-view 顯示內容 -->
                <div class="tab-content" id="pills-tabContent">
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
import axios from "axios";
import api from "../../api/api"; // 假設 API 模組已設定 Authorization 標頭

export default {
  name: "MemberCenter",
  data() {
    return {
      activeTab: "", // 初始值為空，會根據路由更新
      memberName: "", // 動態載入會員名稱
      memberPicture: "", // 動態載入會員頭像
    };
  },
  watch: {
    $route(to) {
      // 根據路由更新 activeTab
      if (to.path === "/member-center/edit-profile") {
        this.activeTab = "profile";
      } else if (to.path === "/member-center/my-houses") {
        this.activeTab = "houses";
      } else if (to.path === "/member-center/my-collections") {
        this.activeTab = "collections";
      } else if (to.path === "/member-center/my-booking") {
        this.activeTab = "booking";
      } else if (to.path === "/member-center/ads") {
        this.activeTab = "ads";
      } else if (to.path === "/member-center/homeowner") {
        this.activeTab = "homeowner";
      } else if (to.path === "/member-center/reservation") {
        this.activeTab = "reservation";
      } else if (to.path === "/member-center/my-advertisements") {
        this.activeTab = "ads";
      } else if (to.path === "/member-center/my-orders") {
        this.activeTab = "orders";
      }
    },
  },
  created() {
    // 初始化時根據當前路由設置 activeTab
    if (this.$route.path === "/member-center/edit-profile") {
      this.activeTab = "profile";
    } else if (this.$route.path === "/member-center/my-houses") {
      this.activeTab = "houses";
    } else if (this.$route.path === "/member-center/my-collections") {
      this.activeTab = "collections";
    } else if (this.$route.path === "/member-center/my-booking") {
      this.activeTab = "booking";
    } else if (this.$route.path === "/member-center/ads") {
      this.activeTab = "ads";
    } else if (this.$route.path === "/member-center/homeowner") {
      this.activeTab = "homeowner";
    } else if (this.$route.path === "/member-center/reservation") {
      this.activeTab = "reservation";
    } else if (this.$route.path === "/member-center/my-advertisements") {
      this.activeTab = "ads";
    } else if (this.$route.path === "/member-center/my-orders") {
      this.activeTab = "orders";
    }

    // 動態載入會員資料
    this.fetchMemberData();
  },
  methods: {
    async fetchMemberData() {
      try {
        // 從後端 API 獲取會員資料
          const response = await api.post(
            "http://localhost:8080/api/user/userSimpleInfo"
          );
          console.log(response.data);
          const { name, picture } = response.data;
          console.log(picture);
          this.memberPicture=`data:image/jpeg;base64,${picture}`;
          //this.memberPicture = atob(picture);
          console.log(atob(picture));

          
        // 設定會員資料
        this.memberName = name;
        //this.memberPicture = picture || "https://via.placeholder.com/80"; // 預設圖片
      } catch (error) {
        console.error("無法取得會員資料", error);
      }
    },
    
  },
};
</script>

<style scoped>
.member-avatar {
  width: 80px; /* 調整大頭貼寬度 */
  height: 80px; /* 調整大頭貼高度，讓它保持正方形 */
  margin-right: 10px; /* 與「你好」之間的間距 */
  object-fit: cover; /* 確保圖片以適當比例顯示 */
}

.member-info .card-body {
  display: flex;
  align-items: center;
}
</style>