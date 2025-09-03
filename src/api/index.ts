import * as auth from "./auth";
import * as products from "./products";
import * as todos from "./todos";
import * as dashboard from "./dashboard";
import * as delivery from "./delivery";
import * as user from "./user";
import * as booking from "./Booking";
import * as supplier from "./Supplier";
import * as category from "./category";

class API {
  auth: typeof auth;
  products: typeof products;
  todos: typeof todos;
  dashboard: typeof dashboard;
  delivery: typeof delivery;
  user: typeof user;
  booking: typeof booking;
  supplier: typeof supplier;
  category: typeof category;

  constructor() {
    this.auth = auth;
    this.products = products;
    this.todos = todos;
    this.dashboard = dashboard;
    this.delivery = delivery;
    this.user = user;
    this.booking = booking;
    this.category = category;
    this.supplier = supplier;
  }
}

const api = new API();
export default api;
