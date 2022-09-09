const axios = require('axios').default;
export default class NewItems {
  constructor() { 
    let userData = '';
    let pagination = 1;
  }
  async request() {
    return await axios({
      url: 'https://pixabay.com/api/',
      method: 'get',
      params: {
        key: '29712596-a6647cd6fa13e8a799ad6d26d',
        q: this.userData,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: this.pagination,
      }
    });
  }
  get search() {
    return this.userData;
  }
  set search(value) {
    this.userData = value;
  }
  updatePage() {
    this.pagination += 1;
  }
  resetPage() {
    this.pagination = 1;
  }
}