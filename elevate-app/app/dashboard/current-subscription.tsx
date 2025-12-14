import { AlertCircle, Calendar, CheckCircle2, Clock, CreditCard, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sidebar from '../../components/dashboardItems/sidebar';
import Topbar from '../../components/dashboardItems/topbar';
import { useColors } from '../../components/theme-provider';
import { DotLoader } from '../../components/ui/dot-loader';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';
import { useAppSelector } from '../../store/hooks';

interface Subscription {
  id: number;
  user: number;
  domain: number;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  price_id: string;
  plan_interval: 'month' | 'year';
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  is_active: boolean;
}

interface Domain {
  id: number;
  name: string;
}

export default function CurrentSubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [domains, setDomains] = useState<Record<number, Domain>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { token } = useAppSelector((state: any) => state.auth);
  const colors = useColors();
  const windowWidth = Dimensions.get('window').width;
  const isMobile = windowWidth < 768;

  const styles = createStyles(colors, sidebarOpen, isMobile);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const authToken = token || API_CONFIG.FIXED_TOKEN;

      if (!authToken) {
        throw new Error('Please log in to view subscriptions');
      }

      // Fetch subscriptions
      const subscriptionsResponse = await fetch(
        buildURL(API_CONFIG.subscriptions.getUserActiveDomains),
        {
          method: 'GET',
          headers: getAuthHeaders(authToken),
        }
      );

      if (!subscriptionsResponse.ok) {
        throw new Error(`Failed to fetch subscriptions: ${subscriptionsResponse.statusText}`);
      }

      const subscriptionsData: Subscription[] = await subscriptionsResponse.json();
      setSubscriptions(subscriptionsData);

      // Fetch domains to get domain names
      const domainsResponse = await fetch(buildURL(API_CONFIG.courses.getDomainsCourses), {
        method: 'GET',
        headers: getAuthHeaders(authToken),
      });

      if (domainsResponse.ok) {
        const domainsData: Domain[] = await domainsResponse.json();
        const domainMap: Record<number, Domain> = {};
        domainsData.forEach((domain) => {
          domainMap[domain.id] = domain;
        });
        setDomains(domainMap);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCancelClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedSubscription) return;

    setCancelling(true);
    const authToken = token || API_CONFIG.FIXED_TOKEN;

    try {
      const cancelUrl = buildURL(API_CONFIG.subscriptions.cancelSubscription(selectedSubscription.id));
      const response = await fetch(cancelUrl, {
        method: 'POST',
        headers: getAuthHeaders(authToken),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to cancel subscription');
      }

      // Update subscription in state
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubscription.id
            ? { ...sub, cancel_at_period_end: true }
            : sub
        )
      );

      Alert.alert('Success', 'Subscription will be cancelled at the end of the current period');
      setIsCancelDialogOpen(false);
      setSelectedSubscription(null);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred while cancelling');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <View style={styles.mainContainer}>
          <View style={styles.sidebarContainer}>
            <Sidebar isOpen={sidebarOpen} onStateChange={setSidebarOpen} currentPage="current-subscription" />
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: colors.foreground }]}>
                Current Subscriptions
              </Text>
            </View>
            <View style={styles.loadingContainer}>
              <View style={styles.loadingDots}>
                <View style={[styles.loadingDot, { backgroundColor: colors.yellow || '#ffd404' }]} />
                <View style={[styles.loadingDot, { backgroundColor: colors.yellow || '#ffd404' }]} />
                <View style={[styles.loadingDot, { backgroundColor: colors.yellow || '#ffd404' }]} />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <View style={styles.mainContainer}>
          <View style={styles.sidebarContainer}>
            <Sidebar isOpen={sidebarOpen} onStateChange={setSidebarOpen} currentPage="current-subscription" />
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: colors.foreground }]}>
                Current Subscriptions
              </Text>
            </View>
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <View style={styles.mainContainer}>
        <View style={styles.sidebarContainer}>
          <Sidebar isOpen={sidebarOpen} onStateChange={setSidebarOpen} currentPage="current-subscription" />
        </View>

        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: colors.foreground }]}>
                Current Subscriptions
              </Text>
            </View>

            {subscriptions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  No active subscriptions found
                </Text>
              </View>
            ) : (
              <View style={styles.subscriptionsGrid}>
                {subscriptions.map((subscription) => {
                  const domain = domains[subscription.domain];
                  const domainName = domain?.name || `Domain #${subscription.domain}`;
                  const daysRemaining = getDaysRemaining(subscription.current_period_end);
                  const isCancelled = subscription.cancel_at_period_end;
                  const accentColor = isCancelled ? '#f97316' : colors.yellow || '#ffd404';

                  return (
                    <View
                      key={subscription.id}
                      style={[
                        styles.subscriptionCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      {/* Gradient Accent Bar */}
                      <View
                        style={[
                          styles.accentBar,
                          { backgroundColor: accentColor },
                        ]}
                      />

                      {/* Card Content */}
                      <View style={styles.cardContent}>
                        {/* Header with Domain and Status */}
                        <View style={styles.cardHeader}>
                          <View style={styles.domainInfo}>
                            <Text style={[styles.domainName, { color: colors.foreground }]}>
                              {domainName}
                            </Text>
                            <View style={styles.planInfo}>
                              <CreditCard size={16} color={colors.mutedForeground} />
                              <Text
                                style={[styles.planText, { color: colors.mutedForeground }]}
                              >
                                {subscription.plan_interval === 'month' ? 'Monthly' : 'Annual'} Plan
                              </Text>
                            </View>
                          </View>
                          <View style={styles.statusBadge}>
                            {subscription.status === 'active' && !isCancelled ? (
                              <View style={styles.activeBadge}>
                                <CheckCircle2 size={14} color="#16a34a" />
                                <Text style={styles.activeBadgeText}>Active</Text>
                              </View>
                            ) : isCancelled ? (
                              <View style={styles.cancellingBadge}>
                                <AlertCircle size={14} color="#ea580c" />
                                <Text style={styles.cancellingBadgeText}>Cancelling</Text>
                              </View>
                            ) : (
                              <View style={[styles.inactiveBadge, { backgroundColor: colors.muted }]}>
                                <Text style={[styles.inactiveBadgeText, { color: colors.foreground }]}>
                                  {subscription.status}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>

                        {/* Period Information */}
                        <View style={styles.periodInfo}>
                          <View style={[styles.periodItem, { backgroundColor: colors.muted }]}>
                            <View style={[styles.periodIcon, { backgroundColor: accentColor + '20' }]}>
                              <Calendar size={20} color={accentColor} />
                            </View>
                            <View style={styles.periodDetails}>
                              <Text style={[styles.periodLabel, { color: colors.mutedForeground }]}>
                                Current Period
                              </Text>
                              <Text
                                style={[styles.periodValue, { color: colors.foreground }]}
                                numberOfLines={1}
                              >
                                {formatDate(subscription.current_period_start)}
                              </Text>
                            </View>
                          </View>

                          <View style={[styles.periodItem, { backgroundColor: colors.muted }]}>
                            <View style={[styles.periodIcon, { backgroundColor: '#3b82f6' + '30' }]}>
                              <Clock size={20} color="#3b82f6" />
                            </View>
                            <View style={styles.periodDetails}>
                              <Text style={[styles.periodLabel, { color: colors.mutedForeground }]}>
                                Ends On
                              </Text>
                              <Text
                                style={[styles.periodValue, { color: colors.foreground }]}
                                numberOfLines={1}
                              >
                                {formatDate(subscription.current_period_end)}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Days Remaining Badge */}
                        <View style={styles.daysRemainingContainer}>
                          <View
                            style={[
                              styles.daysRemainingBadge,
                              {
                                backgroundColor: accentColor + '20',
                                borderColor: accentColor + '40',
                              },
                            ]}
                          >
                            <Clock size={16} color={accentColor} />
                            <Text
                              style={[styles.daysRemainingLabel, { color: colors.mutedForeground }]}
                            >
                              Days Remaining:
                            </Text>
                            <Text
                              style={[styles.daysRemainingValue, { color: accentColor }]}
                            >
                              {daysRemaining > 0 ? `${daysRemaining}` : '0'}
                            </Text>
                          </View>
                        </View>

                        {/* Cancellation Notice */}
                        {isCancelled && (
                          <View
                            style={[
                              styles.cancellationNotice,
                              {
                                backgroundColor: '#f97316' + '20',
                                borderColor: '#f97316' + '40',
                              },
                            ]}
                          >
                            <AlertCircle size={20} color="#ea580c" />
                            <View style={styles.cancellationText}>
                              <Text style={[styles.cancellationTitle, { color: '#ea580c' }]}>
                                Subscription Ending
                              </Text>
                              <Text
                                style={[styles.cancellationDescription, { color: '#ea580c' }]}
                              >
                                Will end on <Text style={{ fontWeight: '600' }}>{formatDate(subscription.current_period_end)}</Text>. 
                                This subscription will not auto-renew for the next {subscription.plan_interval}.
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>

                      {/* Action Button */}
                      <View style={styles.cardFooter}>
                        {!isCancelled && subscription.status === 'active' ? (
                          <TouchableOpacity
                            style={[
                              styles.cancelButton,
                              {
                                borderColor: '#dc2626' + '40',
                                backgroundColor: 'transparent',
                              },
                            ]}
                            onPress={() => handleCancelClick(subscription)}
                          >
                            <XCircle size={16} color="#dc2626" />
                            <Text style={[styles.cancelButtonText, { color: '#dc2626' }]}>
                              Cancel Subscription
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <View
                            style={[
                              styles.inactiveButton,
                              { backgroundColor: colors.muted },
                            ]}
                          >
                            <Text
                              style={[styles.inactiveButtonText, { color: colors.mutedForeground }]}
                            >
                              {isCancelled ? 'Cancellation scheduled' : 'Subscription inactive'}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Cancel Subscription Confirmation Modal */}
      <Modal visible={isCancelDialogOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                Cancel Subscription
              </Text>
              <Text style={[styles.modalDescription, { color: colors.mutedForeground }]}>
                Please confirm that you want to cancel this subscription
              </Text>
            </View>

            {selectedSubscription && (
              <View style={styles.modalBody}>
                <View
                  style={[
                    styles.modalSubscriptionInfo,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[styles.modalDomainName, { color: colors.foreground }]}
                  >
                    {domains[selectedSubscription.domain]?.name ||
                      `Domain #${selectedSubscription.domain}`}
                  </Text>
                  <Text
                    style={[styles.modalPlanText, { color: colors.mutedForeground }]}
                  >
                    {selectedSubscription.plan_interval === 'month' ? 'Monthly' : 'Annual'} Plan
                  </Text>

                  <View
                    style={[
                      styles.modalWarningBox,
                      {
                        backgroundColor: '#f97316' + '20',
                        borderColor: '#f97316' + '40',
                      },
                    ]}
                  >
                    <AlertCircle size={20} color="#ea580c" />
                    <View style={styles.modalWarningText}>
                      <Text
                        style={[styles.modalWarningTitle, { color: '#ea580c' }]}
                      >
                        Important Information:
                      </Text>
                      <Text
                        style={[styles.modalWarningItem, { color: '#ea580c' }]}
                      >
                        • Your subscription will remain active until{' '}
                        <Text style={{ fontWeight: 'bold' }}>
                          {formatDate(selectedSubscription.current_period_end)}
                        </Text>
                      </Text>
                      <Text
                        style={[styles.modalWarningItem, { color: '#ea580c' }]}
                      >
                        • You will continue to have access until the end of the current billing
                        period
                      </Text>
                      <Text
                        style={[styles.modalWarningItem, { color: '#ea580c' }]}
                      >
                        • This subscription will{' '}
                        <Text style={{ fontWeight: 'bold' }}>not auto-renew</Text> for the next{' '}
                        {selectedSubscription.plan_interval}
                      </Text>
                      <Text
                        style={[styles.modalWarningItem, { color: '#ea580c' }]}
                      >
                        • You can resubscribe at any time before the end date
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalCancelButton,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                onPress={() => {
                  setIsCancelDialogOpen(false);
                  setSelectedSubscription(null);
                }}
                disabled={cancelling}
              >
                <Text style={[styles.modalButtonText, { color: colors.foreground }]}>
                  Keep Subscription
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalConfirmButton,
                  { backgroundColor: '#dc2626' },
                ]}
                onPress={handleConfirmCancel}
                disabled={cancelling}
              >
                {cancelling ? (
                  <DotLoader size="small" color="#ffffff" />
                ) : (
                  <Text style={[styles.modalButtonText, { color: '#ffffff' }]}>
                    Confirm Cancellation
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: any, sidebarOpen: boolean, isMobile: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    mainContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    sidebarContainer: {
      width: isMobile ? (sidebarOpen ? 280 : 0) : 280,
      ...(isMobile && {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        elevation: 5,
      }),
    },
    contentContainer: {
      flex: 1,
      marginLeft: isMobile ? 0 : 280,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 20,
    },
    header: {
      marginBottom: 32,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    loadingContainer: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingDots: {
      flexDirection: 'row',
      gap: 4,
    },
    loadingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    errorContainer: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    emptyContainer: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: 16,
      textAlign: 'center',
    },
    subscriptionsGrid: {
      gap: 24,
    },
    subscriptionCard: {
      borderRadius: 12,
      borderWidth: 1,
      overflow: 'hidden',
      marginBottom: 0,
    },
    accentBar: {
      height: 4,
      width: '100%',
    },
    cardContent: {
      padding: 24,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    domainInfo: {
      flex: 1,
      marginRight: 12,
    },
    domainName: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    planInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    planText: {
      fontSize: 14,
      fontWeight: '500',
      textTransform: 'capitalize',
    },
    statusBadge: {
      flexShrink: 0,
    },
    activeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: '#10b981' + '20',
      borderWidth: 1,
      borderColor: '#10b981' + '40',
    },
    activeBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#16a34a',
    },
    cancellingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: '#f97316' + '20',
      borderWidth: 1,
      borderColor: '#f97316' + '40',
    },
    cancellingBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#ea580c',
    },
    inactiveBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    inactiveBadgeText: {
      fontSize: 12,
      fontWeight: '600',
    },
    periodInfo: {
      gap: 12,
      marginBottom: 20,
    },
    periodItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 8,
    },
    periodIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    periodDetails: {
      flex: 1,
    },
    periodLabel: {
      fontSize: 12,
      marginBottom: 4,
    },
    periodValue: {
      fontSize: 14,
      fontWeight: '500',
    },
    daysRemainingContainer: {
      marginBottom: 20,
    },
    daysRemainingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
    },
    daysRemainingLabel: {
      fontSize: 12,
      fontWeight: '500',
    },
    daysRemainingValue: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    cancellationNotice: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      marginBottom: 20,
    },
    cancellationText: {
      flex: 1,
    },
    cancellationTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 4,
    },
    cancellationDescription: {
      fontSize: 12,
      lineHeight: 18,
    },
    cardFooter: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      paddingTop: 0,
    },
    cancelButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 2,
    },
    cancelButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    inactiveButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    inactiveButtonText: {
      fontSize: 14,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 500,
      borderWidth: 1,
      maxHeight: '90%',
    },
    modalHeader: {
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    modalDescription: {
      fontSize: 14,
      lineHeight: 20,
    },
    modalBody: {
      marginBottom: 24,
    },
    modalSubscriptionInfo: {
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      marginBottom: 16,
    },
    modalDomainName: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
    },
    modalPlanText: {
      fontSize: 14,
      marginBottom: 16,
    },
    modalWarningBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
    },
    modalWarningText: {
      flex: 1,
    },
    modalWarningTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
    },
    modalWarningItem: {
      fontSize: 12,
      lineHeight: 18,
      marginBottom: 4,
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    modalCancelButton: {
      borderWidth: 1,
    },
    modalConfirmButton: {
      // backgroundColor set dynamically
    },
    modalButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
  });
