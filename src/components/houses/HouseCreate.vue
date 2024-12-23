<template>
  <div class="container mt-5">
    <h2 class="text-center section-title">新增房屋</h2>
    <hr>
    <form @submit.prevent="submitForm">
      <div class="form-group"> <label for="title">標題</label> <input type="text" id="title" class="form-control"
          v-model="form.title" required /> </div>
      <div class="form-row">
        <div class="form-group col-md-6"> <label for="price">價格</label> <input type="number" id="price"
            class="form-control" v-model.number="form.price" required min="0" /> </div>
        <div class="form-group col-md-6"> <label for="size">坪數</label> <input type="number" id="size"
            class="form-control" v-model.number="form.size" required min="1" /> </div>
      </div>
      <div class="form-group"> <label for="address">詳細地址</label> <input type="text" id="address" class="form-control"
          v-model="form.address" required /> </div>
      <div class="form-row">
        <div class="form-group col-md-3"> <label for="room">房間數</label> <input type="number" id="room"
            class="form-control" v-model.number="form.room" required min="0" /> </div>
        <div class="form-group col-md-3"> <label for="bathroom">浴廁數量</label> <input type="number" id="bathroom"
            class="form-control" v-model.number="form.bathroom" required min="0" /> </div>
        <div class="form-group col-md-3"> <label for="livingroom">客廳數量</label> <input type="number" id="livingroom"
            class="form-control" v-model.number="form.livingroom" required min="0" /> </div>
        <div class="form-group col-md-3"> <label for="floor">樓層</label> <input type="number" id="floor"
            class="form-control" v-model.number="form.floor" required min="-3" /> </div>
      </div>
      <div class="form-group"> <label for="houseType">房屋類型</label> <select id="houseType" class="form-control"
          v-model="form.houseType" required>
          <option value="雅房">雅房</option>
          <option value="分租套房">分租套房</option>
          <option value="獨立套房">獨立套房</option>
          <option value="透天">透天</option>
          <option value="公寓">公寓</option>
          <option value="別墅">別墅</option>
        </select> </div>
      <div class="form-group"> <label> <input type="checkbox" v-model="form.atticAddition" /> 是否為頂樓加蓋 </label> </div>
      <!-- 提供家具與服務 -->
      <hr />
      <h3 class="section-title">提供家具與服務</h3>
      <div class="furniture-services">
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="furnitureServices.washingMachine" />
          <img src="../../assets/icon/house-on/washingMachine.ico" alt="洗衣機" class="icon-image" /> 洗衣機
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="furnitureServices.airConditioner" />
          <img src="../../assets/icon/house-on/airConditioner.ico" alt="空調" class="icon-image" /> 空調
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="furnitureServices.network" />
          <img src="../../assets/icon/house-on/network.ico" alt="網路" class="icon-image" /> 網路
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="furnitureServices.bedstead" />
          <img src="../../assets/icon/house-on/Bedsteck.ico" alt="床架" class="icon-image" /> 床架
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="furnitureServices.mattress" />
          <img src="../../assets/icon/house-on/mattress.ico" alt="床墊" class="icon-image" /> 床墊
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="furnitureServices.refrigerator" />
          <img src="../../assets/icon/house-on/refrigerator.ico" alt="冰箱" class="icon-image" /> 冰箱
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="furnitureServices.ewaterHeater" />
          <img src="../../assets/icon/house-on/ewaterHeater.ico" alt="電熱水器" class="icon-image" /> 電熱水器
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="furnitureServices.gwaterHeater" />
          <img src="../../assets/icon/house-on/gas.ico" alt="瓦斯熱水器" class="icon-image" /> 瓦斯熱水器
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="furnitureServices.television" />
          <img src="../../assets/icon/house-on/TV.ico" alt="電視" class="icon-image" /> 電視
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="furnitureServices.channel4" />
          <img src="../../assets/icon/house-on/channel4.ico" alt="第四台" class="icon-image" /> 第四台
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="furnitureServices.sofa" />
          <img src="../../assets/icon/house-on/sofa.ico" alt="沙發" class="icon-image" /> 沙發
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="furnitureServices.tables" />
          <img src="../../assets/icon/house-on/desk.ico" alt="桌椅" class="icon-image" /> 桌椅
        </label>
      </div>

      <!-- 房屋限制 -->
      <hr />
      <h3 class="section-title">房屋限制</h3>
      <div class="house-restrictions">
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="houseRestrictions.pet" />
          <img src="../../assets/icon/house-on/PET.ico" alt="允許養寵物" class="icon-image" /> 允許養寵物
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="houseRestrictions.parkingSpace" />
          <img src="../../assets/icon/house-on/Parking.ico" alt="提供停車位" class="icon-image" /> 提供停車位
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="houseRestrictions.elevator" />
          <img src="../../assets/icon/house-on/elevator.ico" alt="有電梯" class="icon-image" /> 有電梯
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="houseRestrictions.balcony" />
          <img src="../../assets/icon/house-on/balcony.ico" alt="有陽台" class="icon-image" /> 有陽台
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="houseRestrictions.shortTerm" />
          <img src="../../assets/icon/house-on/shortTerm.ico" alt="允許短期租賃" class="icon-image" /> 允許短期租賃
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="houseRestrictions.cooking" />
          <img src="../../assets/icon/house-on/cooking.ico" alt="允許烹飪" class="icon-image" /> 允許烹飪
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="houseRestrictions.waterDispenser" />
          <img src="../../assets/icon/house-on/waterDispenser.ico" alt="提供飲水機" class="icon-image" /> 提供飲水機
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="houseRestrictions.fee" />
          <img src="../../assets/icon/house-on/FEE.ico" alt="管理費" class="icon-image" /> 管理費
        </label>
        <label class="icon-label">
          <input type="checkbox" v-model.lazy.number="houseRestrictions.genderRestrictions" />
          <img src="../../assets/icon/house-on/gender.ico" alt="性別限制" class="icon-image" /> 性別限制
        </label>
      </div>

      <!-- 性別選項 -->
      <div v-if="houseRestrictions.genderRestrictions">
        <label>
          <input type="radio" name="genderOption" value="1" v-model="genderOption" />
          <img src="../../assets/icon/house-on/male.ico" alt="male" class="icon-image" />
        </label>
        <label>
          <input type="radio" name="genderOption" value="2" v-model="genderOption" />
          <img src="../../assets/icon/house-on/female.ico" alt="female" class="icon-image" />
        </label>
      </div>


      <!-- 設定預約時段 -->
      <hr />
      <h3 class="section-title">預約看房設定</h3>
      <BookingSlotSetting v-model="bookingForm"></BookingSlotSetting>

      <!-- 簡介 -->
      <hr />
      <h3 class="section-title">簡介</h3>
      <div class="form-group">
        <textarea class="form-control" id="description" v-model="form.description"></textarea>
      </div>

      <!-- 上傳圖片 -->
      <hr />
      <label for="fileInput">上傳圖片</label>
      <input type="file" id="fileInput" multiple @change="handleFileUpload" accept="image/*" />

      <!-- 圖片預覽 -->
      <div class="image-preview">
        <div v-for="(image, index) in images" :key="index" class="image-container">
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
import { ref, reactive } from 'vue';
import BookingSlotSetting from '../Booking/BookingSlotSetting.vue';


export default {
  // name: 'AddHouseForm',
  components: {
    BookingSlotSetting
  },
  setup() {
    const form = reactive({
      title: '',
      price: null,
      size: null,
      address: '',
      room: null,
      bathroom: null,
      livingroom: null,
      kitchen: null,
      floor: null,
      description: '',
      houseType: '',
      atticAddition: false
    });

    const furnitureServices = reactive({
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
    });

    const houseRestrictions = reactive({
      pet: false,
      parkingSpace: false,
      elevator: false,
      balcony: false,
      shortTerm: false,
      cooking: false,
      waterDispenser: false,
      fee: false,
      genderRestrictions: false,
    });

    const genderOption = ref(null);
    const images = ref([]);
    const bookingForm = ref({});

    const handleFileUpload = (event) => {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        if (file && file.type.startsWith('image/')) {
          const imageUrl = URL.createObjectURL(file);
          images.value.push({ file, imageUrl });
        } else {
          alert('只能上傳圖片檔案！');
        }
      });
    };

    const removeImage = (index) => {
      images.value.splice(index, 1);
    };

    const submitForm = () => {
      const formData = new FormData();

      // Basic house details
      formData.append('title', form.title || '');
      formData.append('price', form.price || '0');
      formData.append('size', form.size || '0');
      formData.append('address', form.address || ''); // 確認這裡的鍵名和模板一致
      formData.append('room', form.room || '0');
      formData.append('bathroom', form.bathroom || '0');
      formData.append('livingroom', form.livingroom || '0');
      formData.append('kitchen', form.kitchen || '0');
      formData.append('floor', form.floor || '0');
      formData.append('description', form.description || '');
      formData.append('houseType', form.houseType || '');
      formData.append('atticAddition', form.atticAddition ? '1' : '0');
      // Furniture Services (BOOLEAN to BYTE: true = 1, false = 0)
      formData.append('washingMachine', furnitureServices.washingMachine ? '1' : '0');
      formData.append('airConditioner', furnitureServices.airConditioner ? '1' : '0');
      formData.append('network', furnitureServices.network ? '1' : '0');
      formData.append('bedstead', furnitureServices.bedstead ? '1' : '0');
      formData.append('mattress', furnitureServices.mattress ? '1' : '0');
      formData.append('refrigerator', furnitureServices.refrigerator ? '1' : '0');
      formData.append('ewaterHeater', furnitureServices.ewaterHeater ? '1' : '0');
      formData.append('gwaterHeater', furnitureServices.gwaterHeater ? '1' : '0');
      formData.append('television', furnitureServices.television ? '1' : '0');
      formData.append('channel4', furnitureServices.channel4 ? '1' : '0');
      formData.append('sofa', furnitureServices.sofa ? '1' : '0');
      formData.append('tables', furnitureServices.tables ? '1' : '0');

      // House Restrictions (BOOLEAN to BYTE: true = 1, false = 0)
      formData.append('pet', houseRestrictions.pet ? '1' : '0');
      formData.append('parkingSpace', houseRestrictions.parkingSpace ? '1' : '0');
      formData.append('elevator', houseRestrictions.elevator ? '1' : '0');
      formData.append('balcony', houseRestrictions.balcony ? '1' : '0');
      formData.append('shortTerm', houseRestrictions.shortTerm ? '1' : '0');
      formData.append('cooking', houseRestrictions.cooking ? '1' : '0');
      formData.append('waterDispenser', houseRestrictions.waterDispenser ? '1' : '0');
      formData.append('managementFee', houseRestrictions.fee ? '1' : '0');

      // Booking Setting
      formData.append('fromDate', bookingForm.value.fromDate);
      formData.append('toDate', bookingForm.value.toDate);
      formData.append('fromTime', bookingForm.value.fromTime);
      formData.append('toTime', bookingForm.value.toTime);
      formData.append('duration', bookingForm.value.duration);
      formData.append('weekDay', bookingForm.value.weekDay);
      // Object.keys(bookingForm.value).forEach((key) => {
      //   formData.append(key, bookingForm.value[key]);
      // });

      // Gender Restrictions (Specific BYTE values)
      const genderRestrictionsByte = houseRestrictions.genderRestrictions
        ? (genderOption.value === '1' ? '1' : '2')
        : '0';
      formData.append('genderRestrictions', genderRestrictionsByte);

      // Image Handling
      images.value.forEach((image, index) => {
        formData.append('images', image.file);
      });

      // Debug: Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const token = localStorage.getItem('jwt');
      fetch(import.meta.env.VITE_APIURL + '/houses/add', {
        method: 'POST',
        headers: {
              Authorization: token,
              
            },
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
          return response.json();
        })
        .then((data) => {
          alert('房屋新增成功！');
          resetForm();
        })
        .catch((error) => {
          console.error('提交失敗:', error);
          alert('提交失敗：' + error.message);
        });
    };

    const resetForm = () => {
      Object.keys(form).forEach((key) => {
        form[key] = '';
      });
      Object.keys(furnitureServices).forEach((key) => {
        furnitureServices[key] = false;
      });
      Object.keys(houseRestrictions).forEach((key) => {
        houseRestrictions[key] = false;
      });
      images.value = [];
    };

    return {
      form,
      furnitureServices,
      houseRestrictions,
      genderOption,
      images,
      handleFileUpload,
      removeImage,
      submitForm,
      bookingForm,
    };
  },
};
</script>
<style scoped>
body {
  background-color: #f8f9fa;
}

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
  /* 加大字體 */
  margin-bottom: 10px;
  text-align: center;
}

hr {
  margin: 20px 0;
  /* 增加 <hr> 與其他文字間的間隔 */
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.form-group {
  flex: 1;
}

.form-group.col-md-3 {
  flex: 1 0 23%;
  /* 每個元素占 23% 寬度 */
}

.form-group.col-md-6 {
  flex: 1 0 48%;
  /* 每個元素占 48% 寬度 */
}

.form-group.col-md-12 {
  flex: 1 0 100%;
  /* 全寬 */
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-preview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}

.icon-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.icon-label img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.icon-label input[type='checkbox'] {
  margin-right: 10px;
}

.furniture-services {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.house-restrictions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>