$(document).ready(function () {
  $('.open-modal').each(function (i, btn) {
    $(btn).on('click', function (e) {
      $(e.target).parents('.card').find('.modal').addClass('active')
    })
  })
  $('.close-modal').each(function (i, btn) {
    $(btn).on('click', function (e) {
      $(e.target).parents('.card').find('.modal').removeClass('active')
    })
  })
  $('.toggle-images').on('click', function (e) {
    $('body').toggleClass('hide-images')
  })
})
