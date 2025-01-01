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
                  <label for="phone" class="form-label">手機</label>
                  <small class="form-text">手機格式須為0912345678</small>
                  <input
                    type="text"
                    class="form-control"
                    id="phone"
                    v-model="user.phone"
                  />
                </div>

                <div class="mb-3">
                  <label for="profileImage">頭像圖片:</label>
                  <input type="file" id="profileImage" @change="handleImageUpload" accept="image/*" />
                  <div v-if="previewImage">
                    <p>預覽圖片:</p>
                    <img :src="previewImage" alt="Profile Preview" style="max-width: 200px;" />
                  </div>
                  <div v-else-if="user.pictureBase64">
                    <p>當前頭像:</p>
                    <img :src="`data:image/jpeg;base64,${user.pictureBase64}`" alt="Current Profile Image" style="max-width: 200px;" />
                  </div>
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
                <button
                  type="button"
                  class="btn btn-secondary ms-2"
                  @click="showPasswordModal = true"
                >
                  修改密碼
                </button>
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

    <!-- 確認刪除帳號彈窗 -->
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

    <!-- 密碼修改彈窗組件 -->
    <PasswordModal v-if="showPasswordModal" @close="showPasswordModal = false" />
  </div>
</template>

<script>
import api from "../../api/api";
import PasswordModal from "./PasswordModal.vue";

export default {
  name: "EditProfile",
  components: {
    PasswordModal,
  },
  data() {
    return {
      user: {
        userId: "",
        name: "",
        email: "",
        phone: "",
        pictureBase64: "",
        imageBytes: [], // 改為 BYTE[]
        createTime: "",
        gender: null,
        coupon: 3,
      },
      previewImage: null,
      showPasswordModal: false,
    };
  },
  created() {
    api
      .post("http://localhost:8080/api/user/userCenter")
      .then((response) => {
        this.user = { ...response.data };
        if (this.user.pictureBase64) {
          this.previewImage = `data:image/jpeg;base64,${this.user.pictureBase64}`;
        }
      })
      .catch((error) => {
        console.error("載入會員資料失敗", error);
        alert("無法載入會員資料，請稍後再試！");
      });
  },
  methods: {
    async submitForm() {
      try {
        // console.log(this.user.imageBytes); // 確認圖片數據是否存在
        const response = await api.put("http://localhost:8080/api/user/update", this.user);
        // console.log("資料更新成功，圖片更新成功：" + (this.user.imageBytes.length > 0));
        alert("資料已成功更新！");
      } catch (error) {
        console.error("資料更新錯誤", error);
        alert("發生錯誤，請稍後再試！");
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.user.imageBytes = Array.from(new Uint8Array(e.target.result)); // 將圖片轉換為 BYTE[]
          // console.log("接收到圖片，大小：" + this.user.imageBytes.length + " bytes");
          this.previewImage = URL.createObjectURL(file); // 預覽圖片
        };
        reader.readAsArrayBuffer(file); // 讀取為 ArrayBuffer
      }
    },
    confirmDeactivate() {
      alert("帳號已停用！");
    },
  },
};


</script>


<style scoped>
.form-text {
  color: red;
}
.card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.card-header {
  background-color: #007bff;
  color: white;
}
</style>
