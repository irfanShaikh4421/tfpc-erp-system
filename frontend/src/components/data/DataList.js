import queryMixin from '../mixins/query';

export default {
  mixins: [queryMixin],
  props: {
    // Provide a filter to limit the
    // results of the API request.
    entity: {
      type: Object,
    },
    filter: {
      type: Object,
    },
  },
  watch: {
    // Load the data from the given endpoint
    // on initial rendering of the component and
    // every time the filter property changes.
    filter: {

      immediate: true,
      handler: `load`,
      
    },
  },
  data() {
    return {
      data: this.entity || null,
    };
  },
  methods: {
    load() {
      
      //alert(JSON.stringify(this.data))
      return this.query(`get`, this.endpoint, { params: { ...this.data , ...this.filter } });
    },

    generateItems(input,key){
      let temp = []
      input.forEach( (item,index) => {
          temp.push({
              text: item.name,
              value: item.key
              })
      } )

      return temp
    },

    validate(){
      this.$validator.validateAll()
    }
  },
  render() {
    // Render the default scoped slot and
    // provide data and method properties
    // via the slot scope.
    return this.$scopedSlots.default({
      data: this.data,
      error: this.error,
      load: this.load,
      loading: this.loading,
      generateItems: this.generateItems,
      validate: this.validate
    });
  },
};