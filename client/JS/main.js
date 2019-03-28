let selectPlaza = document.getElementById("plazaCode");
let barcontainer = document.getElementById("barContainer");
plazas = {};
// Categoriza los nombramientos por plazas en un JSON, con el id de plaza como key
// Los subelementos son JSON tienen como clave la fecha y el valor es el porcentaje
for (index in nombramientos) {
  const item = nombramientos[index];
  let listaID = item["ridnombramientos"].slice(1, -1).split(",");
  for (plaza in listaID) {
    if (!plazas[listaID[plaza]]) plazas[listaID[plaza]] = {};
    plazas[listaID[plaza]][item["rdia"]] = item["rporcentaje"];
  }
}

//Llena el select con los key de plaza
for (idPlaza in plazas) {
  let option = document.createElement("option");
  option.value = idPlaza;
  option.innerHTML = idPlaza;
  selectPlaza.append(option);
}
// Deselecciona cualquier elementos
selectPlaza.selectedIndex = "-1";
let selectedPlaza = "";
let selectedScale = "day";
// Se ejecuta cada vez que cambia el valor del select
function changeSelect(value) {
  //limpia el contenido del grafico y ejecuta una acción distinta en base a la escala actual
  selectedPlaza = value;
  barcontainer.innerHTML = "";
  switch (selectedScale) {
    case "day":
      byDay();
      break;
    case "month":
      byMonth();
      break;
    case "year":
      byYear();
      break;
    default:
      break;
  }
  changeScale(scale);
}
// Crea un grafico basado en días
function byDay() {
  // Chequea si se ha escogido un rango de fechas
  let dateCheck = dates["startDate"] != "" && dates["endDate"];
  let times = { start: "", end: "" };
  if (dateCheck) {
    times["start"] = new Date(dates["startDate"]).getTime();
    times["end"] = new Date(dates["endDate"]).getTime();
  }
  selectedScale = "day";
  barcontainer.innerHTML = "";
  delay = 0;
  for (entry in plazas[selectedPlaza]) {
    let entryTime = new Date(entry).getTime();
    // Omite las entradas que se salen del rango de fechas
    if (dateCheck && (times["start"] > entryTime || entryTime > times["end"])) {
      continue;
    }
    let newBar = document.createElement("span");
    let percent = plazas[selectedPlaza][entry];
    // crea una nueva barra, aplica estilos y la inserta
    if (percent < 50) {
      newBar.className = "low";
    } else if (percent > 100) {
      newBar.className = "high";
    } else {
      newBar.className = "medium";
    }

    newBar.className += " tooltip bar";
    newBar.style = "height:" + 0 + "px";
    newBar.innerHTML =
      '<span class="tooltiptext">' + entry + ", " + percent + "%</span>";
    barcontainer.appendChild(newBar);
    // cada barra crece 10 milisegundos después de la anterior
    setTimeout(() => {
      newBar.style = "height:" + percent + "px; width:" + scale + "px";
    }, delay);
    delay += 10;
  }
}
function byMonth() {
  // similar a selección por dia
  let dateCheck = dates["startDate"] != "" && dates["endDate"];
  let times = { start: "", end: "" };
  if (dateCheck) {
    times["start"] = new Date(dates["startDate"]).getTime();
    times["end"] = new Date(dates["endDate"]).getTime();
  }
  selectedScale = "month";
  barcontainer.innerHTML = "";
  let months = {};
  for (entry in plazas[selectedPlaza]) {
    let entryTime = new Date(entry).getTime();
    if (dateCheck && (times["start"] > entryTime || entryTime > times["end"])) {
      continue;
    }
    unformated = entry.split("-");
    let key = unformated[0] + "-" + unformated[1];
    let percent = plazas[selectedPlaza][entry];
    // Esta parte establece el rango minimo y maximo de porcentajes
    if (!months[key]) {
      months[key] = { max: percent, min: percent };
    } else {
      if (months[key]["max"] < percent) {
        months[key]["max"] = percent;
      } else if (months[key]["min"] > percent) {
        months[key]["min"] = percent;
      }
    }
  }
  delay = 0;
  // Recorre los meses generados, generando un par de barras contenidas en un span por cada mes
  for (month in months) {
    let barPair = document.createElement("span");
    barPair.className = "tooltip barPair";
    barPair.innerHTML =
      '<span class="tooltiptext">' +
      month +
      ", " +
      months[month]["min"] +
      "% - " +
      months[month]["min"] +
      "%</span>";
    for (data in months[month]) {
      let newBar = document.createElement("span");
      let percent = months[month][data];
      if (percent < 50) {
        newBar.className = "low";
      } else if (percent > 100) {
        newBar.className = "high";
      } else {
        newBar.className = "medium";
      }
      newBar.className += " bar";
      newBar.style = "height:" + 0 + "px; margin-top:";
      barPair.appendChild(newBar);
      setTimeout(() => {
        // El estilo considera el valor de porcentaje y la escala escogida en el scroll
        newBar.style = "height:" + percent + "px; width:" + scale + "px";
      }, delay);
      delay += 10;
    }
    barcontainer.appendChild(barPair);
  }
}

function byYear() {
  // completamente igual a la selección por mes, solo que la clave key es menos especifico, especificando solo el año
  let dateCheck = dates["startDate"] != "" && dates["endDate"];
  let times = { start: "", end: "" };
  if (dateCheck) {
    times["start"] = new Date(dates["startDate"]).getTime();
    times["end"] = new Date(dates["endDate"]).getTime();
  }
  selectedScale = "month";
  selectedScale = "year";
  barcontainer.innerHTML = "";
  let years = {};
  for (entry in plazas[selectedPlaza]) {
    let entryTime = new Date(entry).getTime();
    if (dateCheck && (times["start"] > entryTime || entryTime > times["end"])) {
      continue;
    }
    unformated = entry.split("-");
    let key = unformated[0];
    let percent = plazas[selectedPlaza][entry];
    if (!years[key]) {
      years[key] = { max: percent, min: percent };
    } else {
      if (years[key]["max"] < percent) {
        years[key]["max"] = percent;
      } else if (years[key]["min"] > percent) {
        years[key]["min"] = percent;
      }
    }
  }
  delay = 0;
  for (year in years) {
    let barPair = document.createElement("span");
    barPair.className = "tooltip barPair";
    barPair.innerHTML =
      '<span class="tooltiptext">' +
      year +
      ", " +
      years[year]["min"] +
      "% - " +
      years[year]["min"] +
      "%</span>";
    for (data in years[year]) {
      let newBar = document.createElement("span");
      let percent = years[year][data];
      if (percent < 50) {
        newBar.className = "low";
      } else if (percent > 100) {
        newBar.className = "high";
      } else {
        newBar.className = "medium";
      }
      newBar.className += " bar";
      newBar.style = "height:" + 0 + "px; margin-top:";
      barPair.appendChild(newBar);
      setTimeout(() => {
        newBar.style = "height:" + percent + "px; width:" + scale + "px";
      }, delay);
      delay += 10;
    }
    barcontainer.appendChild(barPair);
  }
}

let dates = { startDate: "", endDate: "" };
startInput = document.getElementById("fInicial");
endInput = document.getElementById("fFinal");
// se ejecuta al cambiar la fecha inicial, la cual es capturada y comprobada, si no es valida se regresa a su estado anterior
function setStartDate(value) {
  let original = dates["startDate"];
  protoEnd = new Date(dates["endDate"]);
  protoDate = new Date(value);
  // Se hace un calculo de diferencia
  if (dates["endDate"] != "" && protoEnd.getTime() - protoDate.getTime() < 1) {
    startInput.value = original;
    return;
  }
  dates["startDate"] = value;
  changeSelect(selectedPlaza);
}
function setEndDate(value) {
  let original = dates["endDate"];
  protoStart = new Date(dates["startDate"]);
  protoDate = new Date(value);
  if (
    dates["startDate"] != "" &&
    protoStart.getTime() - protoDate.getTime() > -1
  ) {
    endInput.value = original;
    return;
  }
  dates["endDate"] = value;
  changeSelect(selectedPlaza);
}
let scale = 10;
// Se ejecuta al cambiar la escala, recorre todos los elementos del DOM y le asigna el width solicitado
function changeScale(value) {
  scale = value;
  bars = document.getElementsByClassName("bar");
  for (barra in bars) {
    if (bars[barra] && bars[barra].style)
      bars[barra].style.width = value + "px";
  }
}
