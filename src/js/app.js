// JS goes here - ES6 supported

const services = document.querySelectorAll(".testServices a");

document.addEventListener("DOMContentLoaded", function() {
  document.querySelector(".userUrlInput").onblur = urlFieldUpdated;
}, false);

function urlFieldUpdated(event) {
  const userUrl = event.target.value;

  // add url to services
  for (const service of services) {
    const serviceUrl = service.dataset.url;
    service.href = serviceUrl.replace("%url", userUrl);
  }
}
