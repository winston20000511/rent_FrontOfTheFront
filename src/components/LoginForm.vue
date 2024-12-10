<template>
    <form @submit.prevent="submitLogin">
      <div class="mb-3">
        <label for="loginEmail" class="form-label">電子信箱</label>
        <input type="email" class="form-control" id="loginEmail" v-model="email" placeholder="請輸入電子信箱" required>
      </div>
      <div class="mb-3">
        <label for="loginPassword" class="form-label">密碼</label>
        <input type="password" class="form-control" id="loginPassword" v-model="password" placeholder="請輸入密碼" required>
      </div>
      <button type="submit" class="btn btn-primary w-100">登入</button>
      <a href="/forgot-password" class="d-block mt-2 text-center forgot-password">忘記密碼？</a>
    </form>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      submitLogin() {
        // 在這裡處理登入邏輯
        console.log('登入:', this.email, this.password);
        // 這裡可以用axios向後端發送POST請求
      }
    }
  };
  </script>
  