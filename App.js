import React, { useRef, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

const FERRY_URL = 'https://www.singaporeferry.com/';
const BOOKINGS_URL = 'https://www.singaporeferry.com/mybooking';
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
    var viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no');
    }
    var style = document.getElementById('expo-webview-overrides');
    if (!style) {
      style = document.createElement('style');
      style.id = 'expo-webview-overrides';
      document.head.appendChild(style);
    }
    style.textContent = 'input, select, textarea, .form-control, .choices__inner { font-size: 16px !important; -webkit-text-size-adjust: 100% !important; }';
    true;
  })();
`;

export default function App() {
  const webView = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

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
        source={{ uri: activeTab === 'home' ? FERRY_URL : BOOKINGS_URL }}
        onNavigationStateChange={(state) => {
          setCanGoBack(state.canGoBack);
          try {
            const path = new URL(state.url).pathname;
            if (path === '/') setActiveTab('home');
            if (path.startsWith('/mybooking')) setActiveTab('bookings');
          } catch {
            // Ignore non-web URLs handled by the WebView.
          }
        }}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        contentInsetAdjustmentBehavior="automatic"
        scalesPageToFit={false}
        injectedJavaScriptBeforeContentLoaded={DISABLE_ZOOM}
        injectedJavaScript={HIDE_SITE_BRANDING}
      />
      <View style={styles.tabBar}>
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.tab}
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.tabIcon, activeTab === 'home' && styles.tabActive]}>⌂</Text>
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.tab}
          onPress={() => setActiveTab('bookings')}
        >
          <View style={[styles.ticketIcon, activeTab === 'bookings' && styles.ticketIconActive]}>
            <View style={styles.ticketNotchLeft} />
            <View style={[styles.ticketStripe, activeTab === 'bookings' && styles.ticketStripeActive]} />
            <View style={styles.ticketNotchRight} />
          </View>
          <Text style={[styles.tabLabel, activeTab === 'bookings' && styles.tabActive]}>My Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  tabBar: {
    height: 68,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E7ECEE',
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabIcon: { color: '#91A0A5', fontSize: 22, lineHeight: 24 },
  tabLabel: { color: '#91A0A5', fontSize: 11, fontWeight: '600' },
  tabActive: { color: '#1676D2' },
  ticketIcon: {
    width: 27,
    height: 19,
    borderWidth: 2,
    borderColor: '#91A0A5',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketIconActive: { borderColor: '#1676D2' },
  ticketStripe: { height: 12, borderLeftWidth: 1.5, borderStyle: 'dashed', borderColor: '#91A0A5' },
  ticketStripeActive: { borderColor: '#1676D2' },
  ticketNotchLeft: { position: 'absolute', left: -4, width: 7, height: 7, borderRadius: 4, backgroundColor: '#FFFFFF' },
  ticketNotchRight: { position: 'absolute', right: -4, width: 7, height: 7, borderRadius: 4, backgroundColor: '#FFFFFF' },
});
