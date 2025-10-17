export default {
    data() {
        return {
            mixinLoader:false,
            mixingIsLoading: false
        }
    },
    methods: {
        startLoading() {
            const prevLoading = this.mixingIsLoading;
            this.mixingIsLoading = true
            if(!prevLoading) {
                this.mixinLoader = this.$loading.show({
                    container: this.fullPage ? null : this.$refs.formContainer,
                    onCancel: this.onCancel,
                    loader: 'dots'
                });
            }
        },
        stopLoading() {
            this.mixingIsLoading = false;
            if (typeof this.mixinLoader?.hide === 'function') {
                this.mixinLoader.hide();
            }
        }
    }
}