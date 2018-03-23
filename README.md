# SVG image preview research
## with fancy loading animation idea

## What to research:

### aspects

#### input images
comic/vector painting image, portrait, landscape, painting, building, architecture pattern, black & white, animal,

#### modes
0=combo 1=triangle 2=rect 3=ellipse 4=circle 5=rotatedrect 6=beziers 7=rotatedellipse 8=polygon (default 1)

#### shapes
10 - 25 - 50 - 100

animation extra payload test

### files

* overview page
* per mode animated or not
* per image animated or not

generate markdown table afterwars out of stats

### stats

#### images
 * name
 * animated or not
 * original size
 * primitive output size
 * svgo size
 * gzip size
 * brotly size

#### files
 * gzip size
 * brotly size

## Basic implementation
Embeds previews as background image into wrapping div, ensures correct aspect ratio while image is not loaded via padding trick (https://css-tricks.com/aspect-ratio-boxes/)

```html
<div class="image-wrapper" style="background-image: url(...);">
  <img class="image" src="..." />
</div>
```

```css
.image-wrapper {
  position: relative;
  background-repeat: no-repeat;
  background-size: contain;
}

.image-wrapper::before {
  display: block;
  content: "";
  padding-top: 50%;
}

.image {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  z-index: 1;
}
```

## Fade in uncached images

A fade in animation as soon the image is loaded enhances the visual appeariance a lot. But we want to avoid to trigger the animation for images which on subsequent page loads.

With a few lines of blocking js at the end of the body tag, this is possible:

```js
document.querySelectorAll('img').forEach(function (img) {
  if (!img.complete) {
    img.classList.add('not-cached')
    img.addEventListener('load', function (e) {
      e.target.classList.add('fade-in')
    })
  }
})
```

```css
@keyframes fade-in{
  from {opacity: 0}
  to {opacity: 1}
}

img.not-cached {
  opacity: 0;
}

img.fade-in {
  animation: fade-in 1s forwards;
}
```
