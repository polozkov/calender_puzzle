let G = {
  TASK_TRIPLETS: new CLASS_TASK_TRIPLETS(),

  EL: {
    INPUT_10: document.getElementById("id_input_10"),

    BUTTON_SHOW: document.getElementById("id_button_show"),
    BUTTON_CALCULATE: document.getElementById("id_button_calculate"),
    BUTTON_COPY: document.getElementById("id_button_copy"),

    PENTAMINO: document.getElementById("id_pentamino"),
    RESULTS: document.getElementById("id_results"),
  },
};

G.f_get_str = () => G.EL.INPUT_10.value;
G.f_show = function () {
  G.TASK_TRIPLETS = new CLASS_TASK_TRIPLETS(G.f_get_str());
  G.EL.PENTAMINO.innerHTML = G.TASK_TRIPLETS.f_show_set();
}

G.EL.BUTTON_SHOW.onmousedown = G.f_show();

G.EL.BUTTON_CALCULATE.onmousedown = function () {
  G.f_show();
  let text_illegal_triplets = G.TASK_TRIPLETS.f_test_total();
  G.EL.RESULTS.innerHTML = text_illegal_triplets;
}

G.EL.BUTTON_COPY.onmousedown = function() {
  let enter = "\n";
  let my_text = G.EL.RESULTS.innerHTML;
  my_text = my_text.replaceAll("<br>", enter);
  navigator.clipboard.writeText(my_text);   
  //console.log(my_text);
}

G.f_show();

