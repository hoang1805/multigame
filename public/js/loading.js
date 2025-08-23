$(document).ready(function () {
  window.showLoading = function() {
    const $loading = $("#global-loading");
    $loading.removeClass("hidden");
  };

  window.hideLoading = function() {
    const $loading = $("#global-loading");
    $loading.addClass("hidden");
  };
});
