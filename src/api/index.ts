import * as auth from "./auth";
import * as products from "./products";
import * as todos from "./todos";
import * as dashboard from "./dashboard";

class API {
  auth: typeof auth;
  products: typeof products;
  todos: typeof todos;
  dashboard: typeof dashboard;

  constructor() {
    this.auth = auth;
    this.products = products;
    this.todos = todos;
    this.dashboard = dashboard;
  }
}

const api = new API();
export default api;
