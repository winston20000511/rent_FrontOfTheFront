<template>
  <div class="edit-profile">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h4>修改會員資料</h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitForm">
                <div class="mb-3">
                  <label for="user_id" class="form-label">使用者ID</label>
                  <input
                    type="text"
                    class="form-control"
                    id="user_id"
                    v-model="user.user_id"
                    disabled
                  />
                </div>

                <div class="mb-3">
                  <label for="name" class="form-label">使用者名稱</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    v-model="user.name"
                  />
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">電子信箱</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="user.email"
                  />
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">密碼</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="user.password"
                  />
                </div>

                <div class="mb-3">
                  <label for="phone" class="form-label">手機</label>
                  <input
                    type="text"
                    class="form-control"
                    id="phone"
                    v-model="user.phone"
                  />
                </div>

                <div class="mb-3">
                  <label for="picture" class="form-label">大頭貼</label>
                  <input
                    type="file"
                    class="form-control"
                    id="picture"
                    @change="handleFileUpload"
                  />
                  <img
                    v-if="previewImage"
                    :src="previewImage"
                    alt="Profile Picture"
                    class="img-thumbnail mt-3"
                    width="100"
                  />
                </div>

                <div class="mb-3">
                  <label for="createtime" class="form-label">帳號創建日期</label>
                  <input
                    type="text"
                    class="form-control"
                    id="createtime"
                    v-model="user.createtime"
                    disabled
                  />
                </div>

                <div class="mb-3">
                  <label for="gender" class="form-label">性別</label>
                  <select class="form-select" id="gender" v-model="user.gender">
                    <option value="0">男</option>
                    <option value="1">女</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="coupon" class="form-label">優惠券</label>
                  <input
                    type="number"
                    class="form-control"
                    id="coupon"
                    v-model="user.coupon"
                    disabled
                  />
                </div>

                <div class="mb-3">
                  <label for="status" class="form-label">帳號狀態</label>
                  <select class="form-select" id="status" v-model="user.status">
                    <option value="0">停用</option>
                    <option value="1">啟用</option>
                  </select>
                </div>

                <button type="submit" class="btn btn-primary">儲存修改</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../api/api";  // 確保路徑正確

export default {
  name: "EditProfile",
  data() {
    return {
      user: {
        user_id: 1, // 假設的ID，您可以根據實際情況獲取
        name: "John Doe",
        email: "john@example.com",
        password: "",
        phone: "0912345678",
        picture: "",
        createtime: "2024-01-01",
        gender: 0, // 0代表男，1代表女
        coupon: 3,
        status: 1, // 1代表啟用
      },
      previewImage: null, // 預覽圖片
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.previewImage = URL.createObjectURL(file); // 顯示預覽圖片
        this.user.picture = file; // 可以將檔案傳送到後端
      }
    },
    submitForm() {
      // 使用 api 來發送 PUT 請求，並自動加入 Authorization 標頭
      api
        .put("http://localhost:8080/api/user/update", this.user)  // 待確認路徑！
        .then((response) => {
          console.log("資料已儲存", response);
          alert("資料已儲存！");
        })
        .catch((error) => {
          console.error("儲存資料錯誤", error);
          alert("儲存資料時發生錯誤！");
        });
    },
  },
};
</script>

<style scoped>
.edit-profile {
  font-family: 'Arial', sans-serif;
}

.card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #007bff;
  color: white;
  font-size: 1.25rem;
  border-radius: 10px 10px 0 0;
}

.card-body {
  padding: 2rem;
}

.form-label {
  font-weight: bold;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  font-weight: bold;
  padding: 0.5rem 1.5rem;
  margin-top: 1rem;
}

.img-thumbnail {
  max-width: 100%;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .card {
    padding: 1rem;
  }
}
</style>
