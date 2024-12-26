<template>

    <div class="booking-list-container">



        <Tabs :value="activeTab" @update:value="onTabChange">
            <TabList>
                <Tab :value="0">全部</Tab>
                <Tab :value="1">待確認 ({{ pendingCount }})</Tab>
                <Tab :value="2">預約中 ({{ bookingedCount }})</Tab>
                <Tab :value="3">已取消</Tab>
                <Tab :value="4">已完成</Tab>
            </TabList>
        </Tabs>



        <DataTable :value="filteredBookingList" :rows="5" :rowsPerPageOptions="pageOptions" :sortOrder="1"
            selectionMode="single" sortField="ID" tableStyle="min-width: 40rem" stripedRows paginator :filters="filters"
            filterDisplay="row" emptyMessage="目前沒有任何資料可顯示">

            <template #header>
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <i class="pi pi-search search-icon"></i>
                        <InputText v-model="filters['global'].value" placeholder="搜尋" class="search-input" />
                    </div>
                    <Button icon="pi pi-refresh" @click="refresh" rounded raised :loading="loading" />
                </div>
            </template>

            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"
                class="text-center text-gray-500" :headerStyle="col.headerStyle" :sortable="col.sortable">

                <!-- 自定義 'photos' 列的內容 -->
                <template v-if="col.field === 'photos'" #body="slotProps">
                    <div class="flex items-center justify-center gap-2" style="width: 100%; height: 80px;">
                        <img :src="getPhoto(slotProps.data.photos)" alt="房屋圖片"
                            style="width: 100%; height: 100%; object-fit: fill;" />
                    </div>
                </template>

                <!-- 自定義 'status' 列的內容 -->
                <template v-if="col.field === 'status'" #body="slotProps">
                    <Tag :value="slotProps.data.Status" :severity=getSeverity(slotProps.data.status)>
                        {{ statusMap[slotProps.data.status] }}
                    </Tag>
                </template>

                <!-- 自定義 'operate' 列的內容 -->
                <template v-if="col.field === 'operate'" #body="slotProps">
                    <Button v-if="slotProps.data.status === 0" label="處　理" severity="info"
                        @click="confirmProcessBooking(slotProps.data)"><i class="bi bi-text-paragraph">處　理</i></Button>
                    <Button v-if="slotProps.data.status === 1" label="取消預約" severity="danger"
                        @click="confirmcancelBooking(slotProps.data)" />
                </template>
            </Column>

            <template #empty>
                <div class="flex justify-center">
                    <p>查無資料</p>
                </div>
            </template>

            <template #footer>
                共有 {{ filteredBookingList ? filteredBookingList.length : 0 }} 筆
            </template>
        </DataTable>

        <Dialog v-model:visible="cancelBookingDialog" :style="{ width: '450px' }" header="確認" :modal="true"
            :contentStyle="{ fontSize: '18px' }">

            <div class="flex items-center gap-4 ">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="selectedBooking">您確定要取消 <b class="text-danger">編號: {{ selectedBooking.bookingId }}</b>
                    的預約嗎?</span>
            </div>

            <div class="booking-time-container">
                <b>預約時間：</b>
                <span>{{ selectedBooking.bookingDate }}</span>
            </div>

            <template #footer>
                <Button label="是" icon="pi pi-check" severity="secondary" @click="cancelBooking(selectedBooking)"
                    :loading="loading" />
                <Button label="否" icon="pi pi-times" severity="contrast" @click="cancelBookingDialog = false"
                    :loading="loading" />
            </template>
        </Dialog>


        <Dialog v-model:visible="processBookingDialog" :style="{ width: '450px' }" header="處理預約確認" :modal="true"
            :contentStyle="{ fontSize: '18px' }">
            <div class="flex items-center gap-4">
                <i class="pi pi-question-circle !text-3xl text-warning" />
                <span v-if="selectedBooking">
                    您是否同意處理 <b class="text-primary">編號: {{ selectedBooking.bookingId }}</b> 的預約？
                </span>
            </div>

            <div class="booking-time-container">
                <b>預約時間：</b>
                <span>{{ selectedBooking.bookingDate }}</span>
            </div>

            <div class="flex justify-between gap-4 mt-4">
                <!-- 拒絕按鈕 -->
                <Button label="拒絕" icon="pi pi-times-circle" severity="danger"
                    @click="processBooking(selectedBooking, false)" style="width: 48%;" :loading="loading" />

                <!-- 同意按鈕 -->
                <Button label="同意" icon="pi pi-check" severity="success" @click="processBooking(selectedBooking, true)"
                    style="width: 48%;" :loading="loading" />
            </div>
            <template #footer>

                <Button label="否" icon="pi pi-times" severity="contrast" @click="processBookingDialog = false"
                    :loading="loading" />
            </template>
        </Dialog>


        <Toast />

    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, inject } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from "primevue/inputtext";
import Toast from 'primevue/toast';
import TabList from 'primevue/tablist';
import Tabs from 'primevue/tabs';
import Tab from 'primevue/tab';
import Dialog from 'primevue/dialog';
import placeholderImage from "@/assets/no-image.png";
import 'primeicons/primeicons.css'
import { Tag } from 'primevue';
import { useToast } from "primevue/usetoast";


const BASE_URL = import.meta.env.VITE_APIURL
const TOKEN = localStorage.getItem('jwt');

const bookingList = ref([]);    // 載入的預約列表
const filteredBookingList = ref([]); // 過濾後的預約列表
const activeTab = ref(0); // 默認 0:顯示全部
const toast = useToast();   //右上角提示視窗 (可以直接使用)
const selectedBooking = ref({}); // 目前選擇的預約
const cancelBookingDialog = ref(false);
const processBookingDialog = ref(false);
const loading = ref(false); // 轉圈圈

// 搜尋功能
const filters = ref({
    global: { value: null, matchMode: "contains" },
});

// 設定欄位 ( 對應屬性 欄位名稱 是否排列 欄位寬度 )
const columns = [
    { field: 'photos', header: '', sortable: false, headerStyle: 'width: 10%;' },
    { field: 'houseTitle', header: '房屋名稱', sortable: false, headerStyle: 'width: 15%;' },
    { field: 'houseAddress', header: '房屋地址', sortable: false, headerStyle: 'width: 25%;' },
    { field: 'housePrice', header: '房屋租金', sortable: false, headerStyle: 'width: 10%;' },
    { field: 'bookingDate', header: '預約時間', sortable: true, headerStyle: 'width: 20%;' },
    { field: 'status', header: '狀態', sortable: false, headerStyle: 'width: 10%;' },
    { field: 'operate', header: '操作', sortable: false, headerStyle: 'width: 10%;' }
];

// 設定 分頁選項
const pageOptions = [5, 10, 20, 50];

// 狀態對應的文字
const statusMap = {
    0: '待確認',//待屋主確認
    1: '預約中',//屋主接受
    2: '已取消',//屋主拒絕
    3: '已取消',//屋主取消
    4: '已取消',//租客取消
    5: '未回應',//逾期
    6: '已完成'
};

// 載入數據
const load = async () => {
    loading.value = true;
    try {
        const response = await fetch(`${BASE_URL}/booking/host`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`狀態碼: ${response.status} ; ${response.statusText}`);
        }

        const data = await response.json();
        console.log('成功載入資料:', data);
        bookingList.value = data;

        for (const booking of bookingList.value) {
            const houseId = booking.houseId;

            // 獲取圖片
            const photosResponse = await fetch(`${BASE_URL}/houses/getPhotos/${houseId}`, {
                headers: {

                    'authorization': `${TOKEN}`,
                },
            });

            if (photosResponse.ok) {
                const photos = await photosResponse.json();

                booking.photos = photos;
            } else {
                throw new Error(`狀態碼: ${photosResponse.status} ; 無法獲得 houseId=${houseId} 的圖片 ;`);
                booking.photos = [];
            }
        }

        useFilter(); // 過濾載入的資料
    } catch (error) {
        console.error('載入失敗，原因:', error.message);
    } finally {
        selectedBooking.value = {}; // 清空所選預約
        loading.value = false;
    }
};

// 過濾數據
const useFilter = () => {
    const list = bookingList.value;
    if (activeTab.value === 0) {
        // 顯示 全部
        filteredBookingList.value = list;
    }
    else if (activeTab.value === 1) {
        // 顯示 待回應
        filteredBookingList.value = list.filter((item) => item.status === 0);
    } else if (activeTab.value === 2) {
        // 顯示 預約中
        filteredBookingList.value = list.filter((item) => item.status === 1);
    } else if (activeTab.value === 3) {
        // 顯示 已取消
        filteredBookingList.value = list.filter((item) => item.status === 2 || item.status === 3 || item.status === 4 || item.status === 5);
    } else if (activeTab.value === 4) {
        // 顯示 已完成
        filteredBookingList.value = list.filter((item) => item.status === 6);
    }
};

// 紀錄 待處理 的數量
const pendingCount = computed(() => {
    return Array.isArray(bookingList.value) ? bookingList.value.filter(booking => booking.status === 0).length : 0;
});

// 紀錄 已預約 的數量
const bookingedCount = computed(() => {
    return Array.isArray(bookingList.value) ? bookingList.value.filter(booking => booking.status === 1).length : 0;
});

// 標題換頁
const onTabChange = (tabValue) => {
    activeTab.value = parseInt(tabValue); // 確保轉換為數字類型
    useFilter();
};

const confirmProcessBooking = (prod) => {
    selectedBooking.value = prod;
    processBookingDialog.value = true;
}


const confirmcancelBooking = (prod) => {
    selectedBooking.value = prod;
    cancelBookingDialog.value = true;
}

const cancelBooking = async (selectedBooking) => {
    loading.value = true;
    try {
        selectedBooking.value.status = 3;   // ( 3: 屋主取消)
        convertFormat(selectedBooking.bookingDate); // 拆成 Day Hour 裝回 selectedBooking

        const response = await fetch(`${BASE_URL}/booking/guest`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${TOKEN}`,
            },
            body: JSON.stringify(selectedBooking),
        });

        if (!response.ok) {
            throw new Error(`狀態碼: ${response.status} ; ${response.statusText}`);
        }
        const data = await response.json();

        toast.add({ severity: data.status, summary: data.message, life: 4000 });
        load();
    }
    catch (error) {
        console.error('載入失敗，原因:', error.message);
    } finally {
        selectedBooking.value = {}; // 清空所選預約
        cancelBookingDialog.value = false;
        loading.value = false;
    }
};


const processBooking = async (selectedBooking, isAgreed) => {
    loading.value = true;
    try {
        convertFormat(selectedBooking.bookingDate); // 拆成 Day Hour 裝回 selectedBooking

        selectedBooking.status = isAgreed ? 1 : 2;  // ( 1: 屋主接受 ; 2: 屋主拒絕)

        const response = await fetch(`${BASE_URL}/booking/host`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${TOKEN}`,
            },
            body: JSON.stringify(selectedBooking),
        });

        if (!response.ok) {
            throw new Error(`狀態碼: ${response.status} ; ${response.statusText}`);
        }

        const data = await response.json();

        toast.add({ severity: data.status, summary: data.message, life: 4000 });
        load();
    }
    catch (error) {
        console.error('載入失敗，原因:', error.message);
    }
    finally {
        selectedBooking.value = {}; // 清空所選預約
        processBookingDialog.value = false;
        loading.value = false;
    };
}

const refresh = () => {
    load();
    toast.add({ severity: 'success', summary: '資料更新', life: 2000 });
}

// 將預約狀態轉成文字
const getSeverity = (status) => {
    switch (status) {
        case 0:
            return 'info';
        case 1:
            return 'success';
        case 2:
        case 3:
        case 4:
            return 'danger';
        case 5:
            return 'warn';
        case 6:
            return 'contrast';
    }
}

// 轉成圖片 (僅取得第一張, 沒資料時提供預設圖片)
const getPhoto = (photos) => {
    return (Array.isArray(photos) && photos.length > 0)
        ? `data:image/jpeg;base64,${photos[0].base64}` : placeholderImage;
};

const convertFormat = (date) => {
    const [datePart, timePart] = date.split(' ');
    selectedBooking.bookingDate = datePart;  // 'yyyy-MM-dd'
    selectedBooking.bookingTime = timePart;  // 'HH:mm:ss'
}

onMounted(() => {
    load();
});

// 測試換頁
// watch(activeTab, (newValue) => { 
//      console.log("這是測試 換頁: "+newValue);
// })

// 測試搜尋
// watch(filters, () => {
//     console.log("這是測試 搜尋: " + filters.value.global.value)
// }, { deep: true });

</script>

<style scoped>
/** 欄位寬度 */
.p-tab {
    width: 20%;
    /* 5個 Tab 平均分配，每個佔 20% */
    text-align: center;
    /* 文字置中 */
}

/**  預約時間 添加樣式*/
.booking-time-container {
    background-color: #f0f8ff;
    /* 淺藍色背景 */
    padding: 10px;
    /* 內邊距 */
    border-radius: 5px;
    /* 圓角 */
    margin-top: 10px;
    /* 顯示距離上方有空隙 */
    font-weight: bold;
    color: #2a4d7b;
    /* 深藍色字體 */
    border: 1px solid #2a4d7b;
    /* 添加邊框 */
}

.booking-time-container span {
    color: #333;
    /* 文字顏色 */
}



/* 搜尋欄樣式 */
.search-bar {
    display: flex;
    align-items: center;
}

.search-icon {
    margin-right: 12px;
}

.search-input {
    width: 300px;
    border: 1px solid #bae6fd;
    border-radius: 5px;
    padding: 8px;
}


.booking-list-container {
    padding: 20px;
    background-color: #f0f9ff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>