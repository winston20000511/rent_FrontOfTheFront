<script setup>


</script>
<template>
    <!-- 選項位置 -->
    <div class="offcanvas offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
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
        <input type="text" placeholder="Address, neighborhood, city, ZIP" id="search" class="form-control me-2" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling"> <i class="fa-solid fa-magnifying-glass"></i>
    </div>
    <ul class="absolute left-0 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg" id="searchList"></ul>
    <!-- <div class="filter-right">
        <button
            class="filter-btn btn btn-primary"
            id="filter-btn-1">
            Price <i class="fa-solid fa-angle-down"></i>
        </button>
        <button
            class="filter-btn btn btn-primary"
            id="filter-btn-2">
            HomeType <i class="fa-solid fa-angle-down"></i>
        </button>
    </div>
    <ul class="btn-list" id="btn-list-1">
        <p>Price Range</p>
        <div class="inputPrice">
            <div class="left-minimum">
                <p>Minimum</p>
                <input
                type="text"
                id="btn-minimum"
                placeholder="價錢..."
                class="w-20 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div class="right-maximum">
                <p>Maximum</p>
                <input
                type="text"
                id="btn-maximum"
                placeholder="價錢..."
                class="w-20 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        </div>

    </ul>
    <ul class="btn-list" id="btn-list-2">
        <p>HomeType</p>
        <div class="checkHomeType">
            <input
            type="checkbox"
            id="option1"
            class="h-5 w-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label for="option1" class="text-sm font-medium text-gray-700">Option 1</label>
        </div>
    </ul> -->
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
    /* margin-left: 100px; */
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

/* .filter-left input[type="text"]:hover{
    border: 1px solid blue;
}
.filter-left input[type="text"]:focus{
    border: 5px solid blue;
    border-radius: 10px;
} */
#searchList{
    display: none;
    z-index: 5;
}


.filter-right{
    position: relative;
    margin-left: 20px;
    width: 35%;
    display: flex;
    align-items: center;
}
.filter-btn{
    margin-right: 10px;
}
.btn-list{
    margin-top: 10px;
    display: none;
    position: absolute;
    z-index: 3;
    background-color: white;
    width: 15%;
    height: 200px;
}
.btn-list>p{
    display: flex;
    align-items: center;
    padding-left: 20px;
    background-color: #F0F0F0;
    height: 30%;
    font-weight: 700;
}
.btn-list .inputPrice{
    display: flex;
    padding: 20px 10px 0px;
}
.btn-list .left-minimum{
    width: 50%;

}
.btn-list .left-minimum input{
    font-weight: bold;
    margin-top: 10px;
}
.btn-list .right-maximum{
    width: 50%;

}
.btn-list .right-maximum input{
    font-weight: bold;
    margin-top: 10px;
    
}

.btn-list .checkHomeType{
    margin-top: 10px;
}

</style>