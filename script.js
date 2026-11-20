document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("tripSearch");
  const searchInput = document.getElementById("destinationSearch");
  const dateInput = document.getElementById("travelDate");
  const travelersInput = document.getElementById("travellers");
  const destinationItems = [...document.querySelectorAll(".destination-item")];
  const emptyDestinations = document.getElementById("emptyDestinations");
  const searchToastElement = document.getElementById("searchToast");
  const searchToast = bootstrap.Toast.getOrCreateInstance(searchToastElement);
  const bookingModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("bookingModal"));
  const authModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("authModal"));

  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = localToday;
  document.getElementById("bookingDate").min = localToday;
  document.getElementById("currentYear").textContent = today.getFullYear();

  function filterDestinations(query) {
    const term = query.trim().toLocaleLowerCase();
    let visibleCount = 0;
    destinationItems.forEach((item) => {
      const matches = !term || item.dataset.destination.includes(term);
      item.classList.toggle("d-none", !matches);
      if (matches) visibleCount += 1;
    });
    emptyDestinations.classList.toggle("d-none", visibleCount > 0);
    return visibleCount;
  }

  searchInput.addEventListener("input", () => filterDestinations(searchInput.value));

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const count = filterDestinations(searchInput.value);
    const destinationSection = document.getElementById("destinations");
    if (count === 0) {
      document.getElementById("searchToastMessage").textContent = "We couldn't find that place yet. Try Goa, Manali, Kashmir, Kerala, Jaipur or Ladakh.";
      searchToast.show();
      destinationSection.scrollIntoView({ behavior: "smooth" });
      return;
    }

    destinationSection.scrollIntoView({ behavior: "smooth" });
    if (searchInput.value.trim()) {
      const firstMatch = destinationItems.find((item) => !item.classList.contains("d-none"));
      if (firstMatch) {
        firstMatch.classList.remove("search-highlight");
        requestAnimationFrame(() => firstMatch.classList.add("search-highlight"));
      }
    }
  });

  document.querySelectorAll("[data-book]").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById("bookingTripName").textContent = button.dataset.book;
      document.getElementById("bookingFeedback").textContent = "";
      document.getElementById("bookingForm").reset();
      document.getElementById("bookingDate").min = localToday;
      if (dateInput.value) document.getElementById("bookingDate").value = dateInput.value;
      if (travelersInput.value === "5") {
        document.getElementById("bookingTravelers").value = "5+ travelers";
      } else {
        document.getElementById("bookingTravelers").value = `${travelersInput.value} traveler${travelersInput.value === "1" ? "" : "s"}`;
      }
      bookingModal.show();
    });
  });

  document.getElementById("bookingForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    document.getElementById("bookingFeedback").textContent = "Thanks! Your trip request is ready. This demo doesn't send personal details to a server.";
    form.querySelector('button[type="submit"]').textContent = "Request received";
  });

  document.querySelectorAll("[data-auth]").forEach((button) => {
    button.addEventListener("click", () => {
      const isSignup = button.dataset.auth === "signup";
      document.getElementById("authModalTitle").textContent = isSignup ? "Your next trip starts here." : "Good to have you.";
      document.getElementById("authIntro").textContent = isSignup
        ? "Create an account to save the places you can't stop thinking about."
        : "Log in to pick up where your next adventure begins.";
      document.getElementById("authSubmit").textContent = isSignup ? "Create account" : "Log in";
      document.getElementById("authPassword").autocomplete = isSignup ? "new-password" : "current-password";
      document.getElementById("authFeedback").textContent = "";
      document.getElementById("authForm").reset();
      authModal.show();
    });
  });

  document.getElementById("authForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    document.getElementById("authFeedback").textContent = "Thanks for trying Chalo Chale. Account access isn't connected in this demo.";
  });

  document.getElementById("newsletterForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = document.getElementById("newsletterEmail");
    const feedback = document.getElementById("newsletterFeedback");
    feedback.classList.remove("is-error", "is-success");

    if (!email.value.trim() || !email.validity.valid) {
      feedback.textContent = "Please enter a valid email address.";
      feedback.classList.add("is-error");
      email.focus();
      return;
    }

    feedback.textContent = "You're on the list! This demo doesn't send or store your email.";
    feedback.classList.add("is-success");
    form.reset();
  });

  document.querySelectorAll('#mainNav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      const nav = document.getElementById("mainNav");
      if (nav.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(nav).hide();
    });
  });
});
