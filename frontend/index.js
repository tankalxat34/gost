// {title} — Текст: электронный // {domen}: [сайт]. — URL: {url} (дата обращения: {date}).

const API = {
  api_address: "192.168.1.101",
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
  /**
   * localStorage key
   */
  lskey: "urls",
  _getUrlsFromTextarea: function (strQuerySelector) {
    let inputUrls = document
      .querySelector(strQuerySelector)
      .value.trim()
      .split("\n");
    return inputUrls;
  },
  get: function () {
    return JSON.parse(localStorage.getItem(this.lskey));
  },
  clear: function () {
    localStorage.removeItem(this.lskey);
  },
  save: function (strQuerySelector) {
    let inputUrls = this._getUrlsFromTextarea(strQuerySelector);
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

var Services = {
  /**
   * Генератор библиографического описания
   */
  rugost: {
    /**
     * Листенер для выпадающего списка с вариантами Источников
     */
    selector: function () {
      let gost_selector = document.querySelector("#helper-rugost_selector");

      for (
        let index = 0;
        index < document.querySelectorAll(".helper-rugost_raw").length;
        index++
      ) {
        const element = document.querySelectorAll(".helper-rugost_raw")[index];

        element.hidden = true;

        if (element.id === "helper-rugost_s".concat(gost_selector.value)) {
          element.hidden = false;
        }
      }
    },
    /**
     * Очистка формы
     */
    clear: function () {
      let gost_selector = document.querySelector("#helper-rugost_selector");
      let selector = "#helper-rugost_s".concat(gost_selector.value);
      let elements = document.querySelectorAll(`div${selector} > input`);

      if (gost_selector.value !== "-1") {
        for (let index = 0; index < elements.length; index++) {
          const element = elements[index];
          element.value = "";
        }

        document.querySelector(`div${selector} > textarea`).value = "";
      }
    },
    /**
     * Источник: Книга
     */
    s0: function () {
      let textarea_result = document.querySelector("#helper-rugost-result-s0");

      let author = document.querySelector("#helper-rugost-author-s0");
      let title = document.querySelector("#helper-rugost-title-s0");
      let num_redaction = document.querySelector(
        "#helper-rugost-num_redaction-s0"
      );
      let city = document.querySelector("#helper-rugost-city-s0");
      let publisher = document.querySelector("#helper-rugost-publisher-s0");
      let year = document.querySelector("#helper-rugost-year-s0");
      let pages_count = document.querySelector("#helper-rugost-pages_count-s0");

      textarea_result.value = `${author.value.split(",")[0].trim()} ${
        title.value
      } / ${author.value}. — ${num_redaction.value}. — ${city.value} : ${
        publisher.value
      }, ${year.value}. — ${pages_count.value} c. — Текст : непосредственный.`;
    },
    /**
     * Статьи из журнала
     */
    s1: function () {
      let textarea_result = document.querySelector("#helper-rugost-result-s1");

      let author = document.querySelector("#helper-rugost-author-s1");
      let title = document.querySelector("#helper-rugost-title-s1");
      let magazine_title = document.querySelector(
        "#helper-rugost-magazine_title-s1"
      );
      let magazine_number = document.querySelector(
        "#helper-rugost-magazine_number-s1"
      );
      let page = document.querySelector("#helper-rugost-page-s1");
      let year = document.querySelector("#helper-rugost-year-s1");

      textarea_result.value = `${author.value.split(",")[0].trim()} ${
        title.value
      } / ${author.value}. — Текст : непосредственный // ${
        magazine_title.value
      }. — ${year.value}. — № ${magazine_number.value}. — С. ${page.value}.`;
    },
    /**
     * Статьи из сборника
     */
    s2: function () {
      let textarea_result = document.querySelector("#helper-rugost-result-s2");

      let author = document.querySelector("#helper-rugost-author-s2");
      let title = document.querySelector("#helper-rugost-title-s2");
      let sbornik_title = document.querySelector(
        "#helper-rugost-sbornik_title-s2"
      );
      let page = document.querySelector("#helper-rugost-page-s2");
      let city = document.querySelector("#helper-rugost-city-s2");
      let publisher = document.querySelector("#helper-rugost-publisher-s2");
      let year = document.querySelector("#helper-rugost-year-s2");

      textarea_result.value = `${author.value.split(",")[0].trim()} ${
        title.value
      } / ${author.value}. — Текст : непосредственный // ${
        sbornik_title.value
      }. — ${city.value} : ${publisher.value}, ${year.value}. — С. ${
        page.value
      }.`;
    },
    /**
     * Интернет ресурс
     */
    s4: function () {
      let textarea_result = document.querySelector("#helper-rugost-result-s4");

      let author = document.querySelector("#helper-rugost-author-s4");
      let title = document.querySelector("#helper-rugost-title-s4");
      let web_title = document.querySelector("#helper-rugost-web_title-s4");
      let web_url = document.querySelector("#helper-rugost-web_url-s4");

      let date = new Date();

      if (author.value) {
        textarea_result.value = `${author.value.split(",")[0].trim()} ${
          title.value
        } / ${author.value}. — Текст : электронный // ${
          web_title.value
        } : [сайт]. — URL: ${
          web_url.value
        } (дата обращения: ${date.toLocaleDateString()}).`;
      } else {
        textarea_result.value = `${title.value}. — Текст : электронный // ${
          web_title.value
        } : [сайт]. — URL: ${
          web_url.value
        } (дата обращения: ${date.toLocaleDateString()}).`;
      }
    },
  },
};

function addListenersToServices() {
  /**
   * Для генератора ГОСТ
   */
  document
    .querySelector("#helper-rugost_selector")
    .addEventListener("change", Services.rugost.selector);

  /**
   * Кнопка очистки формы для ГОСТ
   */
  document
    .querySelector("#helper-rugost-btn_clear")
    .addEventListener("click", Services.rugost.clear);

  /**
   * Привязка события keyup для ГОСТ Книги
   */
  document
    .querySelector("#helper-rugost_s0")
    .addEventListener("keyup", Services.rugost.s0);

  /**
   * Привязка события keup для ГОСТ Статьи из журнала
   */
  document
    .querySelector("#helper-rugost_s1")
    .addEventListener("keyup", Services.rugost.s1);

  /**
   * Привязка события keup для ГОСТ Статьи из сборника
   */
  document
    .querySelector("#helper-rugost_s2")
    .addEventListener("keyup", Services.rugost.s2);

  /**
   * Привязка события keup для ГОСТ Интернет-ресурс
   */
  document
    .querySelector("#helper-rugost_s4")
    .addEventListener("keyup", Services.rugost.s4);
}

window.onload = function () {
  addListenersToServices();

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
      })
      .catch((e) => Alert.add(e, "error"));
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
      .catch((e) => {
        Alert.add(`${e}`, "error");
        document.querySelector("button#d1-action-clear")?.click();
      });
  });
};
