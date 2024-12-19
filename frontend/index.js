// {title} — Текст: электронный // {domen}: [сайт]. — URL: {url} (дата обращения: {date}).

const API = {
  api_address: "127.0.0.1",
  api_port: 8888,
  api_path: "/api/v1/",

  query: async function (method, apiGate, paramsObject, body = null) {
    let params = new URLSearchParams(paramsObject);
    return await fetch(
      `http://${this.api_address}:${this.api_port}${
        this.api_path
      }${apiGate}?${params.toString()}`,
      {
        method: method,
        body: body,
      }
    );
  },
};

window.onload = function () {
  document.querySelector("button#d0-action").addEventListener("click", () => {
    let plainUrl = document.querySelector("input#i-url").value.trim();
    API.query("GET", "getGostLink", {
      url: plainUrl,
      lang: document.querySelector("#lang-en").checked ? "en" : "ru",
    })
      .then((res) => res.json())
      .then((j) => {
        document.querySelector("#d0-result").innerHTML = j.data;
      });
  });

  document
    .querySelector("button#d0-action-clear")
    .addEventListener("click", () => {
      document.querySelector("#i-url").value = "";
      document.querySelector("#d0-result").innerHTML = "";
    });

  document
    .querySelector("button#d1-action-clear")
    .addEventListener("click", () => {
      document.querySelector("textarea#t-input").value = "";
      document.querySelector("ol#t-output").innerHTML = "";
    });

  document.querySelector("button#d1-action").addEventListener("click", () => {
    let inputUrls = document
      .querySelector("textarea#t-input")
      .value.trim()
      .split("\n");

    inputUrls = inputUrls.filter((value) => value && value.trim?.());
    // console.log(inputUrls);

    document.querySelector("ol#t-output").innerHTML = "Ожидание ответа от сервера. Пожалуйста, подождите...";

    API.query(
      "POST",
      "getGostLink",
      {
        lang: document.querySelector("#lang-en").checked ? "en" : "ru",
      },
      JSON.stringify(inputUrls)
    )
      .then((resp) => resp.json())
      .then((j) => {
        document.querySelector("ol#t-output").innerHTML = "";
        j.data.forEach((element) => {
          document.querySelector(
            "ol#t-output"
          ).innerHTML += `<li class='gost-link'>${element}</li>`;
        });
      });
  });
};
