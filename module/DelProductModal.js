export default {
    template: '#delProductModal',
    data() {
        return {
        };
    },
    props: {
        tempProduct: {
        type: Object,
        default() {
            return {
            imageUrl: [],
            };
        },
        },
        user: {
        type: Object,
        default() {
            return {
            };
        },
        },
    },
    methods: {
        // 刪除產品
        delProduct() {
        const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;

        //預設帶入 token
        axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;

        axios.delete(url).then(() => {
            $('#delProductModal').modal('hide');
            this.$emit('update');
        });
        },
    }
}