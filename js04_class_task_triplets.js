class CLASS_TASK_TRIPLETS {
  constructor(str_10_chars = "fILNTUWpyZ") {
    function f_str_to_polyomino(str, sign = 1) {
      let arr_str = str.split(",").map(row => row.split(""));
      let arr_obj_xy = [];
      for (let iy = 0; iy < arr_str.length; iy++)
        for (let ix = 0; ix < arr_str[iy].length; ix++)
          arr_obj_xy.push(new CLASS_XY((+arr_str[iy][ix]) * sign, iy + 1));
      return new CLASS_POLYOMINO(arr_obj_xy).f_get_to_zero();
    };

    let P5 = {
      F: f_str_to_polyomino("23,12,2"),
      I: f_str_to_polyomino("1,1,1,1,1"),
      L: f_str_to_polyomino("1,1,1,12"),
      P: f_str_to_polyomino("12,12,1"),
      N: f_str_to_polyomino("2,12,1,1"),

      T: f_str_to_polyomino("123,2,2"), 
      U: f_str_to_polyomino("13,123"),  
      V: f_str_to_polyomino("1,1,123"), 
      W: f_str_to_polyomino("1,12,23"),
      X: f_str_to_polyomino("2,123,2"),
      Y: f_str_to_polyomino("2,12,2,2"),
      Z: f_str_to_polyomino("12,2,23"),
    };
    for (let i_char of "FILPNTUVWXYZ")
      P5[i_char.toLowerCase()] = P5[i_char].f_get_reflex_x();

    this.str_10_chars = str_10_chars;
    this.obj = new CLASS_TASK(this.str_10_chars.split("").map(char => P5[char]));

    this.arr_triplets = [];
    for (let i0 = 0; i0 < 53 - 2; i0++)
      for (let i1 = i0 + 1; i1 < 53 - 1; i1++)
        for (let i2 = i1 + 1; i2 < 53; i2++)
          this.arr_triplets.push({i: this.arr_triplets.length, i3: [i0, i1, i2], amount_of_solutions: 0});
  }

  f_i3_to_i(i3) {
    return this.arr_triplets.find(el => ((el.i3[0] == i3[0]) && (el.i3[1] == i3[1]) && (el.i3[2] == i3[2]))).i;
  }

  f_m_to_i_and_i3(m, hole_value = 10) {
    //debugger
    let i3 = m.reduce((acc, el, i) => (el == hole_value) ? acc.concat(i) : acc, []);
    let i = this.f_i3_to_i(i3);
    return ({i: i, i3: i3});
  }

  f_nxy_to_str(n_cell_on_board) {
    let x = n_cell_on_board % 9;
    let y = (n_cell_on_board - x) / 9;
    return "" + (x+1) + (y+1) + ",";
  }

  f_i_triplet_to_str(i) {
    let f = n012 => this.f_nxy_to_str(this.arr_triplets[i].i3[n012]);
    return "[" + f(0) + f(1) + f(2) + " i=" + i + "]";
  }

  f_show_set(new_line = "<br>") {
    return this.str_10_chars + new_line + this.obj.f_show_polyomino(new_line);
  }

  f_test_total(with_4_or_8 = 4, new_line = "<br>") {
    let T = []; T.push(performance.now());
    console.log(this);
    let info = this.obj.f_get_solution(false, with_4_or_8, true, +Infinity);
    let arr_m = info.solutions;
    console.log("ALL " + arr_m.length + " SOLUTIONS ARE FOUND");

    function f_time() {
      T.push(performance.now());
      let ms_total = T.at(-1)-T[0];
      let time_total = Math.round(ms_total / 1000);
      let ms_local = T.at(-1)-T.at(-2);
      let time_local = Math.round(ms_local / 1000);
      console.log("TOTAL=" + time_total + " seconds; CURRENT=" + time_local  + " seconds");
    }
    
    let i_step = 0; let i_step_percents = 0
    for (let i = 0; i < arr_m.length; i++) {
      let i_i3 = this.f_m_to_i_and_i3(arr_m[i]);
      this.arr_triplets[i_i3.i].amount_of_solutions += 1;

      i_step += 1;
      if ((i_step * 100 / arr_m.length) >= i_step_percents) {
        console.log(i_step_percents + "% ARE FILTERED");
        i_step_5_percents += 20;
      }
    }
    
    f_time();
    console.log("ALL_TRIPLETS", this.arr_triplets);
    let arr_triplets_unsolvable = this.arr_triplets.filter(el => (el.amount_of_solutions==0));
    f_time();
    console.log("UNSOLVABLE ", arr_triplets_unsolvable);
    let text_html = arr_triplets_unsolvable.reduce((acc, el) => (acc + this.f_i_triplet_to_str(el.i) + new_line), "");
    f_time();

    let amount_info_text = arr_triplets_unsolvable.length + " OF " + this.arr_triplets.length + " ARE UNSOLVABLE";
    return this.str_10_chars + new_line + amount_info_text + new_line +  text_html;
  }
};