<template>
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-white text-dark"
  >
    <div class="container">
      <h1 class="text-center mb-4" style="font-size: xxx-large">建議單</h1>

      <form @submit.prevent="submitForm" class="p-4 border rounded">
        <!-- User ID -->
        <!-- <div class="mb-3">
            <label for="user_id" class="form-label">用戶 ID</label>
            <input
              type="text"
              id="user_id"
              v-model="formData.user_id"
              class="form-control"
              readonly
            />
          </div> -->

        <!-- Username -->
        <div class="mb-3">
          <label for="username" class="form-label">用戶名稱</label>
          <input
            type="text"
            id="username"
            v-model="formData.username"
            class="form-control"
            readonly
          />
        </div>

        <!-- Category -->
        <div class="mb-3">
          <label for="category" class="form-label">類別</label>
          <select
            id="category"
            v-model="formData.category"
            class="form-select"
            required
          >
            <option disabled value="">請選擇類別</option>
            <option value="刊登問題">刊登問題</option>
            <option value="儲值問題">儲值問題</option>
            <option value="會員問題">會員問題</option>
            <option value="檢舉不法">檢舉不法</option>
            <option value="其它">其它</option>
          </select>
        </div>

        <!-- Subject -->
        <div class="mb-3">
          <label for="subject" class="form-label">標題</label>
          <input
            type="text"
            id="subject"
            v-model="formData.subject"
            class="form-control"
            placeholder="請輸入標題"
            required
          />
        </div>

        <!-- Content -->
        <div class="mb-3">
          <label for="content" class="form-label">詳細內容</label>
          <textarea
            id="content"
            v-model="formData.content"
            class="form-control"
            rows="5"
            placeholder="請輸入投訴的詳細內容"
            required
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="text-center">
          <button type="submit" class="btn btn-primary">提交</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const formData = ref({
  user_id: "",
  username: "",
  category: "",
  subject: "",
  content: "",
});

let token = localStorage.getItem("jwt");
// console.log("JWT 解碼結果:", token);

function initializeCurrentUser() {
  let token = localStorage.getItem("jwt");
  if (!token) {
    console.error("JWT 不存在，請重新登錄");
    return;
  }
  try {
    const decoded = jwtDecode(token);
    // console.log("JWT 解碼結果:", decoded);

    formData.value.user_id = decoded.userId || decoded.sub || "";
    formData.value.username = decoded.username || decoded.name || "";
    // console.log(
    //   "當前用戶信息:",
    //   "userId:",
    //   formData.value.user_id,
    //   "name:",
    //   formData.value.username
    // );
  } catch (error) {
    console.error("解析 JWT 時出錯:", error);
  }
}
initializeCurrentUser();

const submitForm = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APIURL}/complaints/submit`,
      formData.value,
      {
        headers: {
          authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("check formdata", formData.value);
    alert("投訴提交成功！");
    // console.log("提交結果：", response.data);
  } catch (error) {
    console.error("提交失敗：", error);
    alert("提交失敗，請重試！");
  }
};
</script>

<style scoped>
body {
  background-color: #ffffff;
  color: #000000;
}
</style>
