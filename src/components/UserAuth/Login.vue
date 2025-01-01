<template>
  <div>
    <h1>登入</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="email" placeholder="電子郵件" />
      <input v-model="password" type="password" placeholder="密碼" />
      <button type="submit">登入</button>
      <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APIAUTHURL}/login`,

      {
        email: email.value,
        password: password.value,
      }
    );

    localStorage.setItem("jwtToken", response.data.jwtToken);
    // console.log("登入成功", response.data);
    router.push({ name: "home" });

    errorMessage.value = "";
  } catch (error) {
    errorMessage.value = error.response?.data || "登入失敗，請稍後再試";
    console.error("登入失敗", error.response?.data);
  }
};
</script>
