<template>
<div class="v-pagination clearfix" style="">
    <a href="javascript:;" v-on:click.prevent="pre">上一页</a>
    
        <template v-for="n in num">
            <span class="occupy"  v-if="n==currentPage-3&&n>1"> ... </span>
            <a href="javascript:;" 
                v-bind:class="{'current-page': currentPage==n}"
                v-on:click.prevent="gotoPage(n)"
                v-if="n==1||( -3<n-currentPage&&n-currentPage<3 )||n==num"
                >{{n}}</a>
            <span class="occupy" v-if="n==currentPage+3&&n<num"> ... </span>
        </template>
    

    
    <a href="javascript:;" v-on:click.prevent="next">下一页</a>
    <span class="sum" >{{currentPage}}/{{num}} 页</span>
    <span> <input type="text" v-model.number="toJump" name="" style="width: 36px;"> <a href="javascript:;" v-on:click.prevent="gotoPage(toJump)">跳转</a></span>
</div>
</template>

<script type="text/javascript">
export default {
    name:'pagination',
    props:{
        totalSize:Number,
        pageSize:Number,
        currentPage:Number,
    },
    data(){
        return {
            toJump:null,
        }
    },
    methods:{
        pre(){
            this.gotoPage(this.currentPage-1);
        },
        next(){
            this.gotoPage(this.currentPage+1);
        },
        gotoPage(index){
            if(index != this.currentPage && 1 <= index&&index <= this.num){
                this.$emit('gotoPage',index);
            }
        },
    },
    computed:{
        num(){
            return Math.ceil(this.totalSize/this.pageSize);
        }
    },
    watch:{},

}
</script>



<style scoped>
.v-pagination {
    text-align: right;
}
.v-pagination a {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #B30007;
    color: #333;
    text-align: center;
    text-decoration: none;
    padding: 4px 11px;
    margin:2px;
    min-width: 40px;

}
.v-pagination a:hover, .v-pagination .current-page {
    color: #fff;
    background: #B30007;
}
.sum {
    margin:0 20px;
    min-width: 60px;
    display: inline-block;
}
.occupy {
    padding: 0 12px;
}
</style>
