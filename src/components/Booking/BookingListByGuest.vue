<template>

    <div class="booking-list-container">



        <Tabs :value="activeTab" @update:value="onTabChange">
            <TabList>
                <Tab :value="0">全部</Tab>
                <Tab :value="1">待回應 ({{ pendingCount }})</Tab>
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
                class="text-center" :headerStyle="col.headerStyle" :sortable="col.sortable">

                <!-- 自定義 'houseAddress' 列的內容 -->
                <template v-if="col.field === 'houseAddress'" #body="slotProps">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <!-- 調整按鈕圖示和樣式 -->
                        <Button icon="pi pi-search" class="p-button-rounded p-button-text p-button-info action-button"
                            @click=" showHouseView = true; selectedHouseId = slotProps.data.houseId;"
                            style="width: 2.5rem; height: 2.5rem;" />
                        <!-- 顯示地址內容 -->
                        <div>{{ slotProps.data.houseAddress }}</div>
                    </div>
                </template>

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
                    <Button v-if="slotProps.data.status === 0 || slotProps.data.status === 1" label="取消預約"
                        severity="danger" @click="confirmcancelBooking(slotProps.data)" />
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

        <!-- 取消預約彈窗 -->
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

        <!-- 查看房屋表單彈窗 -->
        <Dialog v-model:visible="showHouseView" :modal="true" :dismissableMask="true" header="查看房屋資訊"
            class="dialog-theme">
            <div class="dialog-container">
                <HouseView :houseId="selectedHouseId" @close="showHouseView = false" />
            </div>
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
import HouseView from "@/View/HouseView.vue";

const BASE_URL = import.meta.env.VITE_APIURL
const TOKEN = localStorage.getItem('jwt');

const bookingList = ref([]);    // 載入的預約列表
const filteredBookingList = ref([]); // 過濾後的預約列表
const activeTab = ref(0); // 默認 0:顯示全部
const toast = useToast();
const selectedBooking = ref({});
const cancelBookingDialog = ref(false);
const loading = ref(false); // 轉圈圈
const showHouseView = ref(false)
const selectedHouseId = ref(null);

// 搜尋功能
const filters = ref({
    global: { value: null, matchMode: "contains" },
});

// 設定欄位 ( 對應屬性 欄位名稱 是否排列 欄位寬度 )
const columns = [
    { field: 'photos', header: '', sortable: false, headerStyle: 'width: 10%;' },
    { field: 'houseTitle', header: '房屋名稱', sortable: false, headerStyle: 'width: 15%;' },
    { field: 'houseAddress', header: '房屋地址', sortable: false, headerStyle: 'width: 25%;' },
    { field: 'housePrice', header: '房屋租金', sortable: true, headerStyle: 'width: 10%;' },
    { field: 'bookingDate', header: '預約時間', sortable: true, headerStyle: 'width: 20%;' },
    { field: 'status', header: '狀態', sortable: false, headerStyle: 'width: 10%;' },
    { field: 'operate', header: '操作', sortable: false, headerStyle: 'width: 10%;' }
];

// 設定 分頁選項
const pageOptions = [5, 10, 20, 50];

// 狀態對應的文字
const statusMap = {
    0: '待回應',//待屋主確認
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
        const response = await fetch(`${BASE_URL}/booking/guest`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`狀態碼: ${response.status} ; ${response.statusText}`);
        }

        const data = await response.json();
        bookingList.value = data;
        console.log('成功載入資料:', data);

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

const confirmcancelBooking = (prod) => {
    selectedBooking.value = prod;
    cancelBookingDialog.value = true;
}

const cancelBooking = async (selectedBooking) => {
    loading.value = true;
    try {
        selectedBooking = convertFormat(selectedBooking);   // 將 bookingDate 拆成 bookingDate bookingTime

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
        cancelBookingDialog.value = false;  // 關閉 Dialog
        loading.value = false;
    }
};

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
            return 'secondary';
    }
}

// 轉成圖片 (僅取得第一張, 沒資料時提供預設圖片)
const getPhoto = (photos) => {
    return (Array.isArray(photos) && photos.length > 0)
        ? `data:image/jpeg;base64,${photos[0].base64}` : placeholderImage;
};

const convertFormat = (selectedBooking) => {
    const [datePart, timePart] = selectedBooking.bookingDate.split(' ');
    return {
        ...selectedBooking,
        bookingDate: datePart,  // 'yyyy-MM-dd'
        bookingTime: timePart   // 'HH:mm:ss'
    };
};

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

// // // 測試選擇目標
// watch(selectedBooking, () => {
//     console.log(selectedBooking)
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