{
	let colores=["black","white","blue","red","yellow","green","purple","brown"];
	const NUM_BOLAS = 4;
	let $bolasFila,$colorSeleccionado,$bolAcierto,$bolasVacias,$aciertosVacios,$filaNueva;
	let combinacion, aciertos;
	//numero de bola puesta en la fila
	//numero de fila
	let conFila=conBola=0;
	let cambioColores={"rgb(0, 0, 0)":'black',"rgb(255, 255, 255)":'white',"rgb(0, 0, 255)":'blue',"rgb(255, 0, 0)":'red',"rgb(255, 255, 0)":'yellow',"rgb(0, 128, 0)":'green' ,"rgb(128, 0, 128)":'purple',"rgb(165, 42, 42)":'brown',};

	//Mastermin con clousure
	var mastermind=(function(){
		let combinacion=[];
		let negras,blancas;
		let init = function(){
			generaCombinacion();
			mostrar();
		};
		//muestra la combinación objetivo por consola.
		let mostrar=function(){
			console.log(combinacion);		
		};
		//genera una combinación de negros (número de bolas que están en su sitio) y blancos (número de bolas que estám, pero no en su sitio).
		let comprobarIntento=function(intento){
			let salir;
			let copiacombinacion=combinacion.slice();
			//negros(en su sitio)
			blancas=0;
			negras=0; 
			for (let i = 0; i < intento.length; i++) {
				if(intento[i]===copiacombinacion[i]){
					negras++; 
					copiacombinacion[i]=undefined;
					intento[i]=null;
				}
			}
			//blancos(estan en otra posicion)
			for(let i=0; i < intento.length;i++){
				salir = false;
				for (let  j= 0; j < copiacombinacion.length; j++) {
					if(copiacombinacion[j]===intento[i] && salir===false){
						blancas++;
						copiacombinacion[j]=undefined;
						salir=true;
					}
				}
			}
			return {
				negras: negras,
				blancas: blancas
			}
		};
		//genera una combinación.
		let generaCombinacion = function(){
			blancas=negras=0;
			if(combinacion) combinacion=[];
			for (let i = 0; i < NUM_BOLAS; i++) {
				combinacion.push(colores[parseInt(Math.random()*8)]);
			}
		}
		return {
			init:init,
			comprobarIntento:comprobarIntento,
			mostrar:mostrar,
		}
	})();

	//INTERFAZ GRAFICA
	//Poner colores a las bolas que se selecionan para insertarse
	$(function(){	
		$bolasDerecha=$('.colores');
		$filas=$('#filas');
		$ganado=$("#ganado");			
		mastermind.init();
		crearFila();
		i=0;
		//rellenar bolas lateral
		$(colores).each(function () {
			$bolacolor=$('<div class="color circle"></div>').css('background',this)
			.on('click',ponerBola);
			$bolasDerecha.append($bolacolor);
		});

		//llamadas
		$('#fin').on('click',function(){
			reiniciar();
			$ganado.effect('explode');
		});
		$('#comprobar').on('click',comprobarFila);
	});
	//bolas de la fila nueva
	let crearFila =function () {	
		$bolasVacias = $(document.createElement('div'))
			.addClass('wrapper linea');//creamos los divs donde van las bolas a rellenar de la fila
		$aciertosVacios = $(document.createElement('div'))
			.addClass('wrapper cuatro');//creamos los divs donde van las bolas de aciertos de la fila
		//creamos las bolas para colocar y los aciertos
		for (let i = 0; i < NUM_BOLAS; i++) {
			$bolasVacias.append($(document.createElement("div"))
				.addClass('circle hueco')
				.attr('libre','true'));
			$aciertosVacios.append($(document.createElement("div"))
				.addClass('circle acierto'+conFila));
		}
		$filaNueva = $(document.createElement('div'))
			.addClass('fila'+conFila) //fila nueva
			.append($bolasVacias) //insertamos las bolas a rellenar en la fila
			.append($aciertosVacios); //insertamos las bolas de acierto en la fila
		$filas.append($filaNueva); //insertamos la fila en el div de filas
		$bolasFila = $('.fila'+conFila+' > .linea > div'); //cogemos las bolas de la fila creada
		conFila++; //sumamos uno a la fila
	}
	//Quitar bola de la fila
	let quitarBola =function () {
		$(this).css('backgroundColor','rgb(211, 211, 211)')
			.attr('libre','true')
			.off("click", quitarBola)
			.effect('explode')
			.show('explode');
		conBola--;
	}
	//Poner bola en la fila
	let ponerBola=function (event) {
		if (conBola < NUM_BOLAS) {
			$colorSeleccionado = $(this).css('backgroundColor');
			$primeraBolaVacia=bolaVacia();
			$primeraBolaVacia.css('background',$colorSeleccionado)
				.attr('libre','false')
				.on("click", quitarBola)
				.show('fade',500)
				.effect('bounce');
			conBola++;
			return false;
		}
	};

	let bolaVacia= function(){
		return $('.hueco[libre = "true"]:first');
	}
	//comprobar fila
	let comprobarFila=function () {
		combinacion=[];
		$bolAcierto = $('.acierto'+(conFila-1));
		if (conBola === NUM_BOLAS) {
			$bolasFila.each(function(index, el) {
				$backcolor=$(this).css('backgroundColor');
				combinacion.push(cambioColores[$backcolor]);
			});
			aciertos = mastermind.comprobarIntento(combinacion);
			//Poner aciertos (bolas negras)
			if (aciertos.negras > 0 ){
				for (let i = 0; i < aciertos.negras; i++) {
					console.log($bolAcierto);
					$($bolAcierto[i]).css('background','black');			
				};
			};
			//Poner aciertos (bolas blancas)
			if (aciertos.blancas > 0){
				for (let i = 0; i < aciertos.blancas; i++) {
					$($bolAcierto[aciertos.negras+i]).css('background','white');
				};
			}; 
			//si hay 4 aciertos o llega a 7 intentos se finaliza el juego
			if(aciertos.negras === NUM_BOLAS){
				$ganado.css('display','block')
					.show('explode');
				$('#finTexto').html('<h1>Has Ganado</h1>');
				quitarEvento();
			}else{
				quitarEvento();
				crearFila();
			}
			conBola=0;
		}
	}
	let reiniciar= function(){
		$filas.html("");
		mastermind.init();
		crearFila();
	}
	let quitarEvento = function(){
		$bolasFila.each(function(){
			$(this).off('click',quitarBola);
		});
	}
}