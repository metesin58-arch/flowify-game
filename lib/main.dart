import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_android/webview_flutter_android.dart';
import 'package:webview_flutter_wkwebview/webview_flutter_wkwebview.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:in_app_purchase/in_app_purchase.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  MobileAds.instance.initialize();
  
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(const MaterialApp(
    debugShowCheckedModeBanner: false,
    home: WebViewShell(),
  ));
}

class WebViewShell extends StatefulWidget {
  const WebViewShell({super.key});

  @override
  State<WebViewShell> createState() => _WebViewShellState();
}

class _WebViewShellState extends State<WebViewShell> {
  late final WebViewController _controller;
  final InAppPurchase _inAppPurchase = InAppPurchase.instance;
  late StreamSubscription<List<PurchaseDetails>> _subscription;
  
  // AdMob units
  InterstitialAd? _interstitialAd;
  RewardedAd? _rewardedAd;

  @override
  void initState() {
    super.initState();

    final Stream<List<PurchaseDetails>> purchaseUpdated = _inAppPurchase.purchaseStream;
    _subscription = purchaseUpdated.listen((List<PurchaseDetails> purchaseDetailsList) {
      _listenToPurchaseUpdated(purchaseDetailsList);
    }, onDone: () {
      _subscription.cancel();
    }, onError: (Object error) {
      // handle error here.
    });

    const String gameUrl = 'https://flowify2026.netlify.app/';

    late final PlatformWebViewControllerCreationParams params;
    if (WebViewPlatform.instance is WebKitWebViewPlatform) {
      params = WebKitWebViewControllerCreationParams(
        allowsInlineMediaPlayback: true,
      );
    } else {
      params = const PlatformWebViewControllerCreationParams();
    }

    _controller = WebViewController.fromPlatformCreationParams(params);

    _controller
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0x00000000))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageFinished: (url) {
            _controller.runJavaScript('''
              window.Capacitor = {
                isNativePlatform: () => true,
                getPlatform: () => '${Platform.isIOS ? "ios" : "android"}'
              };
              // Bridge Aliases
              window.PurchaseChannel = window.FlutterBridge;
              window.FlutterPay = window.FlutterBridge;
              
              // Mock AdMob calls
              window.adMobBridge = {
                showInterstitial: () => window.FlutterBridge.postMessage(JSON.stringify({type: 'showInterstitial'})),
                showRewarded: () => window.FlutterBridge.postMessage(JSON.stringify({type: 'showRewarded'}))
              };
              // Note: The web services need to be aware of this or we can try to override them if they are global
            ''');
          },
          onWebResourceError: (WebResourceError error) {
            debugPrint('WebView Error: ${error.description}');
          },
        ),
      )
      ..addJavaScriptChannel(
        'FlutterBridge',
        onMessageReceived: (JavaScriptMessage message) {
          _handleMessage(message.message);
        },
      )
      ..loadRequest(Uri.parse(gameUrl));

    _loadAds();
  }

  void _loadAds() {
    InterstitialAd.load(
      adUnitId: 'ca-app-pub-4965929442860631/7302035167',
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) => _interstitialAd = ad,
        onAdFailedToLoad: (err) => _interstitialAd = null,
      ),
    );

    RewardedAd.load(
      adUnitId: 'ca-app-pub-4965929442860631/4632813259',
      request: const AdRequest(),
      rewardedAdLoadCallback: RewardedAdLoadCallback(
        onAdLoaded: (ad) => _rewardedAd = ad,
        onAdFailedToLoad: (err) => _rewardedAd = null,
      ),
    );
  }

  void _handleMessage(String message) async {
    final Map<String, dynamic> data = jsonDecode(message);
    final String type = data['type'];

    switch (type) {
      case 'purchase':
        _buyProduct(data['productId']);
        break;
      case 'showInterstitial':
        if (_interstitialAd != null) {
          _interstitialAd!.show();
          _loadAds(); // Reload
        }
        break;
      case 'showRewarded':
        if (_rewardedAd != null) {
          _rewardedAd!.show(onUserEarnedReward: (ad, reward) {
            _controller.runJavaScript('window.odulVer("rewarded_ad")');
          });
          _loadAds(); // Reload
        }
        break;
    }
  }

  Future<void> _buyProduct(String productId) async {
    final bool available = await _inAppPurchase.isAvailable();
    if (!available) return;

    const Set<String> _kIds = <String>{
      'gold_mini', 'gold_100', 'gold_bag', 'gold_500', 'gold_vault',
      'energy_coffee', 'energy_refill', 'energy_bulk', 'vip_sub', 'verified_tick'
    };
    final ProductDetailsResponse response = await _inAppPurchase.queryProductDetails(_kIds);
    
    for (var product in response.productDetails) {
      if (product.id == productId) {
        final PurchaseParam purchaseParam = PurchaseParam(productDetails: product);
        if (productId == 'vip_sub' || productId == 'verified_tick') {
          _inAppPurchase.buyNonConsumable(purchaseParam: purchaseParam);
        } else {
          _inAppPurchase.buyConsumable(purchaseParam: purchaseParam);
        }
        return;
      }
    }
  }

  void _listenToPurchaseUpdated(List<PurchaseDetails> purchaseDetailsList) {
    purchaseDetailsList.forEach((PurchaseDetails purchaseDetails) async {
      if (purchaseDetails.status == PurchaseStatus.pending) {
        // show pending UI
      } else {
        if (purchaseDetails.status == PurchaseStatus.error) {
          // handle error
        } else if (purchaseDetails.status == PurchaseStatus.purchased ||
                   purchaseDetails.status == PurchaseStatus.restored) {
          // Deliver reward
          _controller.runJavaScript('window.odulVer("${purchaseDetails.productID}")');
        }
        if (purchaseDetails.pendingCompletePurchase) {
          await _inAppPurchase.completePurchase(purchaseDetails);
        }
      }
    });
  }

  @override
  void dispose() {
    _subscription.cancel();
    _interstitialAd?.dispose();
    _rewardedAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        top: false,
        bottom: false,
        child: WebViewWidget(controller: _controller),
      ),
    );
  }
}
