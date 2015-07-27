# Scroll Forever
infinitie scroll with masonry

### Dependencies
* [jQuery](https://github.com/jquery/jquery) (1.9 or above)

### Default variable
```javascript
...
var pluginName = "scrollForever",
    dataKey = "plugin_" + pluginName,
    defaults = {
      offest: 0,
      delay: 500,
      appendElement: undefined,
      selectContent: undefined,
      navSelector: ".scroll-forever-pagination",
      navNextSelector: ".scroll-forever-pagination a:last",
      elemLoad: ".scroll-forever-message",
      round: {
        active: false,
        count: 0,
        message: "load more",
      },
      loading: {
        message: "loading...",
      },
      ending: {
        isShow: true,
        message: "data is null...",
      }
    };
...
```

### Usage
index.html
```html
...
<div id="masonry">
	<div class="content__box">
		<div class="content_main--item">...</div>
	</div>
	<nav class="scroll-forever-pagination" style="display:none;"><a href="example.html"></a></nav>
	<div class="scroll-forever-message"></div>
</div>

$(function(){
	var msnry = $('#masonry');

	msnry.scrollForever({...}, function(err, newElements) {
		var $newElems = $(newElements);
		msnry.imagesLoaded(function() {
			msnry.masonry('appended', $newElems);
			msnry.masonry('reloadItems')
		})
	});
});
...
```

example.html
```html
<div id="masonry">
	<div class="content__box">
		<div class="content_main--item">...</div>
	</div>
	<nav class="scroll-forever-pagination" style="display:none;"><a href="...."></a></nav>
</div>
```