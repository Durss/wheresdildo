# Twitch overlay

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```


## <img src="https://obsproject.com/assets/images/new_icon_small-r.png" width="50" style="margin-top:40px"> OBS Configuration
Start OBS with these arguments to disable CORS security, enable remote debugging of webviews, allow camera access and automatically start the virtual camera :
```
"C:\Program Files\obs-studio\bin\64bit\obs64.exe" --remote-debugging-port=9222 --disable-web-security --enable-gpu --use-fake-ui-for-media-stream --startvirtualcam
```
To remote debug the webview just open this URL on a chromium based browser:

http://localhost:9222