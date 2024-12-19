<template>
  <div class="container mt-5 position-relative">
    <!-- 右上角關閉按鈕 -->
    <button
      type="button"
      class="btn-close position-absolute"
      style="top: 10px; right: 10px"
      aria-label="Close"
      @click="closePage"
    ></button>

    <!-- 標題 -->
    <h2 class="text-center section-title">新增房屋</h2>
    <hr />
    <form @submit.prevent="submitForm">
      <!-- 基本資訊 -->
      <div class="form-group">
        <label for="title">標題</label>
        <input
          type="text"
          id="title"
          class="form-control"
          v-model="form.title"
          required
        />
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="price">價格</label>
          <input
            type="number"
            id="price"
            class="form-control"
            v-model.number="form.price"
            required
            min="0"
          />
        </div>
        <div class="form-group col-md-6">
          <label for="size">坪數</label>
          <input
            type="number"
            id="size"
            class="form-control"
            v-model.number="form.size"
            required
            min="1"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="address">詳細地址</label>
        <input
          type="text"
          id="address"
          class="form-control"
          v-model="form.address"
          required
        />
      </div>

      <!-- 房屋細節 -->
      <div class="form-row">
        <div class="form-group col-md-3">
          <label for="room">房間數</label>
          <input
            type="number"
            id="room"
            class="form-control"
            v-model.number="form.room"
            required
            min="0"
          />
        </div>
        <div class="form-group col-md-3">
          <label for="bathroom">浴廁數量</label>
          <input
            type="number"
            id="bathroom"
            class="form-control"
            v-model.number="form.bathroom"
            required
            min="0"
          />
        </div>
        <div class="form-group col-md-3">
          <label for="livingroom">客廳數量</label>
          <input
            type="number"
            id="livingroom"
            class="form-control"
            v-model.number="form.livingroom"
            required
            min="0"
          />
        </div>
        <div class="form-group col-md-3">
          <label for="floor">樓層</label>
          <input
            type="number"
            id="floor"
            class="form-control"
            v-model.number="form.floor"
            required
            min="-3"
          />
        </div>
      </div>

      <!-- 房屋類型 -->
      <div class="form-group">
        <label for="houseType">房屋類型</label>
        <select
          id="houseType"
          class="form-control"
          v-model="form.houseType"
          required
        >
          <option value="雅房">雅房</option>
          <option value="分租套房">分租套房</option>
          <option value="獨立套房">獨立套房</option>
          <option value="透天">透天</option>
          <option value="公寓">公寓</option>
          <option value="別墅">別墅</option>
        </select>
      </div>

      <!-- 家具與服務 -->
      <h3 class="section-title">提供家具與服務</h3>
      <div class="furniture-services">
        <label
          v-for="(value, key) in furnitureServices"
          :key="key"
          class="icon-label"
        >
          <input type="checkbox" v-model="furnitureServices[key]" />
          {{ key }}
        </label>
      </div>

      <!-- 房屋限制 -->
      <h3 class="section-title">房屋限制</h3>
      <div class="house-restrictions">
        <label
          v-for="(value, key) in houseRestrictions"
          :key="key"
          class="icon-label"
        >
          <input type="checkbox" v-model="houseRestrictions[key]" />
          {{ key }}
        </label>
      </div>

      <!-- 上傳圖片 -->
      <label for="fileInput">上傳圖片</label>
      <input
        type="file"
        id="fileInput"
        multiple
        @change="handleFileUpload"
        accept="image/*"
      />

      <!-- 圖片預覽 -->
      <div class="image-preview">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="image-container"
        >
          <img :src="image.imageUrl" alt="Preview" class="image-thumbnail" />
          <button @click="removeImage(index)" class="remove-btn">刪除</button>
        </div>
      </div>

      <!-- 提交按鈕 -->
      <button type="submit" class="btn btn-primary mt-3">提交</button>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from "vue";

export default {
  name: "AddHouseForm",
  setup() {
    const form = reactive({
      title: "",
      price: null,
      size: null,
      address: "",
      room: null,
      bathroom: null,
      livingroom: null,
      floor: null,
      houseType: "",
      description: "",
    });

    const furnitureServices = reactive({
      washingMachine: false,
      airConditioner: false,
      refrigerator: false,
      network: false,
    });

    const houseRestrictions = reactive({
      pet: false,
      parkingSpace: false,
      elevator: false,
      balcony: false,
    });

    const images = ref([]);

    const handleFileUpload = (event) => {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        const imageUrl = URL.createObjectURL(file);
        images.value.push({ file, imageUrl });
      });
    };

    const removeImage = (index) => {
      images.value.splice(index, 1);
    };

    const submitForm = () => {
      console.log("表單提交成功！", form);
    };

    const closePage = () => {
      if (window.confirm("確定要關閉這個頁面嗎？")) {
        window.close();
      }
    };

    return {
      form,
      furnitureServices,
      houseRestrictions,
      images,
      handleFileUpload,
      removeImage,
      submitForm,
      closePage,
    };
  },
};
</script>

<style scoped>
.container {
  width: 60%;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
  color: #2c3e50;
  font-weight: bold;
  text-align: center;
}

.image-preview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 10px;
}
</style>
