<script>
  import { ref, h } from 'vue';
  import axios from 'axios';
  export default {
    props: {
      url: {
        type: String,
      }
    },
    setup(props, context) {
      const response = ref(null);
      const loading = ref(true);
      const { slots } = context;
      axios.get(props.url)
        .then(res => {
          response.value = res.data;
          loading.value = false;
        })
        .catch(err => {
          alert('[ERROR] Fething data failed', err);
          console.log(err);
        })
      context.expose({ res: response, load: loading })
      return () => h('div', {}, [slots.default && slots.default({ response: response.value, loading: loading.value })])
    }
  }
</script>