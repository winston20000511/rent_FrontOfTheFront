<template>
    <div class="edit-user-page">
      <EditUserForm
        v-if="user"
        :userData="user"
        @update-user="handleUpdateUser"
      />
    </div>
  </template>
  
  <script>
  import EditUserForm from "./EditUserForm.vue";
  
  export default {
    name: "EditUserPage",
    components: {
      EditUserForm,
    },
    data() {
      return {
        user: null, // 儲存從資料庫獲取的使用者數據
      };
    },
    mounted() {
      this.fetchUserData();
    },
    methods: {
      async fetchUserData() {
        // 模擬從後端獲取資料
        const userId = 1; // 假設是從路由參數取得的 user_id
        const response = await fetch(`/api/users/${userId}`);
        this.user = await response.json();
      },
      async handleUpdateUser(updatedUser) {
        // 將修改後的資料送到後端
        const response = await fetch(`/api/users/${updatedUser.user_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        });
        if (response.ok) {
          alert("會員資料更新成功！");
        } else {
          alert("更新失敗，請稍後再試。");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .edit-user-page {
    padding: 20px;
    background-color: #f8f9fa;
    min-height: 100vh;
  }
  </style>
  