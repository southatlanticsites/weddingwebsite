/* Mike & Julia — shared site script
   1) Password gate (client-side; hash stored, not the password itself)
   2) Mobile nav toggle
*/

(function () {
  // SHA-256 of the site password
  var PASS_HASH = "09f5936097a05b835d2225498a654f70e8f0861c44a572e386e8e77d24858581";
  var KEY = "mj_unlocked";

  function buildGate() {
    var gate = document.createElement("div");
    gate.id = "gate";
    gate.innerHTML =
      '<div class="gate-card">' +
      '  <svg class="gate-bloom" viewBox="0 0 120 120" aria-hidden="true"><use href="img/flowers.svg#dogwood"></use></svg>' +
      '  <div class="gate-monogram">M &amp; J</div>' +
      '  <p>Enter the password from your invitation</p>' +
      '  <input type="password" id="gate-input" autocomplete="off" aria-label="Site password" />' +
      '  <button id="gate-btn">Enter</button>' +
      '  <div class="gate-error" id="gate-error" aria-live="polite"></div>' +
      "</div>";
    document.body.appendChild(gate);
    document.body.classList.add("locked");

    var input = gate.querySelector("#gate-input");
    var err = gate.querySelector("#gate-error");

    function tryUnlock() {
      var value = input.value.trim().toLowerCase();
      hash(value).then(function (h) {
        if (h === PASS_HASH) {
          sessionStorage.setItem(KEY, "1");
          unlock();
        } else {
          err.textContent = "That's not quite it — check your invitation.";
          input.value = "";
          input.focus();
        }
      });
    }

    gate.querySelector("#gate-btn").addEventListener("click", tryUnlock);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") tryUnlock();
    });
    input.focus();
  }

  function unlock() {
    var gate = document.getElementById("gate");
    if (gate) gate.remove();
    document.body.classList.remove("locked");
  }

  function hash(str) {
    var data = new TextEncoder().encode(str);
    return crypto.subtle.digest("SHA-256", data).then(function (buf) {
      return Array.prototype.map
        .call(new Uint8Array(buf), function (b) {
          return b.toString(16).padStart(2, "0");
        })
        .join("");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (sessionStorage.getItem(KEY) !== "1") {
      buildGate();
    }

    // Mobile nav
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        links.classList.toggle("open");
        toggle.setAttribute(
          "aria-expanded",
          links.classList.contains("open") ? "true" : "false"
        );
      });
    }
  });
})();
