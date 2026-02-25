Component({
  properties: {
    dish: {
      type: Object,
      value: {}
    },
    selected: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    onTap() {
      // Trigger toggle event, bubble up to parent
      this.triggerEvent('toggle', { dish: this.data.dish });
    }
  }
})
