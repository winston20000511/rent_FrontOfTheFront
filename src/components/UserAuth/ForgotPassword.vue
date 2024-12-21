<template>
    <div>
      <h1>忘記密碼</h1>
      <form @submit.prevent="handleForgotPassword">
        <input v-model="email" placeholder="電子郵件" />
        <button type="submit">發送重置郵件</button>
      </form>
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  
  const email = ref("");
  
  const handleForgotPassword = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APIAUTHURL}/forgot-password`, {
        email: email.value,
      });
      alert("重置密碼郵件已發送");
    } catch (error) {
      console.error("操作失敗", error.response.data);
    }
  };
  </script>
  