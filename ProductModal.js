export default {
    template: '#productModal',
    data() {
      return {
        tempProduct: {
          imageUrl: [],
        },
        modalView: {
            title: '建立新產品',
            formGroups: [['title', 'id'], ['category', 'unit'], ['origin_price', 'price']],
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
        this.tempProduct = {imageUrl: [],}
      },
      getProduct(id) {
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
        if (productData) {
          this.tempProduct = productData
        }
        this.validation()
      },
      axiosMethod(url, method) {
        axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
        axios[method](url, this.tempProduct).then(() => {
          $('#productModal').modal('hide');
          this.$emit('update');
        }).catch((error) => {
          console.log(error)
        });
      },
      validation() {
        Object.keys(this.tempProduct).forEach(item => {
            if(item !== 'id' && this.tempProduct[item].toString().trim() === '') {
                this.requiredData[item] = false
            } else {
                this.requiredData[item] = true
            }
        })
        if (Object.values(this.requiredData).every(item => item === true)) {
          let api
          let httpMethod 
          if (!this.isNew) {
            api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
            httpMethod = 'patch';
          } else {
            api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product`;
            httpMethod = 'post';
          }
          if (!this.validUrl(this.tempProduct.imageUrl[0])) {
            this.tempProduct.imageUrl[0] = 'https://image.makewebeasy.net/noimage.png'
          }
          this.axiosMethod(api, httpMethod)
        }
      },
      validUrl(str) {
        const myRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
        return myRegex.test(str);
      }
    }
}