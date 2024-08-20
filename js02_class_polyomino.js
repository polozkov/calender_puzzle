class CLASS_POLYOMINO {
  constructor(arr_xy = [new CLASS_XY(0,0)], is_copy = true) {
    if (is_copy) this.arr_xy = arr_xy.map(value => new CLASS_XY(value.x, value.y))
    else this.arr_xy = arr_xy;
  }

  f_get_copy() { return new CLASS_POLYOMINO(this.arr_xy); }
  f_get_min() {
    return this.arr_xy.reduce(
      (accumulator, currentValue) => accumulator.f_op_min(currentValue),
      new CLASS_XY(+Infinity, +Infinity));
  }
  f_get_max() {
    return this.arr_xy.reduce(
      (accumulator, currentValue) => accumulator.f_op_max(currentValue),
      new CLASS_XY(-Infinity, -Infinity));
  }
  f_get_sizes() {
    return this.f_get_max().f_op_subtract(this.f_get_min()).f_op_add(new CLASS_XY(1, 1));
  }

  f_op_shift(p) { return new CLASS_POLYOMINO(this.arr_xy.map(v => new CLASS_XY(v.x + p.x, v.y + p.y), false)) }
  f_get_to_zero() { return this.f_op_shift(this.f_get_min().f_get_reflex_both()); }
  f_get_reflex_x() { return new CLASS_POLYOMINO(this.arr_xy.map(v => new CLASS_XY(-v.x, v.y)), false).f_get_to_zero(); }
  f_op_transform(n07) { return new CLASS_POLYOMINO(this.arr_xy.map(v => v.f_op_transform(n07)), false).f_get_to_zero(); }

  f_get_bit_rectangle_matrix(empty_value = 0, occupied_value = 1) {
    let sizes = this.f_get_sizes();
    let len = sizes.x * sizes.y;
    let m = new Array(len).fill(empty_value);

    for (let i = 0; i < this.arr_xy.length; i++)
      m[this.arr_xy[i].x + this.arr_xy[i].y * sizes.x] = occupied_value;
    return m;
  }

  f_is_equal_polyomino(polyomino) {
    if (!polyomino.f_get_max().f_is_equal_xy(this.f_get_max())) {return false; }
    if (!polyomino.f_get_min().f_is_equal_xy(this.f_get_min())) {return false; }

    let ma = this.f_get_bit_rectangle_matrix();
    let mb = polyomino.f_get_bit_rectangle_matrix();
    
    for (let i = 0; i < ma.length; i++)
      if (ma[i] !== mb[i]) return false;
    return true;
  }

  f_get_indexes_of_occupied(small_polyomino) {
    let w = this.f_get_sizes().x
    return small_polyomino.arr_xy.map(v => v.x + v.y * w);
  }

  f_get_indexes_by_w(w_size) {
    return this.arr_xy.map(v => v.x + v.y * w_size);
  }

  //max coordinate of small polyomino is inside borders
  f_is_small_inside(small_polyomino) { return this.f_get_max().f_is_small_inside(small_polyomino.f_get_max()); }

  f_get_unique_transforms(with_reflections_4_or_8 = 4) {
    let array_order = new Array(with_reflections_4_or_8).fill(0).map((value, i) => i);
    let all_transform = array_order.map(value => this.f_op_transform(value).f_get_to_zero());
    let unique_transform = [all_transform[0]];

    function f_is_unique(old_arr, checking_el) {
      for (let i = 0; i < old_arr.length; i++)
        if (old_arr[i].f_is_equal_polyomino(checking_el)) return false;
      return true;
    }
    for (let i = 1; i < with_reflections_4_or_8; i++)
      if (f_is_unique(unique_transform, all_transform[i]))
        unique_transform.push(all_transform[i]);

    return unique_transform;
  }

  f_is_small_legal(small_polyomino) {
    if (!this.f_is_small_inside(small_polyomino)) {return false;}

    let w = this.f_get_sizes().x;
    let arr_indexes_small = small_polyomino.f_get_indexes_by_w(w);
    let arr_indexes_big = this.f_get_indexes_by_w(w);

    for (let i_small of arr_indexes_small)
    if (!arr_indexes_big.includes(i_small))
      return false;

    return true;
  }
 
  f_get_legal_slots(small_polyomino, with_reflections_4_or_8 = 4) {
    let unique_transforms = small_polyomino.f_get_unique_transforms(with_reflections_4_or_8);
    let arr_of_result_obj = [];

    for (let i = 0; i < unique_transforms.length; i++) {
      //polymino sizes after rotation
      let t_sizes_xy = unique_transforms[i].f_get_sizes();

      //slot max_shift - available area (depends on sizes)
      let nx = this.f_get_sizes().x - t_sizes_xy.x + 1;
      let ny = this.f_get_sizes().y - t_sizes_xy.y + 1;

      for (let iy = 0; iy < ny; iy++)
        for (let ix = 0; ix < nx; ix++) {
          //twe will test shifting and rotated polymino
          let small_testing_polyomino = unique_transforms[i].f_op_shift(new CLASS_XY(ix, iy));
          //checking, that we can add testing polymino
          if (this.f_is_small_legal(small_testing_polyomino))
            arr_of_result_obj.push(small_testing_polyomino);
        }
    }
    return arr_of_result_obj;
  }

  f_show_polyomino(new_line = "\n") {
    let m = this.f_get_bit_rectangle_matrix(".","#");
    let w = this.f_get_sizes().x;
    let f_char_and_enter = (char, i, w) => (((i + 1) % w) == 0) ? (char + new_line) : char;
    return  m.reduce((accumulator, char, i) => accumulator + f_char_and_enter(char, i, w), "");
  }
};
