/**
 * Event Listener waits for DOM to load before running any js code
 */
document.addEventListener("DOMContentLoaded", () => {
  // # SELECTED ELEMENTS ---   ---   ---

  // form element
  const FORM = document.querySelector("form");
  // job role elements
  const OTHER_JOB_ROLE = document.querySelector("#other-job-role");
  const JOB_ROLE_SELECT_OPTION = document.querySelector("#title");
  // t-shirt elements
  const COLOR_SELECT = document.querySelector("#color");
  const DESIGN_SELECT = document.querySelector("#design");
  // activities elements
  const ACTIVITIES_FIELDSET = document.querySelector("#activities");
  const ACTIVITIES_COST_P = document.querySelector("#activities-cost");
  let activities_total_cost = 0;
  // payment elements
  const PAYMENT_METHOD_FIELDSET = document.querySelector(".payment-methods");
  const PAYMENT_SELECT = document.getElementById("payment");
  const CREDIT_CARD_DIV = document.querySelector("#credit-card");
  const PAYPAL_DIV = document.querySelector("#paypal");
  const BITCOIN_DIV = document.querySelector("#bitcoin");
  // all input elements
  const ALL_INPUTS = document.querySelectorAll("input");
  // all checkbox input elements
  const ACTIVITIES_INPUTS = ACTIVITIES_FIELDSET.querySelectorAll(
    'input[type="checkbox"]'
  );

  // # DEFAULTS ACTIONS ON DOM LOAD ---   ---   ---

  document.querySelector('input[type = "text"]').focus(); // sets focus to first input when page loads
  OTHER_JOB_ROLE.style.display = "none"; // hides the "other" input field in job role section
  COLOR_SELECT.disabled = true; // disables the color selection in the t-shirt field

  // setting payment to credit card by default
  PAYMENT_SELECT.value = "credit-card";
  PAYPAL_DIV.style.display = "none";
  BITCOIN_DIV.style.display = "none";

  // # EVENT LISTENERS ---   ---   ---

  /**
   * Listens for job role "other" to be selected and displays the other text input box otherwise it is hidden.
   */
  JOB_ROLE_SELECT_OPTION.addEventListener("change", (e) => {
    if (e.target.value === "other") {
      OTHER_JOB_ROLE.style.display = "";
    } else {
      OTHER_JOB_ROLE.style.display = "none";
    }
  });

  /**
   * Listens for t-shirt design to be selected before allowing the disabled color selector to be enabled.
   */
  DESIGN_SELECT.addEventListener("change", (e) => {
    let design = e.target.value;
    if (design !== "Select Theme") {
      COLOR_SELECT.disabled = false;
      let color_options = COLOR_SELECT.options;
      for (let i = 1; i < color_options.length; i++) {
        if (color_options[i].getAttribute("data-theme") !== design) {
          color_options[i].style.display = "none";
        } else {
          color_options[i].style.display = "";
        }
      }
    }
  });

  /**
   * Listens for the activities field changes disabling conflicting activities and calculates total prices of registered activities.
   */
  ACTIVITIES_FIELDSET.addEventListener("change", (e) => {
    /**
     * conflictingActivities()
     * Function takes an activity input element and action (enable|diable) and disables any conflicting activities based on time and day.
     * @param {element} activity
     * @param {string} action
     */
    function conflictingActivities(activity, action) {
      let name = activity.getAttribute("name");
      let dayAndTime = activity.getAttribute("data-day-and-time");
      let checkboxesArray = ACTIVITIES_FIELDSET.querySelectorAll(
        'input[type = "checkbox"]'
      );
      for (let checkboxInput of checkboxesArray) {
        if (
          name !== checkboxInput.getAttribute("name") &&
          dayAndTime === checkboxInput.getAttribute("data-day-and-time")
        ) {
          if (action === "disable") {
            checkboxInput.disabled = true;
            checkboxInput.parentElement.classList.add("disabled");
          } else if (action === "enable") {
            checkboxInput.disabled = false;
            checkboxInput.parentElement.classList.remove("disabled");
          }
        }
      }
    }
    if (e.target.checked) {
      activities_total_cost += parseInt(e.target.getAttribute("data-cost")); // add to total price
      conflictingActivities(e.target, "disable"); // disables any conflicting times
    } else {
      activities_total_cost -= parseInt(e.target.getAttribute("data-cost")); // subtract from total price
      conflictingActivities(e.target, "enable"); // enables any unconflicting times
    }
    ACTIVITIES_COST_P.innerHTML = `Total: $${activities_total_cost}`;
  });

  /**
   * Listenes for changes in payment method displaying elements related to payment method selected
   */
  PAYMENT_METHOD_FIELDSET.addEventListener("change", (e) => {
    if (e.target === PAYMENT_SELECT) {
      CREDIT_CARD_DIV.style.display = "none";
      PAYPAL_DIV.style.display = "none";
      BITCOIN_DIV.style.display = "none";
      switch (e.target.value) {
        case "credit-card":
          CREDIT_CARD_DIV.style.display = "";
          break;
        case "paypal":
          PAYPAL_DIV.style.display = "";
          break;
        case "bitcoin":
          BITCOIN_DIV.style.display = "";
          break;
        default:
          break;
      }
    }
  });

  // # FORM VALIDATION ---   ---   ---

  /**
   * invalid()
   * Invalid form helper function takes in the invalid input element and sets its class to .not-valid
   * Displays the an error message hint and returns false.
   * @param {element} input_element
   * @returns
   */
  function invalid(input_element) {
    input_element.parentElement.classList.add("not-valid");
    input_element.parentElement.classList.remove("valid");
    input_element.parentElement.lastElementChild.style.display = "block"; // show error hint
    return false;
  }
  /**
   * valid()
   * Valid form helper function takes in a valid input element and sets its class to .valid
   * Hides error message hint and returns true.
   * @param {element} input_element
   * @returns
   */
  function valid(input_element) {
    input_element.parentElement.classList.add("valid");
    input_element.parentElement.classList.remove("not-valid");
    input_element.parentElement.lastElementChild.style.display = "none"; // hide error hint
    return true;
  }
  /**
   * isNameValid()
   * Checks if name input is blank or empty
   * @returns {boolean} true if not blank or empty
   */
  function isNameValid() {
    const NAME_INPUT = document.getElementById("name");
    NAME_INPUT.value = NAME_INPUT.value.trim();
    if (NAME_INPUT.value === "") return invalid(NAME_INPUT);
    return valid(NAME_INPUT);
  }

  /**
   * isEmailValid()
   * Checks if email has one or more characters followed by an @ symbol
   * followed by one or more characters followed by a .com .net or .org
   * @returns {boolean} true if in valid email format
   */
  function isEmailValid() {
    const EMAIL_INPUT = document.getElementById("email");
    EMAIL_INPUT.value = EMAIL_INPUT.value.trim();
    if (EMAIL_INPUT.value === "") {
      EMAIL_INPUT.parentElement.lastElementChild.innerHTML =
        "Email address cannot be blank";
      return invalid(EMAIL_INPUT);
    } else {
      const email_regEx = /^[^@]+@[^@]+\.(com|net|org)$/;
      if (email_regEx.test(EMAIL_INPUT.value)) return valid(EMAIL_INPUT);
      EMAIL_INPUT.parentElement.lastElementChild.innerHTML =
        "Email address must be formatted correctly";
      return invalid(EMAIL_INPUT);
    }
  }

  /**
   * isActivitesValid()
   * Checks if at least one activity is marked checked to be valid.
   * @returns {boolean} true if at least one activity is checked
   */
  function isActivitesValid() {
    const ACTIVITIES_INPUT_COLLECTION = ACTIVITIES_FIELDSET.querySelectorAll([
      'input[type="checkbox"]',
    ]);
    for (const i in ACTIVITIES_INPUT_COLLECTION) {
      if (ACTIVITIES_INPUT_COLLECTION[i].checked)
        return valid(ACTIVITIES_FIELDSET.firstElementChild);
    }
    return invalid(ACTIVITIES_FIELDSET.firstElementChild);
  }

  /**
   * isPaymentValid()
   * Checks if the payement method choosen is not credit card then payment is valid.
   * Else if payment choosen is by credit card the follwing must be true:
   *  1. Credit card number must be between 13-16 digits no dashes
   *  2. Zip code must be 5 digits
   *  3. CVV must be 3 digits
   *  4. Expiration date must be selected
   *  5. Expiration year must be selected
   * @returns {boolean} true if paypal|bitcoin or if credit card valid
   */
  function isPaymentValid() {
    if (PAYMENT_SELECT.value === "credit-card") {
      let isTrue = true;
      const CREDIT_CARD_NUMBER_INPUT = document.getElementById("cc-num");
      if (/^\d{13,16}$/.test(CREDIT_CARD_NUMBER_INPUT.value)) {
        valid(CREDIT_CARD_NUMBER_INPUT);
      } else {
        isTrue = invalid(CREDIT_CARD_NUMBER_INPUT);
      }

      const CREDIT_CARD_ZIPCODE_INPUT = document.getElementById("zip");
      if (/^\d{5}$/.test(CREDIT_CARD_ZIPCODE_INPUT.value)) {
        valid(CREDIT_CARD_ZIPCODE_INPUT);
      } else {
        isTrue = invalid(CREDIT_CARD_ZIPCODE_INPUT);
      }

      const CREDIT_CARD_CVV_INPUT = document.getElementById("cvv");
      if (/^\d{3}$/.test(CREDIT_CARD_CVV_INPUT.value)) {
        valid(CREDIT_CARD_CVV_INPUT);
      } else {
        isTrue = invalid(CREDIT_CARD_CVV_INPUT);
      }

      const CREDIT_CARD_EXP_MONTH_INPUT = document.getElementById("exp-month");
      if (CREDIT_CARD_EXP_MONTH_INPUT.value === "Select Date") {
        CREDIT_CARD_EXP_MONTH_INPUT.parentElement.classList.add("not-valid");
        CREDIT_CARD_EXP_MONTH_INPUT.parentElement.classList.remove("valid");
        isTrue = invalid(CREDIT_CARD_EXP_MONTH_INPUT);
      } else {
        CREDIT_CARD_EXP_MONTH_INPUT.parentElement.classList.add("valid");
        CREDIT_CARD_EXP_MONTH_INPUT.parentElement.classList.remove("not-valid");
      }

      const CREDIT_CARD_EXP_YEAR = document.getElementById("exp-year");
      if (CREDIT_CARD_EXP_YEAR.value === "Select Year") {
        CREDIT_CARD_EXP_YEAR.parentElement.classList.add("not-valid");
        CREDIT_CARD_EXP_YEAR.parentElement.classList.remove("valid");
        isTrue = invalid(CREDIT_CARD_EXP_YEAR);
      } else {
        CREDIT_CARD_EXP_YEAR.parentElement.classList.add("valid");
        CREDIT_CARD_EXP_YEAR.parentElement.classList.remove("not-valid");
      }

      return isTrue;
    }
    return true;
  }

  /**
   * Listens for form submission and validates form inputs
   */
  FORM.addEventListener("submit", (e) => {
    if (!isNameValid()) e.preventDefault();
    if (!isEmailValid()) e.preventDefault();
    if (!isActivitesValid()) e.preventDefault();
    if (!isPaymentValid()) e.preventDefault();
  });
  // end form validation

  /**
   * Listens for checkbox input activities adding focus & blur classes
   */
  ACTIVITIES_INPUTS.forEach((input) => {
    input.addEventListener("focus", (e) => {
      e.target.parentElement.className = "focus";
    });
  });
  ACTIVITIES_INPUTS.forEach((input) => {
    input.addEventListener("blur", (e) => {
      e.target.parentElement.className = "";
    });
  });

  /**
   * Listens for blur event on the username and email inputs adding real-time error messages
   */
  for (let input of ALL_INPUTS) {
    input.addEventListener("blur", (e) => {
      switch (input.getAttribute("name")) {
        case "user-name":
          isNameValid();
          break;
        case "user-email":
          isEmailValid();
          break;
        default:
          break;
      }
    });
  }
}); // end DOMContentLoaded eventListener
