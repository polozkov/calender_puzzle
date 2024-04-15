var G = {SVG: document.getElementById("id_svg"), DRAW: {}};
G.DRAW = {
		f_html_clear: function() {
			G.SVG.innerHTML = "";
		},

		f_html_add: function (my_html) {
			G.SVG.innerHTML += my_html;
		},

		f_rect: function (xy, wh, r = 0) {
			var str = '<rect fill="black" ';
			str += 'x="' + xy.x + '" y="' + xy.y + '" ';
			str += 'width="' + wh.x + '" height="' + wh.y + '" ';
			str += 'rx="' + r + '" />';
			return str;
		},

		f_rect_by_center: function (cxy, wh = {x: 210 - 10, y: 297 - 10}, r = 0) {
			var xy = {x: cxy.x - wh.x * 0.5, y: cxy.y - wh.y * 0.5}; 
			return G.DRAW.f_rect(xy, wh, r);
		}
};

G.SVG.setAttribute("viewBox", "0 0 210 2970");

for (let i = 0; i < 10; i++)
	G.DRAW.f_html_add(G.DRAW.f_rect_by_center({x : 210 * 0.5, y: 297 * (i + 0.5)}));
	
console.log(G.SVG.innerHTML);

