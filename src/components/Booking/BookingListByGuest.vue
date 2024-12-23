<template>

    <div class="card">



        <Tabs :value="activeTab" @update:value="onTabChange">
            <TabList>
                <Tab :value="0">全部</Tab>
                <Tab :value="1">待回應 ({{ pendingCount }})</Tab>
                <Tab :value="2">預約中 ({{ bookingedCount }})</Tab>
                <Tab :value="3">已取消</Tab>
                <Tab :value="4">歷史紀錄</Tab>
            </TabList>
        </Tabs>



        <DataTable :value="filteredBookingList" stripedRows paginator :rows="5" :rowsPerPageOptions="pageOptions"
            selectionMode="single" sortField="ID" :sortOrder="1" tableStyle="min-width: 40rem"
            emptyMessage="目前沒有任何資料可顯示">

            <template #header>
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xl font-bold">我的預約</span>
                    <Button icon="pi pi-refresh" @click="refresh" rounded raised />
                </div>
            </template>

            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"
                class="text-center text-gray-500" :headerStyle="col.headerStyle" :sortable="col.sortable">
                <!-- 自定義 'photos' 列的內容 -->
                <template v-if="col.field === 'photos'" #body="slotProps">
                    <img src="#" alt="沒圖片">
                </template>
                <!-- 自定義 'status' 列的內容 -->
                <template v-if="col.field === 'status'" #body="slotProps">
                    <Tag :value="slotProps.data.Status" :severity=getSeverity(slotProps.data.status)>
                        {{ statusMap[slotProps.data.status] }}
                    </Tag>
                </template>
                <!-- 自定義 'operate' 列的內容 -->
                <template v-if="col.field === 'operate'" #body="slotProps">
                    <Button v-if="slotProps.data.status === 0 || 1" label="取消預約" severity="danger"
                        @click="confirmDeleteBooking(slotProps.data)" />
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

        <Dialog v-model:visible="deleteBookingDialog" :style="{ width: '450px' }" header="確認" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="selectedBooking">您確定要取消 <b class="text-danger">編號: {{ selectedBooking.bookingId }}</b>
                    的預約嗎?</span>
            </div>
            <template #footer>
                <Button label="Yes" icon="pi pi-check" severity="secondary" text @click="deleteBooking" />
                <Button label="No" icon="pi pi-times" severity="contrast" @click="deleteBookingDialog = false" />
            </template>
        </Dialog>


        <Toast />

    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, inject } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import 'primeicons/primeicons.css'
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';
import { Tag } from 'primevue';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import OverlayBadge from 'primevue/overlaybadge';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';



const BASE_URL = import.meta.env.VITE_APIURL
const TOKEN = localStorage.getItem('jwt');

const bookingList = ref([]);
const filteredBookingList = ref([]);
const activeTab = ref(0); // 默認 0:顯示全部
const confirm = useConfirm();
const toast = useToast();
const selectedBooking = ref({});
const deleteBookingDialog = ref(false);

// 設定 ( 對應屬性 欄位名稱 是否排列 )
const columns = [
    { field: 'photos', header: '', sortable: false, headerStyle: 'width: 10%;' },
    { field: 'houseTitle', header: '房屋名稱', sortable: false, headerStyle: 'width: 15%;' },
    { field: 'houseAddress', header: '房屋地址', sortable: false, headerStyle: 'width: 25%;' },
    { field: 'housePrice', header: '房屋租金', sortable: false, headerStyle: 'width: 10%;' },
    { field: 'bookingDate', header: '預約時間', sortable: true, headerStyle: 'width: 20%;' },
    { field: 'status', header: '狀態', sortable: false, headerStyle: 'width: 10%;' },
    { field: 'operate', header: '', sortable: false, headerStyle: 'width: 10%;' }
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
    try {
        const response = await fetch(`${BASE_URL}/booking/guest`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${TOKEN}`,
            },
        });

        if (!response.ok) {
            // 使用 Error 類型來拋出錯誤
            throw new Error(`HTTP 錯誤! 狀態碼: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        bookingList.value = data;
        console.log('成功載入資料:', data);

        for (const booking of bookingList.value) {
            const houseId = booking.houseId;

            // 獲取圖片
            const photosResponse = await fetch(`${BASE_URL}/houses/getPhotos/${houseId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${TOKEN}`,
                },
            });

            if (photosResponse.ok) {
                const photos = await photosResponse.json();

                booking.photos = photos;
            } else {
                console.warn(`無法獲得 houseId=${houseId} 的圖片，HTTP STATUS: ${photosResponse.status}`);
                booking.photos = [];
            }
        }
        console.log('包含圖片的 bookingList:', bookingList.value);

        useFilter();
    } catch (error) {
        console.error('載入失敗，原因:', error.message);
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

const confirmDeleteBooking = (prod) => {
    selectedBooking.value = prod;
    deleteBookingDialog.value = true;
}

const deleteBooking = () => {
    deleteBookingDialog.value = false;
    selectedBooking.value = {};




    load();
    toast.add({ severity: 'success', summary: 'Successful', detail: '預約已取消', life: 3000 });
};

const refresh = () => {
    load();
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

onMounted(() => {
    load();
});

watch(activeTab, (newValue) => {
    // console.log(newValue);
})

</script>

<style scoped>
.p-tab {
    width: 20%;
    /* 5個 Tab 平均分配，每個佔 20% */
    text-align: center;
    /* 文字置中 */
}
</style>