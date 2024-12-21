<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <!-- Left side: 房產選項 -->
        <div class="navbar-nav me-auto">
          <router-link class="nav-link" to="/buy">買房</router-link>
          <router-link class="nav-link" to="/rent">租房</router-link>
          <router-link class="nav-link" to="/sell">賣房</router-link>
        </div>
  
        <!-- Center: 網站名稱 -->
        <a class="navbar-brand mx-auto" href="#">Rent189</a>
  
        <!-- Right side: 登入、幫助、廣告 -->
        <div class="navbar-nav ms-auto">
          <router-link class="nav-link" to="/ads">廣告</router-link>
          <router-link class="nav-link" to="/help">幫助</router-link>
          <router-link class="nav-link" to="/login">會員中心</router-link>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar'
  };
  </script>
  
  <style scoped>
  /* 設定 Rent189 文字為藍色 */
  .navbar-brand {
    color: blue;
    font-weight: bold;
  }
  
  /* 設定滑鼠懸停時變色 */
  .navbar-brand:hover {
    color: darkblue;
  }
  </style>
  