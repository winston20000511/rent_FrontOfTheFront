<script setup>
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { useCart } from '@/stores/cartStore';
import { onMounted } from 'vue';


    onMounted(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            console.log("JWT Token received:", token);

        // 更新 pinia store 中的 token
            const cartStore = useCart();
            cartStore.updateToken(token);
            

            // 儲存 token 到 localStorage
            localStorage.setItem("jwt", token);

            // 更新 authStore 的登入狀態
            const authStore = useAuthStore();
            authStore.isLoggedIn = true;

            //登入成功提示並跳轉回首頁
            alert("登入成功！");
            router.push("/");

        } else {
            console.error("No token found in URL");
        }

    })
</script>
<template></template>
<style scoped></style>