<script setup>
import { ref, defineEmits } from 'vue';

// 定義父層傳遞的事件
const emit = defineEmits(['signInClicked']);

const navLeft = ref(null);
const linkOne = ref(null);
const linkListOne = ref(null);
const linkListOnePos = ref({ top: 0, left: 0 });

const linkMouseEnter = () => {
  if (linkOne.value && linkListOne.value) {
    const linkRect = navLeft.value.getBoundingClientRect();
    linkListOnePos.value = {
      top: linkRect.bottom + window.scrollY + 5,
    };
    linkListOne.value.style.display = 'block';
  }
};

const linkMouseLeave = () => {
  if (linkListOne.value) {
    setTimeout(() => {
      linkListOne.value.style.display = 'none';
    }, 400);
  }
};

const handleSignInClick = () => {
  // 發送事件通知父組件顯示 LoginPage
  emit('signInClicked');
};
</script>

<template>
  <div class="navbar">
    <!-- 左側：Logo 和標題 -->
    <div class="nav-left">
      <img src="../../assets/Logo3.jpg" alt="Logo" class="nav-logo" />
      <div class="nav-title">
        <h1>house</h1>
      </div>
    </div>

    <!-- 右側：MemberCenter 和 Sign In -->
    <ul class="nav-right">
      <li><RouterLink to="/member-center">MemberCenter</RouterLink></li>
      <li>
        <button @click="handleSignInClick">Sign In</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Navbar 容器 */
.navbar {
  display: flex;
  justify-content: space-between; /* 左右分佈 */
  align-items: center;           /* 垂直居中 */
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 提升視覺效果 */
}

/* 左側：Logo 和標題 */
.nav-left {
  display: flex;
  align-items: center; /* 垂直居中 */
}

.nav-logo {
  max-width: 150px; /* 設置最大寬度 */
  max-height: 80px; /* 設置最大高度 */
  object-fit: contain; /* 確保Logo顯示不會變形 */
  margin-right: 10px; /* 與標題之間的間距 */
}

.nav-title h1 {
  font-size: 60px;
  color: black;
  font-family: 'Pacifico', cursive;
  font-weight: 500;
  font-style: normal;
  line-height: 1; /* 調整行高 */
  margin: 0; /* 移除預設外距 */
}

/* 右側：MemberCenter 和 Sign In */
.nav-right {
  display: flex;
  align-items: center;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.nav-right li {
  margin-left: 15px; /* 元素間的間距 */
}

.nav-right li a,
.nav-right li button {
  font-size: 16px;
  padding: 8px 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
}

.nav-right li a:hover,
.nav-right li button:hover {
  background-color: #0056b3;
}
</style>
