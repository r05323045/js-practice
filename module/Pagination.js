export default {
    template: '#pagination',
    data() {
        return {};
    },
    props: {
        pages: {
          type: Object,
          default() {
              return {};
          },
        },
    },
    methods: {
        emitPages(item) {
          this.$emit('emit-pages', item);
        },
    },
}