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

const Alert = {
  remove: function () {
    document.querySelector("#alert-field > div.alert").remove();
  },
  add: function (text, type = "info") {
    document.querySelector(
      "#alert-field"
    ).innerHTML += `<div class="alert ${type}"><p>${text}</p></div>`;
  },
};

const UrlsList = {
  lskey: "urls",
  get: function () {
    return JSON.parse(localStorage.getItem(this.lskey));
  },
  clear: function () {
    localStorage.removeItem(this.lskey);
  },
  save: function (strQuerySelector) {
    let inputUrls = document
      .querySelector(strQuerySelector)
      .value.trim()
      .split("\n");
    localStorage.setItem(this.lskey, JSON.stringify(inputUrls));
    console.log("urls saved");
  },
  insert: function (strQuerySelector) {
    document.querySelector(strQuerySelector).value = "";
    let urls = this.get();
    urls.forEach((e) => {
      document.querySelector(strQuerySelector).value += e + "\n";
    });
  },
};

window.onload = function () {
  document.querySelector("textarea#t-input").addEventListener("keyup", () => {
    UrlsList.save("textarea#t-input");
  });
  UrlsList.insert("textarea#t-input");

  document.querySelector("button#d0-action").addEventListener("click", () => {
    let plainUrl = document.querySelector("input#i-url").value.trim();
    API.query("GET", "getGostLink", {
      url: plainUrl,
      lang: document.querySelector("#lang-en").checked ? "en" : "ru",
    })
      .then((res) => res.json())
      .then((j) => {
        document.querySelector("#d0-result").innerHTML = j.data;
        navigator.clipboard.writeText(
          document.querySelector("#d0-result").innerHTML
        );
      })
      .catch((e) => alert(e));
  });

  document.querySelector("#alert-field").addEventListener("click", () => {
    document.querySelector("#alert-field > *").remove();
  });

  document.querySelector("#d0-action-clear").addEventListener("click", () => {
    document.querySelector("#i-url").value = "";
    document.querySelector("#d0-result").innerHTML = "";
  });

  // Операции над списком ссылок в localStorage
  document.querySelector("#d1-action-clear").addEventListener("click", () => {
    document.querySelector("textarea#t-input").value = "";
    document.querySelector("ol#t-output").innerHTML = "";
  });

  document
    .querySelector("#d1-action-save_list")
    .addEventListener("click", () => {
      UrlsList.save("textarea#t-input");
    });

  document
    .querySelector("#d1-action-load_list")
    .addEventListener("click", () => {
      UrlsList.insert("textarea#t-input");
    });

  document
    .querySelector("#d1-action-clear_list")
    .addEventListener("click", () => {
      UrlsList.clear();
    });

  document.querySelector("#show-alert").addEventListener("click", () => {
    Alert.add(Date());
  });

  document.querySelector("button#d1-action").addEventListener("click", () => {
    let inputUrls = document
      .querySelector("textarea#t-input")
      .value.trim()
      .split("\n");

    UrlsList.save("textarea#t-input");
    Alert.add("Список создается. Пожалуйста, подождите...");

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
      })
      .then(() => {
        navigator.clipboard.writeText(
          document.querySelector("ol#t-output").textContent
        );
      })
      .catch((e) => {
        Alert.add(`${e}`, "error");
        document.querySelector("button#d1-action-clear")?.click();
      });
  });
};
