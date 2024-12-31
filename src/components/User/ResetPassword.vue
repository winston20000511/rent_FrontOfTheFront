<template>
    <div class="reset-password-container">
      <div class="reset-password-form">
        <div class="heading">
          <i class="bi bi-key"></i>
          重設密碼
        </div>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="password" class="form-label">新密碼</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="form-control"
              placeholder="請輸入新密碼"
              required
            />
          </div>
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">確認新密碼</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              class="form-control"
              placeholder="再次輸入新密碼"
              required
            />
          </div>
          <button type="submit" class="btn btn-red">重設密碼</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import api from "../../api/api";
  
  const password = ref("");
  const confirmPassword = ref("");
  const token = new URLSearchParams(window.location.search).get("token"); // 從 URL 中讀取 token
  
  async function submitForm() {
    if (password.value !== confirmPassword.value) {
      alert("兩次密碼輸入不一致！");
      return;
    }
  
    try {
      const response = await api.put("http://localhost:8080/api/forgot/resetPassword", {
        token:token,
        newPassword: password.value,
      });
      const data  =response.data;
      console.log(data);
      alert("密碼重設成功！");
    } catch (error) {
      console.log(error);
      alert("密碼重設失敗，請稍後再試。");
    }
    
  }
  </script>
  
  <style scoped>
  /* 同 ForgotPassword.vue 的樣式，可以重複使用 */
  </style>
  