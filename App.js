import React, { useRef, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const FERRY_URL = 'https://singaporeferry.com/';

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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
});
