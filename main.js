import pagination from './Pagination.js'
import delProductModal from './DelProductModal.js'
import productModal from './ProductModal.js'
Vue.component('delProductModal', delProductModal);
Vue.component('pagination', pagination)
Vue.component('productModal', productModal);
new Vue({
el: '#app',
data() {
    return {
    columnName: {
        title: ['', '分類', '產品名稱', '原價', '售價', '啟用', ' '],
        info: ['category', 'title', 'origin_price', 'price'],
    },
    products: [],
    pagination: {},
    tempProduct: {
        imageUrl: [],
    },
    isNew: false,
    user: {
        token: '',
        uuid: '765c633d-f16f-4821-90b7-1588004cb252',
    },
    };
},
created() {
    // 取得 token 的 cookies
    // 詳情請見：https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie
    this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // 若無法取得 token 則返回 Login 頁面
    if (this.user.token === '') {
    window.location = 'index.html';
    }
    this.getProducts();
},
methods: {
    // 取得產品資料
    getProducts(page = 1) {
    const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/products?page=${page}`;
    //預設帶入 token
    axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;

    axios.get(api).then((response) => {
        this.products = response.data.data;
        this.pagination = response.data.meta.pagination;
    }).catch((error) => {
        console.log(error)
        window.location = 'index.html';
    })
    },
    // 開啟 Modal 視窗
    openModal(isNew, item) {
    switch (isNew) {
        case 'new':
        this.isNew = true;
        this.$refs.productModel.clearTempProduct()
        $('#productModal').modal('show');
        break;
        case 'edit':
        this.tempProduct = Object.assign({}, item);
        this.isNew = false;
        this.$refs.productModel.getProduct(this.tempProduct.id);
        break;
        case 'delete':
        $('#delProductModal').modal('show');
        this.tempProduct = Object.assign({}, item);
        break;
        default:
        break;
    }
    },
    switchToActive(item) {
    this.tempProduct = Object.assign({}, item);
    this.tempProduct.enabled = !this.tempProduct.enabled 
    this.isNew = false;
    this.$refs.productModel.updateProduct(this.tempProduct)
    },
    toolTip() {
    $('[data-toggle="tooltip"]').tooltip();
    }
},
})