<template>
  <div>
    <!-- 加入 HomeNavbar -->
    <HomeNavbar @signInClicked="handleSignInClick" />

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
                      to="/member-center/ads"
                      class="nav-link"
                      :class="{ active: activeTab === 'ads' }"
                      role="tab"
                    >
                      我的廣告
                    </router-link>
                  </li>
                </ul>

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
import HomeNavbar from '../Home/HomeNavbar.vue';

export default {
  name: 'MemberCenter',
  components: {
    HomeNavbar,
  },
  data() {
    return {
      activeTab: '',
      memberName: '王小明',
      memberPicture: 'https://via.placeholder.com/80',
    };
  },
  watch: {
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
    if (this.$route.path === '/member-center/edit-profile') {
      this.activeTab = 'profile';
    } else if (this.$route.path === '/member-center/bookmarked') {
      this.activeTab = 'bookmarked';
    } else if (this.$route.path === '/member-center/reservation') {
      this.activeTab = 'reservation';
    } else if (this.$route.path === '/member-center/ads') {
      this.activeTab = 'ads';
    }
  },
  methods: {
    handleSignInClick() {
      console.log('Sign In 按鈕被點擊');
    },

    async fetchWithAuth(url, options = {}) {
      const token = localStorage.getItem('jwt');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      };

      const config = {
        ...options,
        headers,
      };

      try {
        const response = await fetch(url, config);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    },

    async getMemberData() {
      try {
        const data = await this.fetchWithAuth('/api/member/data', {
          method: 'GET',
        });
        console.log('會員資料:', data);
        this.memberName = data.name || this.memberName;
        this.memberPicture = data.picture || this.memberPicture;
      } catch (error) {
        console.error('取得會員資料失敗:', error);
      }
    },
  },
  mounted() {
    this.getMemberData();
  },
};
</script>

<style scoped>
/* 略，保持原有樣式 */
</style>
