<template>
    <div class="deactivate-account">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8">
            <div class="card shadow">
              <div class="card-header bg-danger text-white">
                <h4>停用帳號</h4>
              </div>
              <div class="card-body">
                <p>確定要停用您的帳號嗎？此操作無法撤銷，未來將無法再登入。</p>
                <button class="btn btn-danger" @click="confirmDeactivate">
                  刪除帳號
                </button>
                <RouterLink to="/edit-profile" class="btn btn-secondary ms-2">
                  取消
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from "../../api/api";
  
  export default {
    name: "DeactivateAccount",
    data() {
      return {
        userId: 1, // 假設目前有 userId，實際情況可以從 Vuex、props 或其他方式獲取
      };
    },
    methods: {
      confirmDeactivate() {
        // 顯示確認視窗
        const confirmed = confirm(
          "確定要刪除您的帳號嗎？此操作無法撤銷，未來將無法再登入。"
        );
        if (confirmed) {
          this.deactivateAccount();
        }
      },
      deactivateAccount() {
        // 發送 PUT 請求停用帳號
        api
          .put("http://localhost:8080/api/user/deactivate", {
            userId: this.userId, // 使用者的 ID
            status: 0, // 將狀態設為 0，表示會員自行停權
          })
          .then(() => {
            alert("帳號已成功停用，即將登出！");
            this.clearTokenAndLogout();
          })
          .catch((error) => {
            console.error("停用帳號錯誤", error);
            alert("停用帳號時發生錯誤！");
          });
      },
      clearTokenAndLogout() {
        // 清除 token 並導向登入頁面
        localStorage.removeItem("authToken"); // 假設 token 存在於 localStorage
        sessionStorage.removeItem("authToken"); // 或 sessionStorage，根據實際情況調整
        this.$router.push("/login"); // 導向登入頁面
      },
    },
  };
  </script>
  
  <style scoped>
  .card-header {
    background-color: #dc3545; /* Bootstrap danger 顏色 */
  }
  
  .btn-danger {
    font-weight: bold;
  }
  </style>
  