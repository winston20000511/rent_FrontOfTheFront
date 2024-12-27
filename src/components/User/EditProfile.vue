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
                    v-model="user.userId"
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
                    disabled
                  />
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">密碼</label><div></div>
                  <small class="form-text">密碼需至少8個字母，並包含英數字</small>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="user.password"
                  />
                </div>

                <div class="mb-3">
                  <label for="phone" class="form-label">手機</label><div></div>
                  <small class="form-text">手機格式須為09xx-xxx-xxx</small>
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
                    :src="`data:image/jpeg;base64,${previewImage}`"
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
                    v-model="user.createTime"
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

                <button type="submit" class="btn btn-primary">儲存修改</button>
                <!-- 新增刪除帳號按鈕 -->
                <button
                  type="button"
                  class="btn btn-danger ms-2"
                  data-bs-toggle="modal"
                  data-bs-target="#confirmModal"
                >
                  刪除帳號
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bootstrap Modal -->
    <div
      class="modal fade"
      id="confirmModal"
      tabindex="-1"
      aria-labelledby="confirmModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmModalLabel">確認操作</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            確定要停用您的帳號嗎？此操作無法撤銷，未來將無法再登入。
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="confirmDeactivate"
              data-bs-dismiss="modal"
            >
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../api/api"; // 確保路徑正確
export default {
  name: "EditProfile",
  data() {
    return {
      user: {
        userId: "", 
        name: "",
        email: "",
        password: "",
        phone: "",
        picture: "",
        createTime: "",
        gender: null,
        coupon: 3,
        status: null,
      },
    };
  },
  created() {
    // 1. 使用 post 請求載入目前登入會員資料
    api
      .post("http://localhost:8080/api/user/userCenter") // 獲取會員資料的 API
      .then((response) => {
        this.user = {
          ...response.data,
          password: "", // 預防直接顯示密碼，保留為空
        };
        // this.user.userId = response.data.userId
        console.log(response.data)
        console.log(JSON.stringify(this.user))
      })
      .catch((error) => {
        console.error("載入會員資料失敗", error);
        alert("無法載入會員資料，請稍後再試！");
      });
  },
  methods: {
    // 2. 使用 PUT 請求更新會員資料
    updateUser() {
      api
        .put("http://localhost:8080/api/user/update", this.user) // 更新會員資料的 API
        .then(() => {
          alert("會員資料更新成功！");
        })
        .catch((error) => {
          console.error("更新會員資料失敗", error);
          alert("更新失敗，請檢查輸入內容！");
        });
    },
   // 3. 提交表單
   submitForm() {
      this.updateUser();
    },
  },
};
</script>

<style scoped>
.form-text {
  color: red;          /* 設定文字顏色為紅色 */
}

.form-label {
  margin-bottom: 2px; /* 減少標籤和下一行之間的間距 */
}

.form-text {
  margin-top: 2px; /* 減少提示文字和標籤之間的間距 */

}
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

.img-thumbnail {
  max-width: 100%;
  border-radius: 5px;
}
</style>
