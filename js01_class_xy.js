class CLASS_XY {
  constructor(x=0, y=0) { this.x = x; this.y = y; }
  f_get_copy() { return new CLASS_XY(this.x, this.y); }
  f_get_min_coord() { return Math.min(this.x, this.y); }
  f_get_max_coord() { return Math.max(this.x, this.y); }

  f_get_reflex_x() { return new CLASS_XY(-this.x, this.y); }
  f_get_reflex_y() { return new CLASS_XY(this.x, -this.y); }
  f_get_reflex_both() { return new CLASS_XY(-this.x, -this.y); }
  f_get_90() { return new CLASS_XY(-this.y, this.x); }
  f_op_90_n_times(n03) {
    let obj_result = this.f_get_copy();
    for (let i = 0; i < n03; i++) obj_result = obj_result.f_get_90();
    return obj_result;
  }
  f_op_transform(n07) {
    let obj_result = this.f_op_90_n_times(n07 % 4);
    if (n07 >= 4) obj_result.x = -obj_result.x;
    return obj_result;
  }

  f_op_min(p) { return new CLASS_XY(Math.min(this.x, p.x), Math.min(this.y, p.y)); }
  f_op_max(p) { return new CLASS_XY(Math.max(this.x, p.x), Math.max(this.y, p.y)); }
  f_op_add(p) { return new CLASS_XY(this.x + p.x, this.y + p.y); }
  f_op_add_x_y(x,y) { return new CLASS_XY(this.x + x, this.y + y); }
  f_op_subtract(p) { return new CLASS_XY(this.x - p.x, this.y - p.y); }
  f_op_scale_n(n) { return new CLASS_XY(this.x * n, this.y * n); }
  f_op_scale_both(p) { return new CLASS_XY(this.x * p.x, this.y * p.y); }

  f_is_small_inside(small_p) { return ((this.x >= small_p.x) && (this.y >= small_p.y)); }
  f_is_equal_xy(p) {return ((this.x == p.x) && (this.y == p.y));}
  f_get_array_of_xy(total_length) {
    let array_order_perm = new Array(total_length).fill(0).map((value, i) => i);
    return array_order_perm.map(n => new CLASS_XY(n % this.x, Math.floor(n / this.x)));
  }
}

