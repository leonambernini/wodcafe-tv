var PROFESSORES = {
    "flavio": [
        ['06:00', '07:00'], 
        ['07:00', '08:00'], 
        ['08:00', '09:00'], 
        ['11:15', '12:15'], 
        ['12:15', '13:15'],
    ],
    "ju": [
        ['17:30', '18:30'], 
        ['18:30', '19:30'], 
        ['19:30', '20:30'], 
        ['20:30', '21:30'],
    ],
}

$('body').append(`<link rel="stylesheet" href="https://cdn.leonambernini.com.br/utc-tv/utc-tv.css?a=${Math.random()}">`)

try {
    var AULAS = JSON.parse(localStorage.getItem("utc-tv")) || {};
} catch (error) {
    var AULAS = {};
}

function atualizaAulas(){
    AULAS = {};
    $.each($('#scheduleId option'), function(){
        var $this = $(this);
        var value = $this.val();
        var title = $this.text().split(' - ');
        if( value != '' ){
            AULAS[value] = title;
        }
    });
    localStorage.setItem("utc-tv", JSON.stringify(AULAS));
}

function prepareUTCTV(){
            
    var professor_by_tecnofit = ($('body > app-root > app-wodtv > div > div.header > div.bottom > div:nth-child(2)').text()).trim();

    var depara = {
        'FLÁVIO HENRIQUE': 'flavio',
        'CAROLINE DA COSTA CASTRO': 'carol',
        'JULIANA CRISTINA SALOMÃO': 'ju',
    }

    // var professor_atual = sessionStorage.getItem('utc-tv-professor') || 'flavio';
    var professor_atual = depara[professor_by_tecnofit];

    $('body').append(`
        <div class="lb-utc-tv" style="display: none;">
            <div class="lb-utc-tv-loader">
                <div class="lb-utc-tv-p-center">
                    <img src="https://cdn.leonambernini.com.br/utc-tv/images/utc-brand.png?a=${Math.random()}" alt="UTC" />
                    <div class="lb-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            </div>
            <div class="lb-utc-tv-tela-1">
                <img src="https://cdn.leonambernini.com.br/utc-tv/images/${professor_atual}.png?a=${Math.random()}" width="" height="" class="lb-utc-tv-coach">
                <div class="lb-utc-tv-p-top">
                    <img src="https://cdn.leonambernini.com.br/utc-tv/images/utc-brand.png?a=${Math.random()}" width="" height="" class="lb-utc-tv-brand">

                    <div class="js-get-wod">
                        
                    </div>
                </div>
            </div>
            <div class="lb-utc-tv-tela-3">
                <iframe src="https://cdn.leonambernini.com.br/utc-tv/WODCAFE/wodcafe.html?a=${Math.random()}" id="lb-utc-wodcafe"></iframe>
            </div>
            <div class="lb-utc-tv-tela-4">
                <h2>CHECK-IN</h2>
                <div class="js-get-alunos">
                    
                </div>
            </div>

        </div>
    `);
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
  
function formatDate(date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
}

function getInfo(){
    var ALUNOS = [];
    $.each( $('.listCheckIn .clientCheckIn'), function(){
        var $this = $(this);
        var img = $this.find('.card-img-top').attr('src');
        var name = $this.find('.card-body-student').text();

        ALUNOS.push({img, name})
    });

    INFO_WOD = $('.info-wod').html();

    if( !$('.lb-utc-tv').is(':visible') ){
        return false;
    }
    
    $('.js-get-wod').html(`<div class="lb-center-box"><div class="lb-utc-brand"></div> <div>${INFO_WOD}</div></div>`);

    var ALUNOS_HTML = [];
    for( var x = 0; x < ALUNOS.length; x++ ){
        ALUNOS_HTML.push(`<li><img src="${ALUNOS[x]['img']}" width="30" height="30"> <span>${ALUNOS[x]['name']}</span></li>`)
    }

    $('.js-get-alunos').html(`
        <div class="lb-full-box">
            <ul class="lb-utc-tv-alunos">
                ${ALUNOS_HTML.join('')}
            </ul>
        </div>
    `);

    $('.lb-utc-tv-loader').fadeOut();
}

function atualizaHorarios(){

    var data = new Date();
    var hora_atual = parseInt(data.getHours());
    var minuto_atual = parseInt(data.getMinutes());
    var hora_atual = parseFloat(`${padTo2Digits(hora_atual)}.${padTo2Digits(minuto_atual)}`);

    var professor_atual = '';
    
    for( var professor in PROFESSORES ){
        var horarios = PROFESSORES[professor];

        for( var x = 0; x < horarios.length; x++ ){
            var aula_inicio = parseFloat(horarios[x][0].replace(':', '.'));
            var aula_fim = parseFloat(horarios[x][1].replace(':', '.'));

            // if( aula_hora < hora_atual && ( ( aula_minuto == 0 && minuto_atual < 60 ) || ( aula_minuto > 0 && minuto_atual < aula_minuto) ) ){
            //     professor_atual = professor;
            //     AULA_ATUAL = horario.join(':');
            // }
            if( aula_inicio <= hora_atual && hora_atual < aula_fim ){
                professor_atual = professor;
                
                for( var aula in AULAS ){
                    if( AULAS[aula][0] == horarios[x][0] && AULAS[aula][1] == horarios[x][1] ){
                        var Tecnofit_WodTV = JSON.parse(sessionStorage.getItem('Tecnofit_WodTV'))
                        if( Tecnofit_WodTV['scheduleId'] != aula ){
                            Tecnofit_WodTV['scheduleId'] = aula;
                            Tecnofit_WodTV['programDate'] = formatDate(data);
                            // Tecnofit_WodTV['programDate'] = '28/06/2022';
                            sessionStorage.setItem('utc-tv-professor', professor_atual);
                            sessionStorage.setItem('Tecnofit_WodTV', JSON.stringify(Tecnofit_WodTV));
                            document.location.reload(true);
                        }
                    }
                }
            }
        }
    }
}

function atualizaQtdCheckins(){
    if( $('#amountList').length ){
        if( $('#amountList').val() != 25 ){
            $('#amountList').val(25);
        }
    }
}

function eventos(){
    $(document).on('DOMNodeInserted DOMNodeRemoved', '#scheduleId', function() {
        atualizaAulas();
        atualizaQtdCheckins()
    });
    
    setTimeout( function(){
        if( $('.info-wod').length ){
            $('.lb-utc-tv').fadeIn();
        }
        getInfo();
        atualizaQtdCheckins();
    }, 1000);

    setInterval( function(){
        atualizaHorarios();
    }, 1000)
    
    setInterval( function(){
        getInfo();
    }, 60000);
}


atualizaHorarios();
prepareUTCTV();
eventos();