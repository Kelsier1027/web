// 覆寫點擊通知後跳轉的事件，因為 firebasejs 本身會把不同 host 的網址擋掉,
// 所以必須在 import 前先加入 listener
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const url = event.notification.data.FCM_MSG.data.url ?? "";
    console.log(url);
    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (self.clients.openWindow) {
                console.log("open window")
                return self.clients.openWindow(url);
            }
        })
    )
}, false);

importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: '',
    authDomain: '',
    databaseURL: 'https://localhost',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '1:',
    measurementId: '',
})

const messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;
