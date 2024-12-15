// {title} — Текст: электронный // {domen}: [сайт]. — URL: {url} (дата обращения: {date}).

const MASK = {
  RU: "%title% — Текст: электронный // %domain%: [сайт]. — URL: %url% (дата обращения: %date%).",
  EN: "%title%. Available at: %url% (accessed %date%).",
};

async function fetchPageTitle(url) {
  try {
    const response = await fetch(url, {mode: "cors"});
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const title = doc.querySelector("title");
    return title ? title.textContent : "Title not found";
  } catch (error) {
    console.error("Error fetching page title:", error);
    return "ERROR FETCHING TITLE";
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

function replace(mask, str) {
  return str.replace(/%([^%]+)%/g, (match, key) => {
    return key in mask ? mask[key] : match;
  });
}

const formatDateRU = () => {
  const date = new Date(); // Текущая дата
  const day = String(date.getDate()).padStart(2, "0"); // Добавляем ведущий ноль
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяц (0-11, поэтому +1)
  const year = date.getFullYear(); // Год
  return `${day}.${month}.${year}`;
};

function formatDateEN() {
  const date = new Date(); // Текущая дата
  const day = date.getDate(); // День месяца (1–31)
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()]; // Название месяца
  const year = date.getFullYear(); // Год
  return `${day} ${month} ${year}`;
}

function getMask(parsedUrl) {
  let mask = {
    selectedMask: document.querySelector("#lang-en").checked
      ? MASK.EN
      : MASK.RU,
    url: parsedUrl.href,
    domain: parsedUrl.hostname,
    date: document.querySelector("#lang-en").checked
      ? formatDateEN()
      : formatDateRU(),
  };
  return mask;
}

function makeGostLink(parsedUrl, callback) {
  let mask = getMask(parsedUrl);
  if (!!mask.url) {
    fetchPageTitle(mask.url).then((title) => {
      mask.title = title.trim();
      let result = replace(mask, mask.selectedMask);
      callback(result);
    });
  }
}

async function makeGostLinkAsync(parsedUrl) {
  let mask = getMask(parsedUrl);
  if (!!mask.url) {
    let title = await fetchPageTitle(mask.url);
    mask.title = title.trim();
    let result = replace(mask, mask.selectedMask);
    return result;
  }
}

window.onload = function () {
  document.querySelector("button#d0-action").addEventListener("click", () => {
    let parsedUrl = new URL(document.querySelector("input#i-url").value.trim());
    makeGostLink(parsedUrl, copyToClipboard);
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
    // console.log(inputUrls);

    document.querySelector("ol#t-output").innerHTML = "";

    var outputUrls = [];

    inputUrls.forEach(async (plainUrl) => {
      let parsedUrl = new URL(plainUrl.trim());
      console.log(parsedUrl);
      makeGostLink(parsedUrl, (result) => {
        document.querySelector(
          "ol#t-output"
        ).innerHTML += `<li class='gost-link'>${result}</li>`;
      });
    });
  });
};
