<script setup>
import { RouterView } from 'vue-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
</script>

<template>
  <!-- 頁面導航區 -->
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <RouterLink to="/" class="navbar-brand">Rent189</RouterLink>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink to="/login" class="nav-link">登入</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/member-center" class="nav-link">會員中心</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <!-- 內容區顯示，根據路由顯示相應頁面 -->
  <RouterView />
</template>

<style scoped>
/* 這裡可以添加你自定義的樣式 */
</style>
