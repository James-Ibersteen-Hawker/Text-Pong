"use strict";
window.onload = function grab() {
  fetch("demo.txt")
    .then((result) => {
      return result.text();
    })
    .then((data) => {
      data = data.split(":")[2];
      return fetch(data);
    })
    .then((result) => {
      return result.url;
    })
    .then((data) => console.log(data))
    .catch((error) => console.error("error"));
};
