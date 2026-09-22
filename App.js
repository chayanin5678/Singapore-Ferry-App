import React, { useRef, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const FERRY_URL = 'https://singaporeferry.com/';
const SAFE_VIEWPORT_CSS = `
  (function () {
    var viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && !viewport.content.includes('viewport-fit=cover')) {
      viewport.content += ', viewport-fit=cover';
    }
    document.documentElement.style.paddingTop = 'env(safe-area-inset-top)';
    document.documentElement.style.paddingBottom = 'env(safe-area-inset-bottom)';
  })();
  true;
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
        injectedJavaScriptBeforeContentLoaded={SAFE_VIEWPORT_CSS}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
});
