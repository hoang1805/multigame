$(document).ready(function () {
  window.showPopup = function(title, message, onCancel = null) {
    const $popup = $("#popup");
    const $overlay = $('#global-overlay');
    $("#popup-title").text(title ?? "Title");
    $("#popup-message").text(message ?? "Message");
    $popup.removeClass("hidden");
    $overlay.removeClass("hidden");

    $("#popup .popup-close").off("click").on("click", function() {
      $popup.addClass("hidden");
      $overlay.addClass("hidden");
      if (onCancel && typeof onCancel == 'function') {
        onCancel();
      }
    });
  }
});
