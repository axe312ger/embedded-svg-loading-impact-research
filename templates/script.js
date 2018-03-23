document.querySelectorAll('img').forEach(function (img) {
  if (!img.complete) {
    img.classList.add('not-cached')
    img.addEventListener('load', function (e) {
      e.target.classList.add('fade-in')
    })
  } else {
    img.classList.add('cached')
  }
})
