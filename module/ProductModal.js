export default {
    template: '#productModal',
    data() {
      return {
        tempProduct: {
          imageUrl: [],
          enabled: false
        },
        modalView: {
            title: '建立新產品',
            engToZh: {
                title: '標題', id: 'Id',  category: '分類', unit: '單位',
                origin_price: '原價', price: '價格', description: '產品描述', content: '說明內容'
              },
        },
        requiredData: {
          imageUrl: true,  title: true, id: true,  category: true, unit: true,
          origin_price: true, price: true, is_enabled: true, content: true, description: true
        },
      };
    },
    props: {
      isNew: {
        type: Boolean,
        default: true,
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
      clearTempProduct() {
        this.tempProduct = {imageUrl: [], enabled: false}
        this.$refs.form.reset()
      },
      getProduct(id) {
        this.$refs.form.reset()
        if (!this.isNew) {
          this.modalView.title = '編輯產品';
        }
        const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${id}`;
        axios.get(api).then((res) => {
          $('#productModal').modal('show');
          this.tempProduct = res.data.data;
        }).catch((error) => {
          console.log(error);
        });
      },
      updateProduct(productData) {
        this.$emit('loading')
        if (productData) {
          this.tempProduct = productData
        }
        let api
        let httpMethod 
        if (!this.isNew) {
          api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
          httpMethod = 'patch';
        } else {
          api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product`;
          httpMethod = 'post';
        }
        this.axiosMethod(api, httpMethod)
        this.$emit('loading')
      },
      axiosMethod(url, method) {
        axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
        axios[method](url, this.tempProduct).then(() => {
          $('#productModal').modal('hide');
          this.$emit('update');
        }).catch((error) => {
          console.log(error)
        });
      }
    }
}