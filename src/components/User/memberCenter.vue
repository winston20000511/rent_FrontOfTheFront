<template>
  <div class="container mt-3">
    <!-- 頁籤選項 -->
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
          我的廣告
        </button>
      </li>
    </ul>

    <!-- 頁籤內容 -->
    <div class="tab-content" id="memberCenterTabsContent">
      <div class="tab-pane fade show active" id="edit-profile" role="tabpanel" aria-labelledby="edit-profile-tab">
        <Profile/>
      </div>
      <div class="tab-pane fade" id="favorite-houses" role="tabpanel" aria-labelledby="favorite-houses-tab">
        <FavoriteHouses />
      </div>
      <div class="tab-pane fade" id="appointments-overview" role="tabpanel" aria-labelledby="appointments-overview-tab">
        <AppointmentsOverview />
      </div>
      <div class="tab-pane fade" id="my-ads" role="tabpanel" aria-labelledby="my-ads-tab">
        <MyAds></MyAds>
      </div>
    </div>
  </div>
</template>

<script>
import MyAds from '../Ads/MyAds.vue';
import AppointmentsOverview from '../Booking/AppointmentsOverview.vue';
import Profile from './Profile.vue';
import FavoriteHouses from '../houses/FavoriteHouses.vue';



export default {
  name: 'MemberCenter',
  components: {
    Profile,
    FavoriteHouses,
    AppointmentsOverview,
    MyAds
  }
};
</script>

<style scoped>
.tab-content {
  margin-top: 20px;
}
</style>