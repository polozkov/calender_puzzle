class CLASS_TASK {
  constructor(arr_polyomino = [], arr_amount = null, board_arr_xy = new CLASS_XY(9,6).f_get_array_of_xy(53)) {
    //deep copy of array of polymino
    this.arr_polyomino = arr_polyomino.map(el => el.f_get_copy());
    //default each polymino we will use once
    this.arr_amount = new Array(arr_polyomino.length).fill(1);
    if (arr_amount != null) { this.arr_amount = arr_amount.slice(); }

    //how many cells are occupied by polyomino array
    let total_amount = 0;
    for (let i = 0; i < arr_polyomino.length; i++)
      total_amount += arr_polyomino[i].arr_xy.length * this.arr_amount[i];
    let delta_amount = board_arr_xy.length - total_amount;

    //if we have free cells, put monominos (delta_amount of separate squares 1*1)
    if (delta_amount > 0) {
      this.arr_polyomino.push(new CLASS_POLYOMINO());
      this.arr_amount.push(delta_amount);
    }
    this.board = new CLASS_POLYOMINO(board_arr_xy);
  }

  f_get_database(with_4_or_8 = 4) {
    //width (x-size) of my board (board of calender puzzle)
    let w = this.board.f_get_sizes().x;
    //generate one element of database: object - arr_indexes, n_polyomino; (by slot and index "n")
    let f_data = (arr_slots, n) => arr_slots.map(slot => ({arr_indexes: slot.f_get_indexes_by_w(w), n_polyomino: n}));
    //calculate legal slots for polyomino with index "n"
    let f_by_n = (n) => f_data(this.board.f_get_legal_slots(this.arr_polyomino[n], with_4_or_8), n);
    
    //integer numbers from [0 to arr_polyomino.length-1]
    let array_order_perm = new Array(this.arr_polyomino.length).fill(0).map((value, i) => i);
    //one-dimentional array of {arr_indexes, n_polyomino}, contac elements ob database (array by array)
    let database = array_order_perm.reduce((accumulator, current) => accumulator.concat(f_by_n(current)), []);
    return database;
  }

  f_get_solution(is_only_one_solution = true, with_4_or_8 = 4, is_flag_more_info = false, limit_max = 300) {
    const CELL_FREE_VALUE = -1;
    const CELL_UNUSED_VALUE = 99;
    const BOARD = this.board.f_get_bit_rectangle_matrix(CELL_UNUSED_VALUE, CELL_FREE_VALUE);
    const SUM_TOTAL = this.arr_amount.reduce((accumulator, current) => accumulator + current, 0);
    const START_PARAMETERS = [this.f_get_database(with_4_or_8), BOARD,  this.arr_amount.slice(), SUM_TOTAL];
    //Max depth (how many elements we can put. Default (initially) we do not put any elements)
    let MIN_FREE_ELEMENTS = SUM_TOTAL;
    let i_step = 0;

    let one_solution_or_all_solutions = [];

    function f_put(database, m_board, polyomino_arr_amount, polyomino_sum_total) {
      //when we have one solution and we do not need other ones
      if (limit_max <= one_solution_or_all_solutions.length) {return; }

      //when we have one solution and we do not need other ones
      if (is_only_one_solution && one_solution_or_all_solutions.length) {return; }
      //when we used all polymino elements, we solve puzzle (we need save this solution)
      if (polyomino_sum_total == 0) {one_solution_or_all_solutions.push(m_board.slice()); return; }

      //amount of opportunities: how many options we have for using this cell
      let opportunities_for_cells = new Array(m_board.length).fill(0);
      for (let i_data of database)
      for (let i_cell of i_data.arr_indexes)
        opportunities_for_cells[i_cell] += 1;
      //we will seach minimum only for FREE cells (if cell is occupied, do nothing)
      opportunities_for_cells = opportunities_for_cells.map((item, i) => ((m_board[i] == CELL_FREE_VALUE) ? item : +Infinity));

      let cell_min_times = Math.min(...opportunities_for_cells);
      //if we have cell with no solution, stop search (no solution at all, globally)
      if (cell_min_times == 0) {MIN_FREE_ELEMENTS = Math.min(MIN_FREE_ELEMENTS, polyomino_sum_total); return;}
    
      //amount of opportunities: how many options we have for usinf this polyomino (each figure)
      let opportunities_for_polyomino = new Array(polyomino_arr_amount.length).fill(0);
      for (let i_data of database)
        opportunities_for_polyomino[i_data.n_polyomino] += 1;
      //if polyomino_arr_amount === 0, do not count this figure (search minimum, only if we have at least 1 this polyomino)
      opportunities_for_polyomino = opportunities_for_polyomino.map((item, i) => (polyomino_arr_amount[i] ? item : +Infinity));
      let polyomino_min_times = Math.min(...opportunities_for_polyomino);
      //if we have no area for the most complicated polyomino, stop search (no solution at all, globally)
      if (polyomino_min_times == 0) {MIN_FREE_ELEMENTS = Math.min(MIN_FREE_ELEMENTS, polyomino_sum_total); return;}

      //for recursion we will have this opportunities (for next step by adding one figure)
      let new_opportunities_to_put = [];
      //work for next step "by cell" or "by polyomino"
      if (cell_min_times <= polyomino_min_times) {
        //which cell is the most complicated (has minimun variants)
        let cell_min_position = opportunities_for_cells.indexOf(cell_min_times);
        new_opportunities_to_put = database.filter(item => item.arr_indexes.includes(cell_min_position));
      } else {
        //which polyomino is the most complicated (has minimun variants)
        let polyomino_min_type = opportunities_for_polyomino.indexOf(polyomino_min_times);
        new_opportunities_to_put = database.filter(item => (item.n_polyomino == polyomino_min_type));
      }

      function f_new_arquments_for_put_recursion(opportunity) {
        const N_TYPE_NOW = opportunity.n_polyomino;
        function f_filter_base_for_next_step(i_n_polyomino, i_arr_indexes) {
          //if we use the last polyomino, we can not use it in the future
          if ((i_n_polyomino == N_TYPE_NOW) && (polyomino_arr_amount[N_TYPE_NOW] == 1)) return false;
          //if item_i_base_object.arr_indexes intersect currunt polyomino (in opportunity)...
          for (let i of opportunity.arr_indexes) 
            ///...we can not use this item_i_base_object on the next step, so filter will block it
            if (i_arr_indexes.includes(i)) return false;
          return true;
        }
        //new base for next step will have less elements (because we filter base by putting one polyomino)
        let new_base = database.filter(item => f_filter_base_for_next_step(item.n_polyomino, item.arr_indexes));

        let new_board = m_board.slice();
        //add polyomino on the board
        for (let i of opportunity.arr_indexes)
          new_board[i] = opportunity.n_polyomino;

        let new_polyomino_arr_amount = polyomino_arr_amount.slice();
        //decreace amount of using type of polyomino
        new_polyomino_arr_amount[opportunity.n_polyomino] -= 1;
        //4 parameters for recursion of the function f_put(...[]);
        return [new_base, new_board, new_polyomino_arr_amount, polyomino_sum_total-1];
      }

      //recurtion for opportunities (by best cell or by best polyomino)
      for (let i_opportunity of new_opportunities_to_put) {
        f_put(...f_new_arquments_for_put_recursion(i_opportunity));
        if (SUM_TOTAL == polyomino_sum_total) {
          i_step += 1;
          console.log("STEP " + i_step + " OF " + new_opportunities_to_put.length);
        }
      }
    };

    f_put(...START_PARAMETERS);

    if (is_flag_more_info) {
      let solutions = one_solution_or_all_solutions;
      let amount = solutions.length;
      let max_depth = SUM_TOTAL - MIN_FREE_ELEMENTS;
      return {amount: amount, solutions: solutions, max_depth: max_depth};
    };

    return one_solution_or_all_solution;
  }

  f_show_solution(with_4_or_8 = 4, solutions = null) {
    if (solutions == null) {solutions = this.f_get_solution(true, with_4_or_8);}
    if (solutions.length == 0) {return "NO SOLUTIONS";}
    let w = this.board.f_get_sizes().x;

    function f_n_to_text(n, i, w) {
      let separator = (((i + 1) % w) == 0) ? "\n" : " ";
      if ([0,1,2,3,4,5,6,7,8,9].includes(n)) return (n + separator);
      if ([10,11,12,13,14,15].includes(n)) return n.toString(16).toUpperCase() + separator;
      return "#" + separator;
    }

    return  solutions[0].reduce((accumulator, item, i) => accumulator + f_n_to_text(item, i, w), "");
  }

  f_show_polyomino(new_line = "\n") {
    let arr_p = this.arr_polyomino.filter(item => (item.arr_xy.length > 1));
    let str = arr_p.reduce((accumulator, item) => accumulator + item.f_show_polyomino(new_line) + new_line, "");
    return str;
  }
};