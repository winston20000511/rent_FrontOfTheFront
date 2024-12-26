<template>
  <div class="container mt-5">
    <h2 class="text-center section-title">更新房屋</h2>
    <hr />

    <!-- 加載中的提示 -->
    <div v-if="isLoading" class="text-center">
      <p>加載中...</p>
    </div>

    <!-- 表單內容 -->
    <form v-else @submit.prevent="submitForm">
      <!-- 房屋基本資料 -->
      <div class="form-group" :class="{ 'is-invalid': errors.title }">
        <label for="title">標題</label>
        <input
          type="text"
          id="title"
          class="form-control"
          v-model="form.title"
          @input="validateTitle"
          required
          placeholder="不允許輸入特殊字元"
        />
        <div v-if="errors.title" class="invalid-feedback">
          標題不可包含特殊字元！
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-md-3" :class="{ 'is-invalid': errors.room }">
          <label for="room">房間數</label>
          <input
            type="number"
            id="room"
            class="form-control"
            v-model.number="form.room"
            required
            min="0"
            max="255"
            @input="validateNumber('room')"
          />
          <div v-if="errors.room" class="invalid-feedback">
            請輸入 0 到 255 之間的數字！
          </div>
        </div>
        <div class="form-group col-md-3" :class="{ 'is-invalid': errors.bathroom }">
          <label for="bathroom">浴廁數量</label>
          <input
            type="number"
            id="bathroom"
            class="form-control"
            v-model.number="form.bathroom"
            required
            min="0"
            max="255"
            @input="validateNumber('bathroom')"
          />
          <div v-if="errors.bathroom" class="invalid-feedback">
            請輸入 0 到 255 之間的數字！
          </div>
        </div>
        <div class="form-group col-md-3" :class="{ 'is-invalid': errors.livingroom }">
          <label for="livingroom">客廳數量</label>
          <input
            type="number"
            id="livingroom"
            class="form-control"
            v-model.number="form.livingroom"
            required
            min="0"
            max="255"
            @input="validateNumber('livingroom')"
          />
          <div v-if="errors.livingroom" class="invalid-feedback">
            請輸入 0 到 255 之間的數字！
          </div>
        </div>
        <div class="form-group col-md-3" :class="{ 'is-invalid': errors.floor }">
          <label for="floor">樓層</label>
          <input
            type="number"
            id="floor"
            class="form-control"
            v-model.number="form.floor"
            required
            min="-3"
            max="255"
            @input="validateNumber('floor')"
          />
          <div v-if="errors.floor" class="invalid-feedback">
            請輸入 -3 到 255 之間的數字！
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="houseType">房屋類型</label>
        <select id="houseType" class="form-control" v-model="form.houseType" required>
          <option value="雅房">雅房</option>
          <option value="分租套房">分租套房</option>
          <option value="獨立套房">獨立套房</option>
          <option value="透天">透天</option>
          <option value="公寓">公寓</option>
          <option value="別墅">別墅</option>
        </select>
      </div>

      <div class="form-group">
        <label>
          <input type="checkbox" v-model="form.atticAddition" :true-value="true" :false-value="false" />
          是否為頂樓加蓋
        </label>
      </div>

      <!-- 提供家具與服務 -->
      <hr />
      <h3 class="section-title">提供家具與服務</h3>
      <div class="furniture-services">
        <label class="icon-label">
          <input type="checkbox" v-model="form.washingMachine" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/washingMachine.ico" alt="洗衣機" class="icon-image" />
          洗衣機
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.airConditioner" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/airConditioner.ico" alt="空調" class="icon-image" />
          空調
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.network" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/network.ico" alt="網路" class="icon-image" />
          網路
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.bedstead" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/bedstead.ico" alt="床架" class="icon-image" />
          床架
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.mattress" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/mattress.ico" alt="床墊" class="icon-image" />
          床墊
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.refrigerator" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/refrigerator.ico" alt="冰箱" class="icon-image" />
          冰箱
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.ewaterHeater" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/ewaterHeater.ico" alt="電熱水器" class="icon-image" />
          電熱水器
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.gwaterHeater" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/gwaterHeater.ico" alt="瓦斯熱水器" class="icon-image" />
          瓦斯熱水器
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.television" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/television.ico" alt="電視" class="icon-image" />
          電視
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.channel4" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/channel4.ico" alt="第四台" class="icon-image" />
          第四台
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.sofa" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/sofa.ico" alt="沙發" class="icon-image" />
          沙發
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.tables" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/tables.ico" alt="桌椅" class="icon-image" />
          桌椅
        </label>
      </div>

      <!-- 房屋限制 -->
      <hr />
      <h3 class="section-title">房屋限制</h3>
      <div class="house-restrictions">
        <label class="icon-label">
          <input type="checkbox" v-model="form.pet" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/PET.ico" alt="允許養寵物" class="icon-image" />
          允許養寵物
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.parkingSpace" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/Parking.ico" alt="提供停車位" class="icon-image" />
          提供停車位
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.elevator" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/elevator.ico" alt="有電梯" class="icon-image" />
          有電梯
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.balcony" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/balcony.ico" alt="有陽台" class="icon-image" />
          有陽台
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.shortTerm" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/shortTerm.ico" alt="允許短期租賃" class="icon-image" />
          允許短期租賃
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.cooking" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/cooking.ico" alt="允許烹飪" class="icon-image" />
          允許烹飪
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.waterDispenser" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/waterDispenser.ico" alt="提供飲水機" class="icon-image" />
          提供飲水機
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.managementFee" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/FEE.ico" alt="管理費" class="icon-image" />
          管理費
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model="form.genderRestrictions" :true-value="true" :false-value="false" />
          <img src="../../assets/icon/house-on/gender.ico" alt="性別限制" class="icon-image" />
          性別限制
        </label>
      </div>

      <!-- 性別限制選項 -->
      <div v-if="form.genderRestrictions" class="gender-options">
        <label class="icon-label">
          <input
            type="radio"
            name="genderOption"
            value="1"
            v-model="form.genderRestrictions"
          />
          <img src="../../assets/icon/house-on/male.ico" alt="只租男" class="icon-image" />
          只租男
        </label>
        <label class="icon-label">
          <input
            type="radio"
            name="genderOption"
            value="2"
            v-model="form.genderRestrictions"
          />
          <img src="../../assets/icon/house-on/female.ico" alt="只租女" class="icon-image" />
          只租女
        </label>
      </div>

      <!-- 簡介 -->
      <hr />
      <h3 class="section-title">簡介</h3>
      <div class="form-group">
        <textarea
          class="form-control"
          id="description"
          v-model="form.description"
        ></textarea>
      </div>

      <!-- 現有圖片 (若後端有提供) -->
      <div v-if="existingImages.length > 0">
        <hr />
        <h3 class="section-title">現有圖片</h3>
        <div class="image-preview">
          <div v-for="(imgObj, idx) in existingImages" :key="imgObj.id" class="preview-item">
            <img :src="imgObj.base64" alt="existing image" />
            <!-- 刪除舊圖片按鈕 -->
            <button type="button" class="btn btn-danger btn-sm remove-btn" @click="removeExistingImage(idx)">
              <img src="../../assets/delete-24.png" alt="刪除" class="delete-icon" /> 刪除
            </button>
          </div>
        </div>
      </div>

      <!-- 上傳新圖片 -->
      <hr />
      <h3 class="section-title">上傳新圖片</h3>
      <div class="form-group">
        <label for="images">選擇新圖片</label>
        <input type="file" id="images" multiple @change="onFileChange" />
      </div>
      <div class="image-preview" v-if="previewImages.length">
        <div v-for="(preview, idx) in previewImages" :key="idx" class="preview-item">
          <img :src="preview" alt="新圖片預覽" />
        </div>
      </div>
      <!-- 提交按鈕 -->
      <button type="submit" class="btn btn-primary mt-3">
        提交更新
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "HouseUpdate",
  props: {
    houseId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      baseUrl: "http://localhost:8080/api/houses",
      isLoading: true, // 加載狀態

      // 主要表單資料，對應後端資料結構
      form: {
        title: "",
        price: 0,
        size: 0,
        address: "",
        room: 0,
        bathroom: 0,
        livingroom: 0,
        floor: 0,
        houseType: "",
        atticAddition: false,

        // 提供家具
        washingMachine: false,
        airConditioner: false,
        network: false,
        bedstead: false,
        mattress: false,
        refrigerator: false,
        ewaterHeater: false,
        gwaterHeater: false,
        television: false,
        channel4: false,
        sofa: false,
        tables: false,

        // 房屋限制
        pet: false,
        parkingSpace: false,
        elevator: false,
        balcony: false,
        shortTerm: false,
        cooking: false,
        waterDispenser: false,
        managementFee: false,
        genderRestrictions: 0, // 0=不限, 1=只租男, 2=只租女

        // 描述
        description: "",
      },
      // 後端回傳的既有圖片 (base64 -> data URL)
      existingImages: [],
      // 想要刪除的舊圖片清單 (base64)
      removedImages: [],
      // 新上傳檔案
      files: [],
      // 新圖片預覽
      previewImages: [],

      // 錯誤訊息
      errors: {
        title: false,
        room: false,
        bathroom: false,
        livingroom: false,
        floor: false,
      },
      errorMessages: {
        title: "",
        room: "",
        bathroom: "",
        livingroom: "",
        floor: "",
      },
    };
  },
  mounted() {
    this.fetchHouseDetails();
  },
  methods: {
    // 撈取詳細資訊 & 舊圖片
    async fetchHouseDetails() {
      try {
        const token = localStorage.getItem("jwt");

        // 取得房屋詳細資訊
        const detailRes = await fetch(`${this.baseUrl}/details/${this.houseId}`, {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        if (!detailRes.ok) {
          throw new Error(`詳細資訊錯誤: ${detailRes.status}`);
        }

        const data = await detailRes.json();

        // 將後端回傳的資料塞到 form
        this.form.title = data.title || "";
        this.form.price = data.price || 0;
        this.form.size = data.size || 0;
        this.form.address = data.address || "";
        this.form.room = data.room || 0;
        this.form.bathroom = data.bathroom || 0;
        this.form.livingroom = data.livingroom || 0;
        this.form.floor = data.floor || 0;
        this.form.houseType = data.houseType || "";
        this.form.atticAddition = data.atticAddition === true;

        // 提供家具
        this.form.washingMachine = data.washingMachine === true;
        this.form.airConditioner = data.airConditioner === true;
        this.form.network = data.network === true;
        this.form.bedstead = data.bedstead === true;
        this.form.mattress = data.mattress === true;
        this.form.refrigerator = data.refrigerator === true;
        this.form.ewaterHeater = data.ewaterHeater === true;
        this.form.gwaterHeater = data.gwaterHeater === true;
        this.form.television = data.television === true;
        this.form.channel4 = data.channel4 === true;
        this.form.sofa = data.sofa === true;
        this.form.tables = data.tables === true;

        // 房屋限制
        this.form.pet = data.pet === true;
        this.form.parkingSpace = data.parkingSpace === true;
        this.form.elevator = data.elevator === true;
        this.form.balcony = data.balcony === true;
        this.form.shortTerm = data.shortTerm === true;
        this.form.cooking = data.cooking === true;
        this.form.waterDispenser = data.waterDispenser === true;
        this.form.managementFee = data.managementFee === true;

        // 性別限制
        this.form.genderRestrictions = data.genderRestrictions || 0;

        // 描述
        this.form.description = data.description || "";

        // 再撈取舊照片
        const photoRes = await fetch(`${this.baseUrl}/getPhotos/${this.houseId}`, {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        if (!photoRes.ok) {
          throw new Error(`照片讀取錯誤: ${photoRes.status}`);
        }

        const arrayWithId = await photoRes.json(); // e.g. [ { id:"101", base64:"xxx"}, ... ]
        if (Array.isArray(arrayWithId) && arrayWithId.length > 0) {
          // 把每筆都做成 { id: 101, base64: "data:image/jpeg;base64,..." }
          this.existingImages = arrayWithId.map(item => ({
            id: Number(item.id),
            base64: `data:image/jpeg;base64,${item.base64}`,
          }));
        } else {
          this.existingImages = [];
        }

        // 加載完成後，設置 isLoading 為 false
        this.isLoading = false;
      } catch (error) {
        console.error("無法獲取房屋資料:", error);
        this.isLoading = false; // 即使出錯，也停止加載狀態
      }
    },

    // 監聽新圖片檔案選擇 -> 產生前端預覽
    onFileChange(e) {
      this.files = Array.from(e.target.files);
      this.previewImages = [];

      this.files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          this.previewImages.push(evt.target.result);
        };
        reader.readAsDataURL(file);
      });
    },

    // 移除舊圖片
    removeExistingImage(idx) {
      const toRemove = this.existingImages[idx];
      this.removedImages.push(toRemove); // 記錄要刪除的圖片
      this.existingImages.splice(idx, 1); // 立即從畫面移除
    },

    // 驗證標題
    validateTitle() {
      const regex = /^[\w\s\u4e00-\u9fa5]*$/; // 僅允許中英文、數字、空格
      this.errors.title = !regex.test(this.form.title);
      this.errorMessages.title = this.errors.title ? "標題不可包含特殊字元！" : "";
    },

    // 驗證數字欄位
    validateNumber(field) {
      const value = this.form[field];
      if (field === 'floor') {
        if (value < -3 || value > 255) {
          this.errors[field] = true;
          this.errorMessages[field] = "樓層必須介於 -3 到 255！";
        } else {
          this.errors[field] = false;
          this.errorMessages[field] = "";
        }
      } else {
        if (value < 0 || value > 255) {
          this.errors[field] = true;
          this.errorMessages[field] = `${field === "room" ? "房間數" : field === "bathroom" ? "浴廁數量" : "客廳數量"}必須介於 0 到 255！`;
        } else {
          this.errors[field] = false;
          this.errorMessages[field] = "";
        }
      }
    },

    // 提交更新 (含文字、布林、新圖片、刪除列表)
    async submitForm() {
      try {
        // 表單驗證
        this.validateTitle();
        ['room', 'bathroom', 'livingroom', 'floor'].forEach(field => this.validateNumber(field));
        if (Object.values(this.errors).some(value => value)) {
          alert("請修正表單中的錯誤！");
          return;
        }

        // 房屋基本資料（文字欄位）
        const houseData = {
          title: this.form.title,
          price: String(this.form.price), // 字串化，確保後端能正確接收
          size: String(this.form.size),
          address: this.form.address,
          room: String(this.form.room),
          bathroom: String(this.form.bathroom),
          livingroom: String(this.form.livingroom),
          floor: String(this.form.floor),
          houseType: this.form.houseType || "",
          atticAddition: this.form.atticAddition ? "1" : "0",
          description: this.form.description || "",
          genderRestrictions: String(this.form.genderRestrictions), // 性別限制 (0=不限, 1=只租男, 2=只租女)
        };

        // 家具服務（布林欄位）
        const furnitureServices = {
          washingMachine: this.form.washingMachine ? "1" : "0",
          airConditioner: this.form.airConditioner ? "1" : "0",
          network: this.form.network ? "1" : "0",
          bedstead: this.form.bedstead ? "1" : "0",
          mattress: this.form.mattress ? "1" : "0",
          refrigerator: this.form.refrigerator ? "1" : "0",
          ewaterHeater: this.form.ewaterHeater ? "1" : "0",
          gwaterHeater: this.form.gwaterHeater ? "1" : "0",
          television: this.form.television ? "1" : "0",
          channel4: this.form.channel4 ? "1" : "0",
          sofa: this.form.sofa ? "1" : "0",
          tables: this.form.tables ? "1" : "0",
        };

        // 房屋限制（布林欄位）
        const houseRestrictions = {
          pet: this.form.pet ? "1" : "0",
          parkingSpace: this.form.parkingSpace ? "1" : "0",
          elevator: this.form.elevator ? "1" : "0",
          balcony: this.form.balcony ? "1" : "0",
          shortTerm: this.form.shortTerm ? "1" : "0",
          cooking: this.form.cooking ? "1" : "0",
          waterDispenser: this.form.waterDispenser ? "1" : "0",
          managementFee: this.form.managementFee ? "1" : "0",
        };

        // 舊圖片 ID（保留清單）
        const existingImageIds = this.existingImages.map(img => img.id);

        // 組裝 FormData
        const formData = new FormData();

        // 添加房屋基本資料
        formData.append('houseData', JSON.stringify(houseData));

        // 添加家具布林
        formData.append('furnitureServices', JSON.stringify(furnitureServices));

        // 添加房屋限制布林
        formData.append('houseRestrictions', JSON.stringify(houseRestrictions));

        // 添加保留的舊圖片 ID
        existingImageIds.forEach((id) => {
          formData.append('existingImageIds', id);
        });

        // 添加新圖片（若有）
        this.files.forEach((file) => {
          formData.append('newImages', file);
        });

        // 發送請求到後端
        const response = await fetch(
          `http://localhost:8080/api/houses/update/${this.houseId}`,
          {
            method: 'POST',
            headers: {
              Authorization: localStorage.getItem('jwt'), // Token 驗證
              // Content-Type 不要手動設定，瀏覽器會自動處理
            },
            body: formData,
          }
        );

        // 處理回應
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`更新失敗，狀態碼: ${response.status} - ${errorText}`);
        }

        // 更新成功提示
        alert('房屋更新成功！');
        this.$emit('close'); // 關閉編輯視窗
      } catch (error) {
        console.error('房屋更新失敗:', error);
        alert('房屋更新失敗，請稍後再試！');
      }
    },
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
  font-size: 1.75em;
  margin-bottom: 10px;
  text-align: center;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.form-group {
  flex: 1;
}

.is-invalid .form-control {
  border-color: red;
}

.invalid-feedback {
  color: red;
  font-size: 0.9em;
  margin-top: 5px;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-item img {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  object-fit: cover;
  margin-bottom: 5px;
}

.remove-btn {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  padding: 4px 8px;
  margin-top: 3px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-btn .delete-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.remove-btn:hover {
  background-color: #c82333;
}

.icon-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.icon-label img.icon-image {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.icon-label input[type="checkbox"],
.icon-label input[type="radio"] {
  margin-right: 10px;
}

.furniture-services,
.house-restrictions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.gender-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-preview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .container {
    width: 90%;
  }

  .section-title {
    font-size: 1.5em;
  }

  .icon-label img.icon-image {
    width: 20px;
    height: 20px;
  }

  .image-preview img {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .container {
    width: 100%;
    padding: 10px;
    border-radius: 0;
    box-shadow: none;
  }

  .section-title {
    font-size: 1.25em;
  }

  .icon-label img.icon-image {
    width: 18px;
    height: 18px;
  }

  .image-preview img {
    width: 60px;
    height: 60px;
  }

  .form-row {
    flex-direction: column;
  }

  .form-group.col-md-3,
  .form-group.col-md-6,
  .form-group.col-md-12 {
    flex: 1 0 100%;
  }
}
</style>
