
import React, { useRef } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

interface GameWebViewProps {
    onGameEnd: (score: number, productId?: string) => void;
    gameType: string;
}

export const GameWebView: React.FC<GameWebViewProps> = ({ onGameEnd, gameType }) => {
    const webViewRef = useRef<WebView>(null);

    const handleMessage = (event: WebViewMessageEvent) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'GAME_END') {
                onGameEnd(data.score);
            } else if (data.type === 'REWARD') {
                onGameEnd(0, data.productId);
            }
        } catch (e) {
            console.warn("Message parse error", e);
        }
    };

    // Bridge to simulate the original Capacitor behaviour
    const injectedJavaScript = `
    (function() {
      // 1. Set game type in storage for the HTML5 app to read
      localStorage.setItem('gameType', '${gameType}');
      
      // 2. Define bridge functions
      window.odulVer = function(productId) {
        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'REWARD', productId: productId}));
      };
      
      // 3. Listen for the native game completion signals used in the original games
      const origHandleGameEnd = window.handleGameEnd;
      window.handleGameEnd = function(score) {
        if (origHandleGameEnd) origHandleGameEnd(score);
        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'GAME_END', score: score}));
      };

      // Also override Capacitor-specific listeners if necessary
      document.addEventListener('game-finished', function(e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'GAME_END', score: e.detail.score}));
      });
      
      return true;
    })();
  `;

    return (
        <View style={styles.container}>
            <WebView
                ref={webViewRef}
                source={{ uri: 'https://meteart.com/flowify/index.html' }} // Point to a hosted version or local asset
                style={styles.webview}
                onMessage={handleMessage}
                injectedJavaScript={injectedJavaScript}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                renderLoading={() => <ActivityIndicator color="#1ed760" size="large" style={styles.loader} />}
                allowFileAccess={true}
                originWhitelist={['*']}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    webview: { flex: 1, backgroundColor: 'transparent' },
    loader: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' }
});
