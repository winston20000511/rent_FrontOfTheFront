<script setup>
import { ref } from 'vue';
import HomeCardList from '@/components/Home/HomeCardList.vue';
import HomeFilter from '@/components/Home/HomeFilter.vue';
import HomeMap from '@/components/Home/HomeMap.vue';
import HomeNavbar from '@/components/Home/HomeNavbar.vue';
import LoginPage from '@/components/User/LoginPage.vue'; // 新增 LoginPage 引入
import { useHouseCard } from '@/stores/CardHouseStore';

  const store = useHouseCard();
  const markers = ref({});

  const addMarker = (locations)=>{
    markers.value = locations
    store.updateData(markers.value.searchList)
  }

// 控制 LoginPage 的顯示狀態
const showLoginPage = ref(false);

// 切換 LoginPage 的顯示狀態
const toggleLoginPage = () => {
  showLoginPage.value = !showLoginPage.value;
};
</script>

<template>
  <header>
    <!-- 傳遞 signInClicked 事件給 HomeNavbar -->
    <HomeNavbar @signInClicked="toggleLoginPage"></HomeNavbar>
  </header>

  <div class="filter">
    <HomeFilter @add-marker="addMarker"></HomeFilter>
  </div>

    <main>
      <div class="main-left">
        <!-- <HomeMap :markers="markers"></HomeMap> -->
        <HomeMap :markers="markers"></HomeMap>
      </div>
      <div class="main-right">
        <HomeCardList :markers="markers"></HomeCardList>
      </div>
    </main>

  <!-- 控制 LoginPage 的顯示 -->
  <LoginPage v-if="showLoginPage" @closeLoginPage="toggleLoginPage" />

  <!-- 子路由內容 -->
  <router-view></router-view>

</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 14vh;
  border-bottom: 1px solid lightgray;
}
.filter {
  display: flex;
  width: 100%;
  height: 10vh;
  border-bottom: 1px solid lightgray;
}
main {
  position: relative;
  width: 100%;
  height: 76vh;
  display: flex;
  background-color: rgb(235, 235, 235);
}
.main-left {
  position: relative;
  width: 45%;
  z-index: 1;
}
.main-right {
  width: 55%;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 2;
}
</style>