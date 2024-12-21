<script setup>
    import { onMounted, onUnmounted, ref } from 'vue';
    import { Offcanvas } from 'bootstrap';

    const searchInputRef = ref(null);
    const searchListRef = ref(null);
    const searchListPosRef = ref({top:0 , left:0 , width: 0}) 
    const searchListReuslt=ref([])   
    const myOffcanvasRef = ref(null);
    const offcanvasInstance= ref(null);
    const iconBtnRef =ref(null);

    const emits = defineEmits(['add-marker'])

    let isComposing = false; //判斷是否正在打字
    let keywordUrl='http://localhost:8080/api/keyword'
    let mapUrl='http://localhost:8080/api/map'

    let token = localStorage.getItem('jwt');
    const response = await fetch(keywordUrl,{
            method:'POST',
            headers: {'Content-Type': 'text/plain',
                    'authorization':  `${token}`
            },
            body:searchInputRef.value.value
    });

    onMounted(() => {
    document.addEventListener('click', closeSearchList);
    if (myOffcanvasRef.value) {
        offcanvasInstance.value = new Offcanvas(myOffcanvasRef.value);
    }
    });

    onUnmounted(() => {
    // 移除事件監聽器
    document.removeEventListener('click', closeSearchList);
    });

    const compositionStart = ()=> {
        isComposing = true;
    }
    const compostitionEnd = ()=> {
        isComposing = false;
        showKeyWordFetch();
    }
    
    const showSearchList = ()=>{
        if (searchInputRef.value){
            const listRect = searchInputRef.value.getBoundingClientRect();
            searchListPosRef.value={
                top: listRect.bottom,
                left: listRect.left,
                width: listRect.width
            };
            searchListRef.value.style.display='block';
        }
    }
    const closeSearchList = (event)=>{
        if(searchListRef.value && !searchListRef.value.contains(event.target) &&
            searchInputRef.value && !searchInputRef.value.contains(event.target) &&
            myOffcanvasRef.value && !myOffcanvasRef.value.contains(event.target)){

            searchListPosRef.value.innerHTML="";
            searchListRef.value.style.display ='none';
            offcanvasInstance.value.hide();
        }
    }
    const clickSearchBtn = ()=>{
        showMapFetch();
    }
    const enterSearchBtn = (event)=>{
        if (event.key === 'Enter'){
		    showMapFetch();
        }
    }
    
    const showKeyWordFetch = async () =>{
        const response = await fetch(keywordUrl,{
            method:'POST',
            headers: {'Content-Type': 'text/plain',
                    'authorization': `${token}`
            },
            body:searchInputRef.value.value
        });

        if (!response.ok){
            throw new Error('Network response was not ok')
        }

        const data = await response.json();
        console.log('Data received:' , data);
        showLKeyWrodList(data);
    }

    const showLKeyWrodList = async (data)=>{
        searchListReuslt.value = [];
        data.forEach(k=>{

            searchListReuslt.value.push({
                id: Date.now() + Math.random(),
                address: k.address,
                paidDate: k.paidDate,
            });
        })
        
    }

    const showMapFetch = async (address)=>{
        if (address){
            searchInputRef.value.value = address;
        }
        
        const inputData = {
            origin: searchInputRef.value.value
        }


        const response = await fetch(mapUrl,{
            method: 'POST',
            headers:{'Content-Type': 'application/json',
                'authorization': `${token}`
            },
            body: JSON.stringify(inputData)
        });

        if (!response.ok){
            throw new Error('Network response was not ok')
        }

        const data = await response.json();
        emits('add-marker',data)
    }

    const handleListClick = (item)=>{
        searchInputRef.value.value=item.address;
        searchInputRef.value.innerHTML='';
        searchListRef.value.style.display ='none';
        offcanvasInstance.value.hide();
        showMapFetch();
    }

    const checkPaidDate = (item)=>{
        const dateSpec = '1999-01-01T00:00:00';
        
        const sourceDate = new Date(item.paidDate);
        const targetDate = new Date(dateSpec)
        if (sourceDate>targetDate){
            return "bi bi-hand-thumbs-up"
        }else{
            return ""
        }
        
    }

</script>
<template>
    <!-- 選項位置 -->
    <div class="offcanvas offcanvas-end" 
    data-bs-scroll="true" 
    data-bs-backdrop="false" 
    tabindex="-1" 
    id="offcanvasScrolling" 
    aria-labelledby="offcanvasScrollingLabel" 
    ref="myOffcanvasRef">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasScrollingLabel">User Setting</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body container py-1 px-4 bg-body custom-left-shadow">
            <p class="option-title">租金範圍</p>
            <div class="row gy-4">
                <div class="col-12 col-md-6">
                    <label for="price-minimum">Minimum</label>
                    <input type="text" id="price-minimum" class="form-control" value=0>
                </div>
                <div class="col-12 col-md-6">
                    <label for="price-maximum">Maximum</label>
                    <input type="text" id="price-maximum" class="form-control" value=0>
                </div>
                <div class="col-12 col-md-6">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="adfirst" checked>
                        <label class="form-check-label" for="adfirst">
                            廣告優先
                        </label>
                    </div>
                </div>
            </div>
            <p class="option-title">房屋類型</p>
            <div class="row gy-4">
                <div class="col-12 col-md-6">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="house-typeone" checked>
                        <label class="form-check-label" for="house-typeone">
                            透天
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="house-typetwo" checked>
                        <label class="form-check-label" for="house-typetwo">
                            獨立套房
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="house-typethree" checked>
                        <label class="form-check-label" for="house-typethree">
                            分租套房
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="house-typefour" checked>
                        <label class="form-check-label" for="house-typefour">
                            雅房
                        </label>
                    </div>
                </div>
            </div>
            <p class="option-title">搜尋方式</p>
            <div class="row gy-4">
                <div class="col-12 col-md-12">
                    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked>
                        <label class="btn btn-outline-primary" for="btnradio1">廣告優先</label>

                        <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
                        <label class="btn btn-outline-primary" for="btnradio2">價錢優先</label>

                        <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off">
                        <label class="btn btn-outline-primary" for="btnradio3">點擊優先</label>
                    </div>
                    
                    <div class="btn-group" role="group" aria-label="Basic radio toggle button group" style="margin-top: 5px;" >
                        <input type="radio" class="btn-check" name="btnradio2" id="btnradio11" autocomplete="off" checked>
                        <label class="btn btn-outline-primary" for="btnradio11">低到高</label>

                        <input type="radio" class="btn-check" name="btnradio2" id="btnradio22" autocomplete="off">
                        <label class="btn btn-outline-primary" for="btnradio22">高到低</label>
                    </div>
                </div>
            </div>
        </div>
    </div>

<div class="filter" id="filter">
    <div class="filter-left">
        <input type="text" 
                placeholder="Address, neighborhood, city, ZIP" 
                id="search" 
                class="form-control me-2" 
                data-bs-toggle="offcanvas" 
                data-bs-target="#offcanvasScrolling" 
                aria-controls="offcanvasScrolling"
                ref="searchInputRef"
                v-on:input="showSearchList"
                v-on:compositionstart="compositionStart"
                v-on:compositionend="compostitionEnd"
                v-on:click="showSearchList"
                v-on:keyup="enterSearchBtn"> 
        <i class="fa-solid fa-magnifying-glass" ref="iconBtnRef" v-on:click="clickSearchBtn"></i>
    </div>
    <ul class="searchList position-absolute mt-1 bg-white border rounded shadow"
        ref="searchListRef"
        v-bind:style="{top: `${searchListPosRef.top}px` , 
                        left: `${searchListPosRef.left}px`,
                        width: `${searchListPosRef.width}px`}"
        >
        <li v-for="item in searchListReuslt"
            v-bind:key="item.id"
            class="custom-list"
            v-on:click="handleListClick(item)"
            >
        {{ item.address }}<i :class="checkPaidDate(item)"></i></li>
    </ul>
</div>
</template>

<style scoped>
.filter{
    display: flex;
    width: 100%;
    height: 10vh;
}
.filter-left{
    width: 65%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}
.fa-magnifying-glass{
    position: absolute;
    left: 95%;
}
.fa-magnifying-glass:hover{
	font-size: 20px;
}

.filter-left input[type="text"]{
    width: 700px;
    height: 40px;
    margin: 0px auto;
    font-size: 20px;
    padding-left: 20px;
    border: 1px solid lightgray;
}
.option-title{
    margin-top: 20px;
    text-align: left;
    line-height: 50px;
    height: 50px;
    font-weight: bold;
    background-color: rgb(250, 250, 250)
}

.searchList{
    background-color: red;
    display: none;
    z-index: 5;
    list-style-type: none;
    padding: 0;
}

.custom-list {
    padding: 0.5rem 1rem; /* 等同於 Bootstrap 的 px-4 py-2 */
    background-color: #f8f9fa; /* 等同於 bg-light */
    color: #212529; /* 等同於 text-dark */
    cursor: pointer;
    border: none; /* 如果是按鈕，移除邊框 */
    /* transition: all 0.3s ease; 添加平滑過渡效果 */
}

.custom-list:hover {
    background-color: #0d6efd; /* 等同於 bg-primary */
    color: #fff; /* 等同於 text-white */
}

</style>