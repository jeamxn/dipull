self.addEventListener("push", function (event) {
  console.log("Push received: ", event);
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/public/icon.png",
    badge: "/public/icon.png"
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});