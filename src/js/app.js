// JS Goes here - ES6 supported

const services = document.querySelectorAll(".testService");

document.addEventListener("DOMContentLoaded", function() {
  document.querySelector(".userUrl").onblur = urlFieldUpdated;
}, false);

function urlFieldUpdated(event) {
  const userUrl = event.target.value;

  // add url to services
  for (const service of services) {
    service.href = `${service.href}${userUrl}`;
  }
}
