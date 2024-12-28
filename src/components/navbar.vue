<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <div class="navbar-nav me-auto">
        <a class="nav-link" href="/buy">買房</a>
        <a class="nav-link" href="/rent">租房</a>
        <a class="nav-link" href="/sell">賣房</a>
      </div>
      <a class="navbar-brand mx-auto" href="#">Rent189</a>
      <div class="navbar-nav ms-auto">
        <a class="nav-link" href="/ads">廣告</a>
        <a class="nav-link" href="/help">幫助</a>
        <a class="nav-link" href="/login" v-if="!isLoggedIn">登入</a>
        <a class="nav-link" href="/member-center" v-if="isLoggedIn">會員中心</a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false, // 這應該從你的登入狀態來設定
    };
  },
};
</script>

<style scoped>
.navbar-brand {
  color: blue;
  font-weight: bold;
}
.navbar-brand:hover {
  color: darkblue;
}
</style>