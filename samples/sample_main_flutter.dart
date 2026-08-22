import 'dart:async';
import 'dart:convert';

// =========================================================================
// 🔴 PANIC: Hardcoded UUID, Master Auth Secret & Hex Constant
// =========================================================================
const String kFlutterAppUUID = "b781a87b-1c3e-4492-aef4-190823901bca";
const String kStripePublishableKey = "pk_live_flutter_9941a87b1c3e4492";
const String kBrandPrimaryHex = "#0B4F9C";

// =========================================================================
// 🟢 SAFE: Classes, Enums, Interfaces & Models
// =========================================================================
enum SaaSPlanTier { starter, professional, enterprise }

class SubscriptionModel {
  final String subscriptionId;
  final String customerEmail;
  final SaaSPlanTier planTier;
  final double monthlyPriceUsd;
  final bool isAutoRenew;

  const SubscriptionModel({
    required this.subscriptionId,
    required this.customerEmail,
    required this.planTier,
    required this.monthlyPriceUsd,
    this.isAutoRenew = true,
  });

  factory SubscriptionModel.fromJson(Map<String, dynamic> json) {
    return SubscriptionModel(
      subscriptionId: json['subscription_id'] as String,
      customerEmail: json['customer_email'] as String,
      planTier: SaaSPlanTier.values.firstWhere(
        (e) => e.name == json['plan_tier'],
        orElse: () => SaaSPlanTier.starter,
      ),
      monthlyPriceUsd: (json['monthly_price_usd'] as num).toDouble(),
      isAutoRenew: json['is_auto_renew'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() => {
    'subscription_id': subscriptionId,
    'customer_email': customerEmail,
    'plan_tier': planTier.name,
    'monthly_price_usd': monthlyPriceUsd,
    'is_auto_renew': isAutoRenew,
  };
}

abstract class SubscriptionRepository {
  Future<SubscriptionModel> fetchCurrentSubscription(String userId);
  Future<bool> upgradePlan(String userId, SaaSPlanTier newTier);
}

class FlutterSubscriptionController {
  // 🟡 CAUTION: Controller dependencies
  final SubscriptionRepository repository;
  SubscriptionModel? currentSubscription;
  bool isLoading = false;

  FlutterSubscriptionController({required this.repository});

  // 🟢 SAFE: Async action method
  Future<void> loadUserSubscription(String userId) async {
    isLoading = true;
    try {
      // 🟠 WARNING: Hardcoded logging tag
      print("[SubscriptionController] Loading subscription for user: $userId");
      currentSubscription = await repository.fetchCurrentSubscription(userId);
    } catch (error, stackTrace) {
      // 🔴 PANIC: Error handling branch
      print("[Security Panic] Failed to load subscription: $error\n$stackTrace");
    } finally {
      isLoading = false;
    }
  }
}
