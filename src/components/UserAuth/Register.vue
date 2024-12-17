<template>
    <div>
      <h1>註冊</h1>
      <form @submit.prevent="handleRegister">
        <input v-model="name" placeholder="姓名" />
        <input v-model="email" placeholder="電子郵件" />
        <input v-model="password" type="password" placeholder="密碼" />
        <button type="submit">註冊</button>
      </form>
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  
  const name = ref("");
  const email = ref("");
  const password = ref("");
  
  const handleRegister = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APIAUTHURL}/register`, {
        name: name.value,
        email: email.value,
        password: password.value,
      });
      alert("註冊成功");
    } catch (error) {
      console.error("註冊失敗", error.response.data);
    }
  };
  </script>
  