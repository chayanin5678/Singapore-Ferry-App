import React, { useRef, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const FERRY_URL = 'https://singaporeferry.com/';
const DISABLE_ZOOM = `
  (function () {
    var viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    }
    document.documentElement.style.touchAction = 'pan-y';
    var style = document.createElement('style');
    style.textContent = 'input, select, textarea, .form-control, .choices__inner { font-size: 16px !important; }';
    (document.head || document.documentElement).appendChild(style);
    true;
  })();
`;
const HIDE_SITE_BRANDING = `
  (function () {
    var brand = document.querySelector('header .navbar-brand');
    if (brand) brand.style.visibility = 'hidden';
    true;
  })();
`;

export default function App() {
  const webView = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack) return false;
      webView.current.goBack();
      return true;
    });
    return () => subscription.remove();
  }, [canGoBack]);

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <WebView
        ref={webView}
        source={{ uri: FERRY_URL }}
        onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        contentInsetAdjustmentBehavior="automatic"
        scalesPageToFit={false}
        injectedJavaScriptBeforeContentLoaded={DISABLE_ZOOM}
        injectedJavaScript={HIDE_SITE_BRANDING}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
});
