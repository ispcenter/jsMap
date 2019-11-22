let diapazon0 = 200;
let diapazon1 = 550;

$(document).ready(function(){

	// Сначала мы создадим класс и объекты. Они состоят из точек и линий на графиках, а также всех кнопок для управления ими

	class Vetki {
		constructor(u) {
			this.u = u;
			}

		makeButtonsU() {
			this.tr = `
			<tr>
			   <td id="but${this.u}" class="butO">${this.u}</td>
			   <td class="butL" id="but${this.u}_pk_data">△</td>
			   <td class="butI">Пк</td>
			   <td class="butR" id="but${this.u}_pk_line">--</td>
			   <td class="butL" id="but${this.u}_KPD_data">о</td>
			   <td class="butI">КПД</td>
			   <td class="butR" id="but${this.u}_KPD_line">--</td>
			</tr>`

			$('#table_u').append(this.tr);

			$(`#but${this.u}`).css('font-weight', 'bold');
			};
		}
		
	class Yadra {
		constructor(z) {
			this.z = z;
		}
	}	

	var obj = {};
	for(let u=diapazon1; u>=diapazon0; u-=50) {
		obj[u] = new Vetki(u);
		obj[u].makeButtonsU();
		// obj[u].toggleObj();
	}

	addFig();
	//делаем кнопки управления отображением кпд, активируем функции скрытия и смены цвета
	butKpdMaker();
	fullHide();
	partHide();
	colorChange();

	// создадим тестовую таблицу с данными, по которой построим график
	$('#addFig').change(function(e){
			var reader = new FileReader();
			reader.readAsArrayBuffer(e.target.files[0]);
			reader.onload = function(e) {
				var data = new Uint8Array(reader.result);
				var wb = XLSX.read(data,{type:'array'});
				var htmlstr = XLSX.write(wb,{sheet:"Лист1", type:'binary', bookType:'html'});
				$('#data')[0].innerHTML += htmlstr;
				$('#sjs-B173').ready(function(){
					testdataGv = $('#sjs-B173').text();
					plotData();
					getGridX();
					getGridY();
					getGridZ();
				})
			}
		});

	//создадим сетку координат

	getAxes();
	// plotData();
	// getGridX();
	// getGridY();
	// makeDataTable();

	//построим линию графика
	// dataX = [2.8, 2.66, 2.28, 1.579];
	// dataY = [1.216, 3.1, 3.78, 3.72];
	// data550 = [2.8 1.216, 2.66 3.1, 2.28 3.78, 1.579 3.72];

	function addFig() {
		let i = 1
		$('#addFigLabel').click(function(){
			$('#addFigLabel').before(`
				<button id="fig1_tab">ТКР № ${i}</button>
			`)
			i++;
		})
	}

	function zoom() {
		// это пока прототип
		$('#mapSVG').bind('mousewheel DOMMouseScroll', function(event){
			if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
			// scroll up
			alert('up');
			}
			else {
			// scroll down
			alert('down');
			}
		});
	}

	function butKpdMaker() {
		$('#table_kpd').append(`
			<tr>
				<td class="butL" id="fig_1_butKPD_82_data">o</td>
				<td class="butI">82</td>
				<td class="butR" id="fig_1_butKPD_82_line">-</td>

				<td id="fig_1_butKPD" class="butO" colspan="3" rowspan="2">Ядра КПД</td>
				<td id="fig_1_butKPDmax" class="butO" colspan="3">Линия макс.КПД</td>
			</tr>
			<tr>
				<td class="butL" id="fig_1_butKPD_81_data">o</td>
				<td class="butI">81</td>
				<td class="butR" id="fig_1_butKPD_81_line">-</td>

				<td class="butO" id="fig_1_butKPD_81_line" colspan="3">Линия помпажа</td>
			</tr>
		`);

		for(i=80; i>=71; i--) {
			$('#table_kpd').append(`
				<tr>
					<td class="butL" id="fig_1_butKPD_${i}_data">o</td>
					<td class="butI">${i}</td>
					<td class="butR" id="fig_1_butKPD_${i}_line">-</td>
					<td class="butL" id="fig_1_butKPD_${i-10}_data">o</td>
					<td class="butI">${i-10}</td>
					<td class="butR" id="fig_1_butKPD_${i-10}_line">-</td>
					<td class="butL" id="fig_1_butKPD_${i-20}_data">o</td>
					<td class="butI">${i-20}</td>
					<td class="butR" id="fig_1_butKPD_${i-20}_line">-</td>
				</tr>`);
		};
	};

	function fullHide() {
		$('#but550').on('click', function() {
			$('#but550_pk_data, #but550_pk_line, #but550_KPD_data, #but550_KPD_line, #fig1_pk550, #fig1_kpd550, #fig1_pk550label').toggleClass('off');
		});
		$('#but500').on('click', function() {
			$('#but500_pk_data, #but500_pk_line, #but500_KPD_data, #but500_KPD_line, #fig1_500, #fig1_pk500, #fig1_kpd500').toggleClass('off');
		});
		$('#but450').on('click', function() {
			$('#but450_pk_data, #but450_pk_line, #but450_KPD_data, #but450_KPD_line, #fig1_450, #fig1_pk450, #fig1_kpd450').toggleClass('off');
		});
		$('#but400').on('click', function() {
			$('#but400_pk_data, #but400_pk_line, #but400_KPD_data, #but400_KPD_line').toggleClass('off');
		});
		$('#but350').on('click', function() {
			$('#but350_pk_data, #but350_pk_line, #but350_KPD_data, #but350_KPD_line').toggleClass('off');
		});
		$('#but300').on('click', function() {
			$('#but300_pk_data, #but300_pk_line, #but300_KPD_data, #but300_KPD_line').toggleClass('off');
		});
		$('#but250').on('click', function() {
			$('#but250_pk_data, #but250_pk_line, #but250_KPD_data, #but250_KPD_line').toggleClass('off');
		});
		$('#but200').on('click', function() {
			$('#but200_pk_data, #but200_pk_line, #but200_KPD_data, #but200_KPD_line').toggleClass('off');
		});
	};

	function partHide() {
		$('#but550_pk_line').click(function(){
			$(this).toggleClass('hidden');
			$('#fig1_pk550').toggleClass('off');
			$('#fig1_pk550label').toggleClass('off');
		});

		$('#but550_KPD_line').click(function(){
			$(this).toggleClass('hidden');
			$('#fig1_kpd550').toggleClass('off');
		});

		$('#but500_pk_line').click(function(){
			$(this).toggleClass('hidden');
			$('#fig1_pk500').toggleClass('off');
		});

		$('#but450_pk_line').click(function(){
			$(this).toggleClass('hidden');
			$('#fig1_pk450').toggleClass('off');
		});

		$('#but500_KPD_line').click(function(){
			$(this).toggleClass('hidden');
			$('#fig1_kpd500').toggleClass('off');
		});

		$('#but450_KPD_line').click(function(){
			$(this).toggleClass('hidden');
			$('#fig1_kpd450').toggleClass('off');
		});

		$('#fig_1_butKPD_80_line').click(function(){
			$(this).toggleClass('hidden');
			$('#fig1_80line').toggleClass('off');
		});

		$('#fig_1_butKPD_78_line').click(function(){
			$(this).toggleClass('hidden');
			$('#fig1_78line').toggleClass('off');
		});

		$('#fig_1_butKPD_76_line').click(function(){
			$(this).toggleClass('hidden');
			$('#fig1_76line').toggleClass('off');
		});
	};

	function getData() {

		// Gв
		GvFirst = 0;
		fig1_x550 = [1.0534, 1.0513, 1.0325, 1.0089, 0.9682, 0.8821, 0.8205, 0.7543, 0.7008, 0.6486, 0.6276];

		// истинное значение максимума по Gв
		fig1_x550max = Math.max(...fig1_x550);
		
		// максимальное значение Gв, которое мы хотим видеть на оси
		GvLast = Math.ceil(fig1_x550max * 10)/10;

		GvMajStep = 0.1;
		GvMinStep = 0.05;

		// коэффициент расширения графика
		GvC = 3/GvLast;

		fig1_x550i = fig1_x550.map(function(num){
			return num * GvC;
		});

		GvLasti = GvLast * GvC
		GvMajStepi = GvMajStep * GvC
		GvMinStepi = GvMinStep * GvC

		// ПК
		pkFirst = 1;
		fig1_y550 = [2.4310, 2.8210, 3.3620, 3.7050, 4.0300, 4.3590, 4.4610, 4.5420, 4.5480, 4.5390, 4.5010];
		var fig1_y550max = Math.max(...fig1_y550);

		// максимальное значение Пк, которое мы хотим видеть на оси (4.6)
		pkLast = Math.ceil(fig1_y550max * 10)/10;
		pkMajStep = (pkLast-1)/18;
		pkMinStep = pkMajStep/2;

		// коэффициент расширения графика
		pkC = (4-1)/(pkLast-1);

		fig1_y550i = fig1_y550.map(function(num){
			return (num - 1)*pkC + 1;
		});

		pkLasti = (pkLast-1) * pkC + 1
		pkMajStepi = pkMajStep * pkC
		pkMinStepi = pkMinStep * pkC

		// КПДк
		kpdFirst = 0.5
		fig1_z550 = [0.5195, 0.6041, 0.6794, 0.7141, 0.7315, 0.7262, 0.7137, 0.6934, 0.6757, 0.6575, 0.6447];

		// истинное значение максимума по КПДк
		fig1_z550max = Math.max(...fig1_z550);
		
		// максимальное значение КПДк, которое мы хотим видеть на оси
		kpdLast = 0.8;

		kpdMajStep = 0.1;
		kpdMinStep = kpdMajStep/5;

		// коэффициент расширения графика
		kpdC = 1/(kpdLast-0.5);

		fig1_z550i = fig1_z550.map(function(num){
			return (num - kpdFirst)*kpdC + kpdFirst;
		});

		kpdLasti = kpdLast * kpdC;
		kpdMajStepi = 1/3;
		kpdMinStepi = kpdMajStepi/5;


		// результирующая строка для Пк
		fig1pk550str = '';
		$.each(fig1_x550i, function(i, el) {
			fig1pk550str += el + ' ' + fig1_y550i[i] + ',';
		});
		fig1pk550str = fig1pk550str.slice(0, -1);
		return fig1pk550str

		// результирующая строка для КПД
		fig1kpd550str = '';
		$.each(fig1_x550i, function(i, el) {
			fig1kpd550str += el + ' ' + fig1_z550i[i] + ',';
		});
		fig1kpd550str = fig1kpd550str.slice(0, -1);
		return [fig1pk550str, fig1kpd550str]
	};

	function plotData() {

		PkLast = $('#oY').attr('y2');

		let fig1_76line = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		fig1_76line.setAttribute('id','fig1_76line');
		fig1_76line.setAttribute('class','secondaryLine');
		fig1_76line.setAttribute('points', '1.05 1.89, 2.37 2.03, 2.88 2.97, 2.72 3.85, 1.49 3.51, 0.88 2.7');
		$('#mapSVG').append(fig1_76line);

		let fig1_76rectBg = document.createElementNS('http://www.w3.org/2000/svg','rect');
		fig1_76rectBg.setAttribute('class','label_bg');
		fig1_76rectBg.setAttribute('x', '0.86');
		fig1_76rectBg.setAttribute('y', '2.76');
		$('#mapSVG').append(fig1_76rectBg);

		let fig1_76_label = document.createElementNS('http://www.w3.org/2000/svg','text');
		fig1_76_label.setAttribute('id','fig1_76_label');
		fig1_76_label.setAttribute('class','label_K');
		fig1_76_label.setAttribute('x','0.9');
		fig1_76_label.setAttribute('y','-2.77');
		fig1_76_label.innerHTML = '76';
		$('#mapSVG').append(fig1_76_label);

		let fig1_78line = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		fig1_78line.setAttribute('id','fig1_78line');
		fig1_78line.setAttribute('class','secondaryLine');
		fig1_78line.setAttribute('points', '1.23 2.03, 2.19 2.16, 2.69 2.97, 2.52 3.72, 1.75 3.46, 1.05 2.7');
		$('#mapSVG').append(fig1_78line);

		let fig1_80line = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		fig1_80line.setAttribute('id','fig1_80line');
		fig1_80line.setAttribute('class','secondaryLine');
		fig1_80line.setAttribute('points', '1.4 2.3, 2.19 2.57, 2.37 2.97, 2.37 3.31, 1.75 3.11, 1.4 2.7');
		$('#mapSVG').append(fig1_80line);

		// тут тестируем
		let fig1_pk550 = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		fig1_pk550.setAttribute('id','fig1_pk550');
		fig1_pk550.setAttribute('class','mainLine');
		fig1_pk550.setAttribute('points', getData());
		$('#mapSVG').append(fig1_pk550);

		let fig1_kpd550 = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		fig1_kpd550.setAttribute('id','fig1_kpd550');
		fig1_kpd550.setAttribute('class','mainLine');
		fig1_kpd550.setAttribute('points', '');
		$('#mapSVG').append(fig1_kpd550);

		// сюдаааа
		let fig1_pk550_label_U = document.createElementNS('http://www.w3.org/2000/svg','text');
		fig1_pk550_label_U.setAttribute('id','fig1_pk550label');
		fig1_pk550_label_U.setAttribute('class','label_U');
		fig1_pk550_label_U.setAttribute('x', `${fig1_x550i[0]+GvLast/90}`);
		fig1_pk550_label_U.setAttribute('y',`${fig1_y550i[0]-pkLast/100}`);
		fig1_pk550_label_U.setAttribute('style', `transform-origin: ${fig1_x550i[0]+GvLast/90}px ${fig1_y550i[0]-pkLast/100}px;`);
		fig1_pk550_label_U.innerHTML = 'u<tspan class="indexLow">к2.пр</tspan> = 550 м/с';
		$('#mapSVG').append(fig1_pk550_label_U);

		let fig1_pk500 = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		fig1_pk500.setAttribute('id','fig1_pk500');
		fig1_pk500.setAttribute('class','mainLine');
		fig1_pk500.setAttribute('points', '2.28 1.25, 2.14 2.7, 1.75 3.37, 1.05 3.31');
		$('#mapSVG').append(fig1_pk500);

		let fig1_kpd500 = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		fig1_kpd500.setAttribute('id','fig1_kpd500');
		fig1_kpd500.setAttribute('class','mainLine');
		fig1_kpd500.setAttribute('points', '2.28 0.02, 2.14 0.71, 1.75 0.84, 1.05 0.64');
		$('#mapSVG').append(fig1_kpd500);

		let fig1_pk450 = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		fig1_pk450.setAttribute('id','fig1_pk450');
		fig1_pk450.setAttribute('class','mainLine');
		fig1_pk450.setAttribute('points', '1.75 1.1, 1.61 2.29, 1.22 2.97, 0.52 2.9');
		$('#mapSVG').append(fig1_pk450);

		let fig1_kpd450 = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		fig1_kpd450.setAttribute('id','fig1_kpd450');
		fig1_kpd450.setAttribute('class','mainLine');
		fig1_kpd450.setAttribute('points', '1.75 0.02, 1.61 0.71, 1.22 0.84, 0.52 0.64');
		$('#mapSVG').append(fig1_kpd450);
	};

	function getAxes() {
		
		// Создадим ось Х
		let Xaxis = document.createElementNS('http://www.w3.org/2000/svg','line');
		Xaxis.setAttribute('id','oX');
		Xaxis.setAttribute('class','axes');
		Xaxis.setAttribute('x1','0');
		Xaxis.setAttribute('y1','0');
		Xaxis.setAttribute('x2','3');
		Xaxis.setAttribute('y2','0');
		$('#mapSVG').append(Xaxis);

		// Создадим ось Y
		let Yaxis = document.createElementNS('http://www.w3.org/2000/svg','line');
		Yaxis.setAttribute('id','oY');
		Yaxis.setAttribute('class','axes');
		Yaxis.setAttribute('x1','0');
		Yaxis.setAttribute('y1','1');
		Yaxis.setAttribute('x2','0');
		Yaxis.setAttribute('y2','4');
		$('#mapSVG').append(Yaxis);

		// Создадим ось Z
		let Zaxis = document.createElementNS('http://www.w3.org/2000/svg','line');
		Zaxis.setAttribute('id','oZ');
		Zaxis.setAttribute('class','axes');
		Zaxis.setAttribute('x1','3');
		Zaxis.setAttribute('y1','0');
		Zaxis.setAttribute('x2','3');
		Zaxis.setAttribute('y2','1');
		$('#mapSVG').append(Zaxis);
	};

	function getGridX() {
		for(i=GvFirst; i<=GvLasti; i+=GvMajStepi){
			let newMajGridX = document.createElementNS('http://www.w3.org/2000/svg','line');
			newMajGridX.setAttribute('class','gridMaj');
			newMajGridX.setAttribute('x1',`${i}`);
			newMajGridX.setAttribute('y1','0');
			newMajGridX.setAttribute('x2',`${i}`);
			newMajGridX.setAttribute('y2','4');
			$('#mapSVG').append(newMajGridX);
		};
		for(i=GvFirst; i<=GvLasti; i+=GvMajStepi){
			let newTick = document.createElementNS('http://www.w3.org/2000/svg','line');
			newTick.setAttribute('class','gridTick');
			newTick.setAttribute('x1',`${i}`);
			newTick.setAttribute('y1','0');
			newTick.setAttribute('x2',`${i}`);
			newTick.setAttribute('y2','-0.07');
			$('#mapSVG').append(newTick);
		};
		for(i=GvFirst; i<=GvLasti; i+=GvMajStepi){
			let gridLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
			gridLabel.setAttribute('class','labelsMaj');
			gridLabel.setAttribute('x',`${i}`);
			gridLabel.setAttribute('y','0.2');
			gridLabel.innerHTML = `${Math.round(i/GvC*10)/10}`;
			$('#mapSVG').append(gridLabel);
		};
		for(i=GvFirst; i<=GvLasti; i+=GvMinStepi){
			let newMinGridX = document.createElementNS('http://www.w3.org/2000/svg','line');
			newMinGridX.setAttribute('class','gridMin');
			newMinGridX.setAttribute('x1',`${i}`);
			newMinGridX.setAttribute('y1','0');
			newMinGridX.setAttribute('x2',`${i}`);
			newMinGridX.setAttribute('y2','4');
			$('#mapSVG').append(newMinGridX);
		};
	};

	function getGridY() {
		for(i=1; i<=pkLasti; i+=pkMajStepi){
			let newMajGrid = document.createElementNS('http://www.w3.org/2000/svg','line');
			newMajGrid.setAttribute('class','gridMaj');
			newMajGrid.setAttribute('x1','0');
			newMajGrid.setAttribute('y1',`${i}`);
			newMajGrid.setAttribute('x2','3');
			newMajGrid.setAttribute('y2',`${i}`);
			$('#mapSVG').append(newMajGrid);
		};
		for(i=1; i<=pkLasti; i+=pkMajStepi){
			let newTick = document.createElementNS('http://www.w3.org/2000/svg','line');
			newTick.setAttribute('class','gridTick');
			newTick.setAttribute('x1','0');
			newTick.setAttribute('y1',`${i}`);
			newTick.setAttribute('x2','-0.07');
			newTick.setAttribute('y2',`${i}`);
			$('#mapSVG').append(newTick);
		};
		for(i=1; i<=pkLast+pkMajStep; i+=pkMajStep){
			let gridLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
			gridLabel.setAttribute('class','labelsMaj');
			gridLabel.setAttribute('x','-0.15');
			gridLabel.setAttribute('y',`${(-i+1)*pkC-1+0.05}`);
			gridLabel.innerHTML = `${Math.round(i*100)/100}`;
			$('#mapSVG').append(gridLabel);
		};
		for(i=1; i<=pkLasti; i+=pkMinStepi){
			let newMinGrid = document.createElementNS('http://www.w3.org/2000/svg','line');
			newMinGrid.setAttribute('class','gridMin');
			newMinGrid.setAttribute('x1','0');
			newMinGrid.setAttribute('y1',`${i}`);
			newMinGrid.setAttribute('x2','3');
			newMinGrid.setAttribute('y2',`${i}`);
			$('#mapSVG').append(newMinGrid);
		};
	};

	function getGridZ() {
		for(i=0; i<=1; i+=kpdMajStepi){
			let newMajGrid = document.createElementNS('http://www.w3.org/2000/svg','line');
			newMajGrid.setAttribute('class','gridMaj');
			newMajGrid.setAttribute('x1','0');
			newMajGrid.setAttribute('y1',`${i}`);
			newMajGrid.setAttribute('x2','3');
			newMajGrid.setAttribute('y2',`${i}`);
			$('#mapSVG').append(newMajGrid);
			console.log(kpdLasti);
		};
		for(i=0; i<=1; i+=kpdMajStepi){
			let newTick = document.createElementNS('http://www.w3.org/2000/svg','line');
			newTick.setAttribute('class','gridTick');
			newTick.setAttribute('x1','3');
			newTick.setAttribute('y1',`${i}`);
			newTick.setAttribute('x2','3.07');
			newTick.setAttribute('y2',`${i}`);
			$('#mapSVG').append(newTick);
		};
		for(i=0.5; i<=kpdLast; i+=kpdMajStep){
			let gridLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
			gridLabel.setAttribute('class','labelsMaj');
			gridLabel.setAttribute('x','3.15');
			gridLabel.setAttribute('y',`${(-i+0.51)*3.333}`);
			gridLabel.innerHTML = `${Math.round(i*10)/10}`;
			$('#mapSVG').append(gridLabel);
		};
		for(i=0; i<=1; i+=kpdMinStepi){
			let newMinGrid = document.createElementNS('http://www.w3.org/2000/svg','line');
			newMinGrid.setAttribute('class','gridMin');
			newMinGrid.setAttribute('x1','0');
			newMinGrid.setAttribute('y1',`${i}`);
			newMinGrid.setAttribute('x2','3');
			newMinGrid.setAttribute('y2',`${i}`);
			$('#mapSVG').append(newMinGrid);
		};
	};

	function colorChange(){
		$('input[name=color]').change(function() {
			var col = $('input[name=color]:checked').val();
			$('div').removeClass('colSelected');
			$('input[name=color]:checked').siblings().addClass('colSelected')
			$('#fig1_pk550,\
				#fig1_kpd550,\
				#fig1_pk500,\
				#fig1_pk450,\
				#fig1_kpd500,\
				#fig1_kpd450,\
				#fig1_80line,\
				#fig1_78line,\
				#fig1_76line').css({'stroke': col});
			$('#fig1_80_label, #fig1_78_label, #fig1_76_label').css({'fill': col});
			// $('#colset').css({'color': col, 'font-weight': 'bold'});

			// var grayL = '#555';
			// var grayD = '#000';
			// var redL = '#F49690';
			// var redD = '#D72515';
			// var blueL = '#4CB7D7';
			// var blueD = '#043C90';
			// var greenL = '#ACFA58';
			// var greenD = '#0B6121';
			// var magentaL = '#D2AADA';
			// var magentaD = '#5E0772';

			// switch(col) {
			// 	case "black":
			// 		$('.butL').css('background', `-webkit-radial-gradient(center right, ${grayL} 50%, ${grayD} 86%)`);
			// 		$('.butR').css('background', `-webkit-radial-gradient(center left, ${grayL} 50%, ${grayD} 86%)`);
			// 		$('.butO').css('background', `-webkit-radial-gradient(${grayL} 50%, ${grayD} 86%)`);
			// 		$('.butL, .butR, .butO').css('color', '#fff');
			// 		break;
			// 	case "red":
			// 		$('.butL').css('background', `-webkit-radial-gradient(center right, ${redL} 50%, ${redD} 86%)`);
			// 		$('.butR').css('background', `-webkit-radial-gradient(center left, ${redL} 50%, ${redD} 86%)`);
			// 		$('.butO').css('background', `-webkit-radial-gradient(${redL} 50%, ${redD} 86%)`);
			// 		$('.butL, .butR, .butO').css('color', '#000');
			// 		break;
			// 	case "blue":
			// 		$('.butL').css('background', `-webkit-radial-gradient(center right, ${blueL} 50%, ${blueD} 86%)`);
			// 		$('.butR').css('background', `-webkit-radial-gradient(center left, ${blueL} 50%, ${blueD} 86%)`);
			// 		$('.butO').css('background', `-webkit-radial-gradient(${blueL} 50%, ${blueD} 86%)`);
			// 		$('.butL, .butR, .butO').css('color', '#000');
			// 		break;
			// 	case "green":
			// 		$('.butL').css('background', `-webkit-radial-gradient(center right, ${greenL} 50%, ${greenD} 86%)`);
			// 		$('.butR').css('background', `-webkit-radial-gradient(center left, ${greenL} 50%, ${greenD} 86%)`);
			// 		$('.butO').css('background', `-webkit-radial-gradient(${greenL} 50%, ${greenD} 86%)`);
			// 		$('.butL, .butR, .butO').css('color', '#000');
			// 		break;
			// 	case "magenta":
			// 		$('.butL').css('background', `-webkit-radial-gradient(center right, ${magentaL} 50%, ${magentaD} 86%)`);
			// 		$('.butR').css('background', `-webkit-radial-gradient(center left, ${magentaL} 50%, ${magentaD} 86%)`);
			// 		$('.butO').css('background', `-webkit-radial-gradient(${magentaL} 50%, ${magentaD} 86%)`);
			// 		$('.butL, .butR, .butO').css('color', '#000');
			// 		break;
			// 	}
		});
	};
	

	// пока что этот метод оставим впокое (создание живой интерактивной таблицы)
	// function makeDataTable() {
	// 	$('#dataTable').append(`
	// 		<tr>
 //            <td id="cell11">uк2пр</td>
 //            <td id="cell12">Gв.пр</td>
 //            <td id="cell13">Пк</td>
 //            <td id="cell14">КПДк</td>
 //            <td id="cell15">Пт</td>
 //            <td id="cell16">Gгпр</td>
 //            <td id="cell17">КПДте</td>
 //            <td id="cell18">ut1/c0</td>
 //            <td id="cell18">Mft</td>
 //         </tr>`);
	// 	for(i=59; i<=76; i++) {
	// 		$('#dataTable').append(`
	// 			<tr>
	//             <td id="r${i}c1"><input id="A${i}" type="text" size="5" placeholder="uк2пр"></td>
	//             <td id="r${i}c2"><input id="B${i}" type="text" size="5" placeholder="Gв.пр"></td>
	//             <td id="r${i}c3"><input id="C${i}" type="text" size="5" placeholder="Пк"></td>
	//             <td id="r${i}c4"><input id="D${i}" type="text" size="5" placeholder="КПДк"></td>
	//             <td id="r${i}c5"><input id="E${i}" type="text" size="5" placeholder="Пт"></td>
	//             <td id="r${i}c6"><input id="F${i}" type="text" size="5" placeholder="Gгпр"></td>
	//             <td id="r${i}c7"><input id="G${i}" type="text" size="5" placeholder="КПДте"></td>
	//             <td id="r${i}c8"><input id="H${i}" type="text" size="5" placeholder="ut1/c0"></td>
	//             <td id="r${i}c9"><input id="I${i}" type="text" size="5" placeholder="Mft"></td>
	//          </tr>`);
	// 	};
	// };
});