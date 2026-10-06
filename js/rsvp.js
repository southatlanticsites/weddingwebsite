(function () {
  var FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScbZDyGm5ZyObrt1kZd4cV2kdrHpfZiBTtFlRT6YedJyWStnw/formResponse";
  var YES = "Yes,  I'll be there";
  var JUST_ME = "Just me!";
  var PLUS_ONE = "Me, plus one!";
  var CHILDREN = "Me, plus one, and children";

  var form = document.getElementById("rsvp-form");
  if (!form) return;
  var errorEl = document.getElementById("rsvp-error");
  var submitBtn = document.getElementById("rsvp-submit");

  function checked(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : "";
  }

  function show(key, on) {
    form.querySelectorAll('[data-show="' + key + '"]').forEach(function (el) { el.hidden = !on; });
  }

  function update() {
    var attending = checked("entry.877086558") === YES;
    var guests = checked("entry.1498135098");
    show("attending", attending);
    show("plusone", attending && (guests === PLUS_ONE || guests === CHILDREN));
    show("plusone-only", guests === PLUS_ONE);
    show("children", attending && guests === CHILDREN);
  }

  function visible(el) { return !el.closest("[hidden]"); }

  form.addEventListener("change", update);
  update();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorEl.textContent = "";

    var missing = Array.prototype.filter.call(form.querySelectorAll("[required]"), function (el) {
      if (!visible(el)) return false;
      if (el.type === "radio") return !form.querySelector('input[name="' + el.name + '"]:checked');
      return !el.value.trim() || !el.checkValidity();
    });
    if (missing.length) {
      errorEl.textContent = "Please fill in the highlighted questions.";
      form.querySelectorAll(".form-row.invalid").forEach(function (r) { r.classList.remove("invalid"); });
      missing.forEach(function (el) { var row = el.closest(".form-row"); if (row) row.classList.add("invalid"); });
      (missing[0].focus || function () {}).call(missing[0]);
      return;
    }

    var attending = checked("entry.877086558") === YES;
    var guests = checked("entry.1498135098");
    var data = new URLSearchParams();
    data.append("emailAddress", form.querySelector("#rsvp-email").value.trim());
    data.append("entry.1641428687", form.querySelector("#rsvp-name").value.trim());
    data.append("entry.877086558", checked("entry.877086558"));

    // Google Forms validates required questions against the sections the
    // respondent "visited", so pageHistory must mirror the form's branching.
    var pages = ["0"];
    if (attending) {
      pages.push("1");
      data.append("entry.1498135098", guests);
      var plusName = form.querySelector("#rsvp-plus-name").value.trim();
      var plusEmail = form.querySelector("#rsvp-plus-email").value.trim();
      if (guests === PLUS_ONE) {
        pages.push("2");
        data.append("entry.958832427", plusName);
        data.append("entry.1642573873", plusEmail);
      } else if (guests === CHILDREN) {
        pages.push("3");
        data.append("entry.544570400", plusName);
        data.append("entry.1499437095", plusEmail);
        data.append("entry.2101293691", form.querySelector("#rsvp-children").value.trim());
      }
      pages.push("4");
      data.append("entry.691938327", form.querySelector("#rsvp-diet").value.trim());
    }
    data.append("pageHistory", pages.join(","));

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    // Google doesn't send CORS headers, so the response is opaque; a network
    // failure is the only error we can detect.
    fetch(FORM_URL, { method: "POST", mode: "no-cors", body: data })
      .then(function () {
        form.hidden = true;
        document.getElementById("rsvp-thanks-note").textContent = attending
          ? "We've received your RSVP and can't wait to celebrate with you."
          : "We've received your RSVP. We'll miss you!";
        document.getElementById("rsvp-thanks").hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(function () {
        errorEl.textContent = "Something went wrong sending your RSVP. Please check your connection and try again.";
        submitBtn.disabled = false;
        submitBtn.textContent = "Send RSVP";
      });
  });
})();
