var artyom = new Artyom();

document.querySelector("#activar").addEventListener('click', function () {
    artyom.say("sonido activado");
});

var indexes = []
var hola = ""
indexes.push(hola)
let cont = 0
let myChart;

//Función de voz
function voz() {
    artyom.addCommands({
        indexes: indexes,
        action: function (i) {
            artyom.redirectRecognizedTextOutput(function (recognized, isFinal) {
                hola = recognized.toLowerCase();
                if (isFinal) {
                    console.log("Texto final reconocido: " + hola);
                } else {
                    console.log(hola);
                }
            })

            //Gráfico de barras
            const ctx = document.getElementById('myChart').getContext('2d');
            if (typeof myChart === 'undefined') {
                myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Health', 'Attack', 'Defense', 'Special-attack', 'Special-defense', 'Speed'],
                        datasets: [{
                            label: 'Stats',
                            data: [],
                            backgroundColor: 'rgb(85, 34, 195)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        layout: {
                            padding: 10
                        },
                        aspectRatio: 2,
                        barThickness: 20

                    }
                });
            }
            $.ajax({
                url: "https://pokeapi.co/api/v2/pokemon/" + hola,
                type: "GET",
                contentType: "application/json",
                success: function (data) {
                    console.log(data)
                    document.getElementById("ins").style.display = "block";
                    document.getElementById("active").style.display = "none";
                    document.getElementById("not").style.display = "none";

                    if (data.sprites && data.sprites.other && data.sprites.other.home && data.sprites.other.home.front_default) {
                        $("#image_pokemon").html(`<img src="${data.sprites.other.home.front_default}">`)

                        if (data.abilities && data.abilities.length > 0) {
                            var abilities = data.abilities.map(habilidad => habilidad.ability.name)
                            var skills = abilities.join("<br> ")
                        }

                        //Info ficha técnica
                        var name = data.name
                        var pik = name.charAt(0).toUpperCase() + name.slice(1);
                        var type = data.types[0].type.name
                        var weight = data.weight
                    }

                    //Ficha técnica
                    $("#headv").html(pik)
                    $("#titlev").html("Abilities")
                    $("#skillv").html(skills)
                    $("#title2v").html("Type")
                    $("#typev").html(type)
                    $("#title3v").html("Weight")
                    $("#weightv").html(weight)

                    //Control de pantalla
                    if (name === hola) {
                        $("#cont, #box_voz, #myButton, #myChart").fadeIn()
                        document.getElementById("myButton").innerText = "Your pokemon: " + name;
                        document.getElementById("ins").style.display = "none";
                        document.getElementById("chart").style.display = "block";
                        imagenes()
                        barras()
                    }

                    //Pasar imágenes
                    function imagenes() {
                        cont++

                        if (cont === 2) {
                            document.getElementById("cont").style.display = "none";
                            dos()
                        }
                        else if (cont === 3) {
                            document.getElementById("cont").style.display = "none";
                            tres()
                        }
                        else if (cont === 4) {
                            document.getElementById("cont").style.display = "none";
                            cuatro()
                        }
                    }

                    //Segunda imagen
                    function dos() {
                        if (data.sprites && data.sprites.other && data.sprites.other["official-artwork"] && data.sprites.other["official-artwork"].front_shiny) {
                            $("#image_pokemon").html(`<img src="${data.sprites.other["official-artwork"].front_shiny}">`)
                            $("#cont").fadeIn()
                        }
                    }

                    //Tercera imagen
                    function tres() {
                        if (data.sprites && data.sprites.other && data.sprites.other.dream_world && data.sprites.other.dream_world.front_default) {
                            $("#image_pokemon").html(`<img src="${data.sprites.other.dream_world.front_default}" style="width: 450px; height: auto; padding-left: 90px;">`)
                            $("#cont").fadeIn()
                        }
                    }

                    //Cuarta imagen
                    function cuatro() {
                        if (data.sprites && data.sprites.other && data.sprites.other.home && data.sprites.other.home.front_shiny) {
                            $("#image_pokemon").html(`<img src="${data.sprites.other.home.front_shiny}">`)
                            $("#cont").fadeIn()
                        }
                        cont = 0
                    }

                    //Datos del Gráfico de barras
                    function barras() {
                        myChart.data.datasets[0].data = [
                            data.stats[0].base_stat,
                            data.stats[1].base_stat,
                            data.stats[2].base_stat,
                            data.stats[3].base_stat,
                            data.stats[4].base_stat,
                            data.stats[5].base_stat
                        ]
                    }
                    myChart.update()

                },

                //Validación de error
                error: function (xhr, status, error) {
                    if (xhr.status === 404) {
                        document.getElementById("myButton").innerText = "Pokemon not found: " + hola
                        document.getElementById("cont").style.display = "none";
                        document.getElementById("box_voz").style.display = "none";
                        document.getElementById("not").style.display = "block";
                        document.getElementById("ins").style.display = "none";
                        document.getElementById("chart").style.display = "none";
                    }
                }
            })
        }
    })
};

//Iniciar comando de voz
function iniciar() {
    artyom.initialize({
        lang: "en-US",
        debug: true,
        listen: true,
        continuous: true,
        speed: 0.9,
        mode: "normal"
    });
}

//Detener función de voz
function detenerVoz() {
    artyom.fatality();
}

//Función de texto
function text() {
    $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon/" + $("#search").val(),
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            console.log(data)

            $("#second").fadeIn();

            $("#poke1").html(`<img src="${data.sprites.other.home.front_default}">`)
            $("#poke2").html(`<img src="${data.sprites.other.dream_world.front_default}" style="width: 450px; height: auto; padding-left: 90px;">`)
            $("#poke3").html(`<img src="${data.sprites.other.home.front_shiny}">`)
            $("#poke4").html(`<img src="${data.sprites.other["official-artwork"].front_shiny}" style="padding-left: 50px;">`)

            if (data.abilities && data.abilities.length > 0) {
                var abilities = data.abilities.map(habilidad => habilidad.ability.name)
                var skills = abilities.join("<br> ")
            }

            //Ficha técnica
            $("#head").html(data.name.charAt(0).toUpperCase() + data.name.slice(1))
            $("#title").html("Abilities")
            $("#skill").html(skills)
            $("#title2").html("Type")
            $("#type").html(data.types[0].type.name)
            $("#title3").html("Weight")
            $("#weight").html(data.weight)

            //Estadísticas
            for (let i = 0; i <= 5; i++) {
                let statName = data.stats[i].stat.name;
                let baseStat = data.stats[i].base_stat;
                $("#stat" + i).html(`${statName} → ${baseStat}`);
            }

            $(document).ready(function () {
                //Mostrar ficha técnica
                $("#data").on("click", function () {
                    var caja = document.getElementById("search").value;
                    if (caja === "") {
                        document.getElementById("box").style.display = "none"
                    } else {
                        $("#box").fadeIn(); $("#car, #ca").fadeOut();
                    }
                })
                //Estadísticas
                $("#sta").on("click", function () {
                    var caja = document.getElementById("search").value;
                    if (caja === "") {
                        document.getElementById("car").style.display = "none"
                    } else {
                        $("#car").fadeIn(); $("#box, #ca").fadeOut();
                    }
                })
                //Items
                $("#item").on("click", function () {
                    var caja = document.getElementById("search").value;
                    if (caja === "") {
                        document.getElementById("ca").style.display = "none"
                        document.getElementById("items").style.display = "none"
                    } else {
                        $("#box, #car").fadeOut();
                        if (data.held_items.length === 0) {
                            document.getElementById("ca").style.display = "none"
                        } else {
                            document.getElementById("ca").style.display = "block"
                        }
                    }
                })
            })

            var activeIndex = $('#carouselExample3').find('.carousel-item.active').index();

            if (activeIndex === 1 || activeIndex === 2) {
                $('#carouselExample3').carousel(0);
            }

            //Carrusel de items
            if (data.held_items.length === 1) {
                $("#im2").remove();
                $("#im3").remove();
                items(0)
            } else if (data.held_items.length === 2) {
                items(0)
                items(1)
                $("#im3").remove();
                if ($("#im2").length === 0) {
                    $('#carouselExample3 .carousel-inner').append('<div class="carousel-item" id="im2"></div>');
                    $("#im3").remove();
                }
            } else if (data.held_items.length === 3) {
                items(0)
                items(1)
                items(2)
                if ($("#im2").length === 0) {
                    $('#carouselExample3 .carousel-inner').append('<div class="carousel-item" id="im2"></div>');
                } if ($("#im3").length === 0) {
                    $('#carouselExample3 .carousel-inner').append('<div class="carousel-item" id="im3"></div>');
                }
            }

            //Imágenes de items

            function items(foto) {
                $.ajax({
                    url: data.held_items[foto].item.url,
                    type: "GET",
                    contentType: "application/json",
                    success: function (itemData) {
                        const spriteUrl = itemData.sprites.default;
                        $(`#im${foto + 1}`).html(`<img src="${spriteUrl}" style="width:120px; height: auto;">`);
                    },
                });
            }

        },

        //Validación de error
        error: function (xhr, status, error) {
            if (xhr.status === 404) {
                document.getElementById("error").style.display = "block"
                document.getElementById("box").style.display = "none"
                document.getElementById("car").style.display = "none"
                document.getElementById("ca").style.display = "none"
            }
        }
    })
}

//Segundo texto_duel
function text1() {
    $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon/" + $("#search1").val(),
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            console.log(data)
            $("#cajita").fadeIn();
            document.getElementById("error2").style.display = "none"
            $("#pok1").html(`<img src="${data.sprites.other.home.front_default}">`)
            $("#pok2").html(`<img src="${data.sprites.other.dream_world.front_default}" style="width: 450px; height: auto; padding-left: 90px;">`)
            $("#pok3").html(`<img src="${data.sprites.other.home.front_shiny}">`)
            $("#pok4").html(`<img src="${data.sprites.other["official-artwork"].front_shiny}" style="padding-left: 50px;">`)
        },

        //Validación de error
        error: function (xhr, status, error) {
            if (xhr.status === 404) {
                document.getElementById("error2").style.display = "block"
                document.getElementById("vs").style.display = "none"
            }
        }
    })
}

//Tercer texto_duel
function text2() {
    $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon/" + $("#search2").val(),
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            console.log(data)

            $("#cajita2").fadeIn();
            document.getElementById("error3").style.display = "none"

            $("#po1").html(`<img src="${data.sprites.other.home.front_default}">`)
            $("#po2").html(`<img src="${data.sprites.other.dream_world.front_default}" style="width: 450px; height: auto; padding-left: 90px;">`)
            $("#po3").html(`<img src="${data.sprites.other.home.front_shiny}">`)
            $("#po4").html(`<img src="${data.sprites.other["official-artwork"].front_shiny}" style="padding-left: 50px;">`)
        },

        //Validación de error
        error: function (xhr, status, error) {
            if (xhr.status === 404) {
                document.getElementById("error3").style.display = "block"
                document.getElementById("vs").style.display = "none"
            }
        }
    })
}

$(document).ready(function () {

    //Control de pantalla inicial
    $("#but").on("click", function (event) {
        event.preventDefault();
        $("#page, #flecha").fadeIn(); $("#contener").fadeOut();
    })

    //Al presionar el botón 'texto'
    $("#read").on("click", function () {
        $("#c").fadeOut(); $("#van").fadeIn();
    })

    //Hacer búsqueda al presionar Enter
    $("#search").on("keypress", function (event) {
        if (event.keyCode === 13) {
            busqueda()
        }
    })

    //Hacer búsqueda al dar click en Search
    $("#ser").on("click", function (event) {
        event.preventDefault();
        busqueda()
    })

    //Botón Duel
    $("#duel").on("click", function (event) {
        event.preventDefault();
        $("#second, #box, #car, #ca, #complete").fadeOut();
        $("#buscar2").fadeIn();
        document.getElementById("search").value = "";
    })

    //Botón Go
    $("#go").on("click", function (event) {
        var caja1 = document.getElementById("search1").value;
        var caja2 = document.getElementById("search2").value;
        if (caja1 === "" || caja2 === "") {
            $("#cajita, #cajita2, #error2, #error3").fadeOut()
            document.getElementById("casillas").style.display = "block"
        } else {
            text1(); text2();
            $("#cajita, #cajita2, #casillas").fadeOut();
            document.getElementById("vs").style.display = "block";
        }
    })

    //Botón voz
    let mess = 0
    $("#speak").on("click", function () {
        iniciar(); voz();
        $("#ins, #active, #ven3").fadeIn();
        $("#c").fadeOut();
        mess++
        if (mess > 1) {
            document.getElementById("active").style.display = "none";
        } else if (mess === 1) {
            document.getElementById("ins").style.display = "none";
        }
    })

})

//Realizar búsqueda
function busqueda() {
    var caja = document.getElementById("search").value;
    if (caja === "") {
        $("#second, #box, #car, #ca, #cajita ,#cajita2, #buscar2, #casillas, #error2, #error3, #vs").fadeOut();
        document.getElementById("error").style.display = "none"
        document.getElementById("complete").style.display = "block"
    } else {
        text();
        $("#second, #box, #car, #ca, #cajita ,#cajita2, #buscar2, #casillas, #error2, #error3, #vs").fadeOut();
        document.getElementById("complete").style.display = "none"
        document.getElementById("error").style.display = "none"
        document.getElementById("search1").value = "";
        document.getElementById("search2").value = "";
    }
}

//Botón flecha
$(document).ready(function () {
    document.getElementById("c").style.display = "block"
    $("#flecha").on("click", function () {
        detenerVoz()
        if (document.getElementById("c").style.display === "block") {
            $("#contener").fadeIn(); $("#page, #flecha").fadeOut()
        } else {
            $("#van, #second, #cont, #box, #myButton, #ins, #active, #not, #car, #buscar2, #cajita, #cajita2, #casillas, #items, #error, #error2, #error3, #vs, #complete, #ven3, #chart, #box_voz, #ca").fadeOut();
            $("#c").fadeIn();
            document.getElementById("search").value = "";
            document.getElementById("search1").value = "";
            document.getElementById("search2").value = "";
        }
    })
})