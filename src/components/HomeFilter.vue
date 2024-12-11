<script setup>


</script>
<template>
<div class="filter" id="filter">
    <div class="filter-left">
        <input type="text" placeholder="Address, neighborhood, city, ZIP" id="search" class="form-control me-2"> <i class="fa-solid fa-magnifying-glass"></i>
    </div>
    <ul class="absolute left-0 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg" id="searchList"></ul>
    <div class="filter-right">
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
    width: 50%;
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
    width: 800px;
    height: 40px;
    margin-left: 30px;
    font-size: 20px;
    padding-left: 20px;
    border: 1px solid lightgray;
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
    width: 50%;
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