import queryMixin from '../mixins/query';

export default {
  mixins: [queryMixin],
  props: {
    // Make it possible to (optinally) provide
    // initial data via an entity property.
    entity: {
      type: Object,
    },
    // By providing an initial ID, we can link
    // the model instance with a specific record.
    id: {
      type: [Number, String],
    },
  },
  data() {
    return {
      data: this.entity || null,
    };
  },
  created() {
    // If an ID but no initial data entity
    // was provided, the specified record
    // is fetched from the API.
    if (this.id && !this.data) this.find();
  },
  methods: {
    create(data) {
    
      return this.query(`post`, this.endpoint, data);
    },
    remove(data) {

      //alert('in destroy ' + JSON.stringify(data))
      return this.query(`delete`, `${this.endpoint}`, {data});
    },
    find() { 
      return this.query(`get`, `${this.endpoint}`);
    },
    update(data) {

      return this.query(`patch`, `${this.endpoint}`, data);
    },
    approve(data){
      return this.query('patch',`${this.endpoint}/accept/${data}`)
    },
    dynamic(url,method,data){
      return this.query(method,`${this.endpoint}/${url}`, data);
    }
  },
  render() {
    return this.$scopedSlots.default({
      create: this.create,
      data: this.data,
      remove: this.remove,
      loading: this.loading,
      update: this.update,
      error: this.error,
      approve: this.approve,
      dynamic: this.dynamic
    });
  },
};