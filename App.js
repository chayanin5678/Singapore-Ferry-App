import React, { useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, StatusBar, StyleSheet, View } from 'react-native';
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
  const [loading, setLoading] = useState(true);
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
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        injectedJavaScriptBeforeContentLoaded={SAFE_VIEWPORT_CSS}
      />
      {loading && <Loading />}
    </View>
  );
}

function Loading() {
  return <View style={styles.loading}><ActivityIndicator size="large" color="#F3AF35" /></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#075B83',
  },
});
