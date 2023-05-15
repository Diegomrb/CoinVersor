const $resultado = document.querySelector("#resultado");
const API_KEY_ = "f008d28043f1754f9f6952ab362208569dfb2bab";
const API_KEY = "eaed4fd4b1d0648029487785f75c25ad9138a8da";
const API_URL = "https://api.getgeoapi.com/v2/currency";
const $form = document.querySelector("#form-converter");
$form.addEventListener("submit", submitConvertirMoneda);

let global_config_busqueda;

function submitConvertirMoneda(evento) {
  evento.preventDefault();
  mostrarLoader();
  resetDivError();
  obtenerValoresForm();
  check();
  console.log("formulario");
  console.table(global_config_busqueda);
  Promise.all([requestCurrencyFromBaseCurrency()]).then(populateCurrency).catch(mostrarError).finally(ocultarLoader);
}

function populateCurrency(infoApis) {
  console.log("info apis", infoApis);
  escribirMonedaConvertida(infoApis[0]);
  escribirHistoricoMoneda(infoApis[1]);
}

function requestCurrencyFromBaseCurrency() {
  const historicoUrl = `https://api.getgeoapi.com/v2/currency/historical/${global_config_busqueda.fecha}`;
  const historicoParams = {
    api_key: API_KEY,
    from: global_config_busqueda.currencyBase,
    to: global_config_busqueda.currencyQuote,
    amount: global_config_busqueda.monto,
  };
  return fetch(buildUrl(historicoUrl, historicoParams)).then(apiToJson);
}

function escribirMonedaConvertida(dataApi) {
  /*  console.log("data convert", dataApi); */

  const monedaConvertida = dataApi.rates[global_config_busqueda.currencyQuote];
  console.log(monedaConvertida, global_config_busqueda);

  console.log("Parametros");

  console.log(monedaConvertida.rate_for_amount);
  console.log(global_config_busqueda.currencyQuote);

  usdCripto(monedaConvertida.rate_for_amount, "usd-us-dollars", global_config_busqueda.cripto);

  const strMonedaBase = `${dataApi.amount} ${dataApi.base_currency_name}`;
  const strcriptoMoneda = `${monedaConvertida.rate_for_amount} ${monedaConvertida.currency_name}`;

  $resultado.innerHTML =
    `<div class="card text-dark text-center bg-light mx-auto mt-4 mb-4" style="max-width: 25rem;">
        <div class="card-header">Para la fecha ${dataApi.updated_date}</div>
        <div class="card-body">
          <h6 class="card-title">${strMonedaBase} son ${strcriptoMoneda}</h6>
        </div>
      </div>`;

}



function obtenerValoresForm() {
  const amount = document.querySelector("#amount").value;
  const currencyBase = document.querySelector("#currencyBase").value;
  const currencyQuote = document.querySelector("#currencyQuote").value;
  const fecha = document.querySelector("#inp-fecha").value;

  global_config_busqueda = {
    monto: amount,
    currencyBase: currencyBase,
    currencyQuote: "USD",
    cripto: currencyQuote,
    fecha: fecha,
  };
}





function escribirListadoMonedas(dataApi) {
  //console.log(dataApi);
  const monedas = Object.keys(dataApi.currencies);
  //console.log(monedas);

  /* const cripto = (currencies.json());
  console.log(cripto); */

  let optionsTradicionalHtml =
    "<option selected disabled>Seleccione la moneda</option>";
  for (let monedaId of monedas) {
    // monedaId === monedas[i]
    // console.log(monedaId, dataApi.currencies[monedaId]);
    optionsTradicionalHtml += `<option value="${monedaId}">${dataApi.currencies[monedaId]}</option>`;
  }

  /* let optionsCriptoHtml =
    "<option selected disabled>Seleccione la moneda</option>";
  for (let criptoId of cripto) {
    // monedaId === monedas[i]
    // console.log(monedaId, dataApi.currencies[monedaId]);
    optionsCriptoHtml += `<option value="${criptoId}">${dataApi[criptoId]}</option>`;
  } */

  document.querySelector("#currencyBase").innerHTML = optionsTradicionalHtml;
  document.querySelector("#currencyQuote").innerHTML = optionsCriptoHtml;

  // for (let i = 0; i < monedas.length; i++) {
  //     console.log(monedas[i])
  // }
}



function check() {

  // Verifico los datos
  if (global_config_busqueda.monto === "") {
    mostrarErrorUsuario
      (
        `<div class="alert alert-danger text-center  mx-auto mt-3" style="max-width: 20rem; role="alert">
            Deberías indicar un monto
          </div>`
      );
    ocultarLoader();
    return;
  }

  if (global_config_busqueda.currencyBase === global_config_busqueda.currencyQuote) {
    mostrarErrorUsuario
      (
        `<div class="alert alert-danger text-center  mx-auto mt-3" style="max-width: 20rem; role="alert">
                Debes seleccionar monedas distintas
              </div>`
      );
    ocultarLoader();
    return;
  }

  if (global_config_busqueda.currencyBase === "Seleccione la moneda") {
    //mostrar error
    mostrarErrorUsuario
      (
        `<div class="alert alert-danger text-center  mx-auto mt-3" style="max-width: 20rem; role="alert">
              Debes seleccionar una moneda base
            </div>`
      );
    ocultarLoader();
    return;
  }

  if (global_config_busqueda.currencyQuote === "Seleccione la moneda") {
    //mostrar error
    mostrarErrorUsuario
      (
        `<div class="alert alert-danger text-center mx-auto mt-3" style="max-width: 20rem; role="alert">
            Debes seleccionar una moneda
          </div>`
      );
    ocultarLoader();
    return;
  }
}

const mostrarLoader = function () {
  // muestro cargando...
  document.querySelector("#cargando").classList.remove("hide");

  // deshabilito button y select
  $form.querySelector("button").setAttribute("disabled", "true");

  $form.querySelector("#currencyBase").setAttribute("disabled", "true");
  $form.querySelector("#currencyQuote").setAttribute("disabled", "true");
};

const ocultarLoader = () => {
  // oculto cargando...
  document.querySelector("#cargando").classList.add("hide");

  // habilito button y selects
  $form.querySelector("button").removeAttribute("disabled");

  $form.querySelector("#currencyBase").removeAttribute("disabled");
  $form.querySelector("#currencyQuote").removeAttribute("disabled");
};


function mostrarError(errors) {

  try {
    //console.log(errors);
  } catch (error) {

  }
}

function resetDivError() {
  document.querySelector("#error").innerHTML = "";
}

function mostrarErrorUsuario(mensaje) {
  document.querySelector("#error").innerHTML = mensaje;
}

function restar10Dias(fecha) {
  const dateUsuario = new Date(fecha);
  /* console.log("dateUsuario", dateUsuario); */

  dateUsuario.setDate(dateUsuario.getDate() - 10);
  /*  console.log("dateUsuario", dateUsuario); */

  const fechaFromateada = formatearFecha(dateUsuario);
  return fechaFromateada;
}


function escribirHistoricoMoneda(dataApi) {
  console.log("historico moneda", dataApi);

  const dataLabels = dataApi.map(obtenerDiaDeFecha);
  const closeData = dataApi.map(obtenerCloseAndRound);


  /* console.log("close data", closeData); */

  const data = {
    labels: dataLabels,
    series: [closeData],
  };

  new Chartist.Line(".ct-chart", data);
}

function printres(response) {
  console.log(response);
  console.log(JSON.parse(response).price);
  $resultado.innerHTML =
    `<div class="card text-dark text-center bg-light mx-auto mt-4 mb-4" style="max-width: 25rem;">
        <div class="card-header"></div>
        <div class="card-body">
          <h6 class = "card-title" > 
          ${JSON.parse(response).price}</h6>
        </div>
      </div>`;
}

function usdCripto(amount, base_currency_id, quote_currency_id) {
  var URI = "https://api.coinpaprika.com/v1/price-converter?base_currency_id=";
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  console.log("calling: usdcripto()", amount, base_currency_id, quote_currency_id);
  fetch(URI + base_currency_id + "&quote_currency_id=" + quote_currency_id + "&amount=" + amount, requestOptions)
    .then(response => response.text())
    .then(result => printres(result))
    .catch(error => console.log('error', error));

}

function obtenerListadoMonedas() {
  mostrarLoader();

  fetch(`${API_URL}/list?api_key=${API_KEY}`)
    .then(apiToJson)
    .then(escribirListadoMonedas)
    .catch(mostrarError)
    .finally(() => {
      ocultarLoader();
    });
}

function obtenerListadoCripto() {
  mostrarLoader();

  fetch(`https://api.coinpaprika.com/v1/coins`)
    .then(apiToJson)
    .then(escribirListadoMonedas)
    .catch(mostrarError)
    .finally(() => {
      ocultarLoader();
    });
}

function loadCurrenciesCripto() {
  fetch('./js/currencies.json').then(response => {
    return response.json();
  }).then(data => {

    console.log(data[0].id);
  }).catch(err => {

  });
}

function formatearFecha(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  /*     console.log(year, month, day); */

  const formatedMonth = `${month}`.padStart(2, "0");
  const formatedDay = day.toString().padStart(2, "0");

  /*  console.log(year, formatedMonth, formatedDay); */

  return `${year}-${formatedMonth}-${formatedDay}`;
}

function obtenerDiaDeFecha(objDia) {
  const date = objDia.time_close.split("T")[0];
  const dateDay = date.split("-")[2];

  const currentDate = new Date(objDia.time_close);

  return dateDay;
}

function obtenerCloseAndRound(objDia) {
  return Math.round(objDia.close);
}

obtenerListadoMonedas();
obtenerListadoCripto();