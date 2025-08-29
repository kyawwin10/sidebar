import * as auth from "./auth";
import * as products from "./products";
import * as todos from "./todos";
import * as dashboard from "./dashboard";
import * as delivery from "./delivery";

class API {
  auth: typeof auth;
  products: typeof products;
  todos: typeof todos;
  dashboard: typeof dashboard;
  delivery: typeof delivery;

  constructor() {
    this.auth = auth;
    this.products = products;
    this.todos = todos;
    this.dashboard = dashboard;
    this.delivery = delivery;
  }
}

const api = new API();
export default api;
