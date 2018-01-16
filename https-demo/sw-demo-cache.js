self.addEventListener("install", function(event){
	event.waitUntil(
		caches.open("v1").then(function(cache){
			return cache.addAll([
					"service-worker.html",
					"sw-demo-cache.js",
					"images/timg.jpg"
				]);
		})
	);
});
// 捕获请求并返回缓存数据
self.addEventListener('fetch', function(event) {
	event.respondWith(caches.match(event.request).catch(function() {
		return fetch(event.request);
	}).then(function(response) {
		 if (response) {
          return response;
        }
        return response;
	}));
});