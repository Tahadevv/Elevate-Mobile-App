import { useRouter } from 'expo-router';
import { ArrowRight, ChevronLeft, ChevronRight, Code, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import API_CONFIG, { buildURL, getAuthHeaders } from '../../config.api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPaidIndustries, fetchUnpaidIndustries } from '../../store/slices/dashboardSlice';
import { useColors } from '../theme-provider';
import { DotLoader } from '../ui/dot-loader';

interface Course {
  id: number;
  name: string;
}

interface Industry {
  id: number;
  name: string;
  currently_studying: Course[];
  course_library: Course[];
}

interface UnpaidIndustriesComponentProps {
  industries: Industry[];
}

const PRICING = {
  monthly: 5.99,
  annually: 79.99,
};

const STRIPE_PRICE_IDS = {
  monthly: 'price_1SQ9Ac00CDQdww264AvpWJv0',
  yearly: 'price_1SQ9CM00CDQdww26Sh4FRNYr',
};

export default function UnpaidIndustriesComponent({ industries }: UnpaidIndustriesComponentProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
    industries && industries.length > 0 ? industries[0] : null
  );
  const [visibleLibraryCount, setVisibleLibraryCount] = useState(8);
  const [industryStartIndex, setIndustryStartIndex] = useState(0);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [purchaseStep, setPurchaseStep] = useState<1 | 2>(1);
  const [selectedSubscription, setSelectedSubscription] = useState<'monthly' | 'yearly' | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [showWebView, setShowWebView] = useState(false);

  const colors = useColors();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state: any) => state.auth);
  const windowWidth = Dimensions.get('window').width;
  const industriesToShow = windowWidth >= 1024 ? 12 : windowWidth >= 640 ? 6 : 4;

  React.useEffect(() => {
    if (industries && industries.length > 0 && !selectedIndustry) {
      setSelectedIndustry(industries[0]);
    }
  }, [industries]);

  const handleIndustryLeft = () => {
    if (industryStartIndex > 0) {
      setIndustryStartIndex(industryStartIndex - 1);
    }
  };

  const handleIndustryRight = () => {
    if (industryStartIndex < industries.length - industriesToShow) {
      setIndustryStartIndex(industryStartIndex + 1);
    } else if (industries.length > industriesToShow) {
      // Allow scrolling to see the last industry even if it means showing fewer items
      setIndustryStartIndex(Math.min(industryStartIndex + 1, industries.length - 1));
    }
  };

  const isIndustryLeftDisabled = industryStartIndex === 0;
  // Show right button if there are more industries to scroll to
  const isIndustryRightDisabled = industries.length <= industriesToShow || industryStartIndex >= industries.length - 1;

  const courseLibraryCourses = selectedIndustry?.course_library || [];
  const libraryToDisplay = courseLibraryCourses.slice(0, visibleLibraryCount);
  const hasMoreLibrary = visibleLibraryCount < courseLibraryCourses.length;

  const handleLoadMoreLibrary = () => {
    setVisibleLibraryCount((prevCount) => prevCount + 8);
  };

  const openPurchaseModal = (course: Course) => {
    setSelectedCourse(course);
    setPurchaseStep(1);
    setSelectedSubscription(null);
    setIsProcessingPayment(false);
    setCheckoutUrl(null);
    setShowWebView(false);
    setPurchaseModalOpen(true);
  };

  const handlePurchaseDomain = () => {
    setPurchaseStep(2);
  };

  const handleProceedWithPayment = async () => {
    if (!selectedSubscription || !selectedIndustry) {
      return;
    }

    setIsProcessingPayment(true);

    try {
      const authToken = token || API_CONFIG.FIXED_TOKEN;
      const domainId = selectedIndustry.id;
      const planInterval = selectedSubscription === 'monthly' ? 'monthly' : 'yearly';
      const priceId = selectedSubscription === 'monthly' ? STRIPE_PRICE_IDS.monthly : STRIPE_PRICE_IDS.yearly;

      // Create Stripe checkout session
      const response = await fetch(buildURL(API_CONFIG.payment.createStripeCheckout), {
        method: 'POST',
        headers: getAuthHeaders(authToken),
        body: JSON.stringify({
          domain_id: domainId,
          plan_interval: planInterval,
          price_id: priceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Failed to create checkout session');
      }

      // Open Stripe checkout in webview
      if (data.checkout_url || data.url) {
        setCheckoutUrl(data.checkout_url || data.url);
        setShowWebView(true);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setIsProcessingPayment(false);
    }
  };

  const handleWebViewNavigationStateChange = (navState: any) => {
    const url = navState.url;
    console.log('========================================');
    console.log('🌐 WEBVIEW NAVIGATION');
    console.log('========================================');
    console.log('URL:', url);
    console.log('========================================');

    // Check if payment was successful (Stripe redirects to success URL)
    // Check for various success URL patterns
    if (
      url.includes('success') || 
      url.includes('checkout/success') ||
      url.includes('payment-success') ||
      url.includes('checkout-success') ||
      url.includes('/dashboard') && (url.includes('success') || url.includes('paid'))
    ) {
      console.log('✅ Payment Success Detected - Redirecting to dashboard');
      console.log('========================================');
      
      // Close webview and modal
      setShowWebView(false);
      setPurchaseModalOpen(false);
      setPurchaseStep(1);
      setSelectedSubscription(null);
      setIsProcessingPayment(false);
      setCheckoutUrl(null);
      
      // Refresh industries data
      const authToken = token || API_CONFIG.FIXED_TOKEN;
      dispatch(fetchPaidIndustries(authToken) as any);
      dispatch(fetchUnpaidIndustries(authToken) as any);
      
      // Show success message and navigate to dashboard
      Alert.alert(
        'Success', 
        'Payment successful! The industry has been added to your paid industries.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to dashboard
              router.replace('/dashboard');
            },
          },
        ]
      );
    } else if (url.includes('cancel') || url.includes('checkout/cancel') || url.includes('payment-cancelled')) {
      // User cancelled
      console.log('❌ Payment Cancelled');
      console.log('========================================');
      setShowWebView(false);
      setIsProcessingPayment(false);
      Alert.alert('Cancelled', 'Payment was cancelled.');
    }
  };

  const handleCloseModal = () => {
    setPurchaseModalOpen(false);
    setPurchaseStep(1);
    setSelectedSubscription(null);
    setIsProcessingPayment(false);
    setCheckoutUrl(null);
    setShowWebView(false);
  };

  const styles = createStyles(colors);

  if (!industries || industries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          Wait for our new domains to be added.
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Industry Carousel */}
        <View style={styles.industrySection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Industries Marketplace</Text>
          <View style={styles.carouselContainer}>
            {industryStartIndex > 0 && (
              <TouchableOpacity
                style={[styles.carouselButton, { backgroundColor: colors.card }]}
                onPress={handleIndustryLeft}
                disabled={isIndustryLeftDisabled}
              >
                <ChevronLeft size={20} color={colors.foreground} />
              </TouchableOpacity>
            )}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.industryList}
            >
              {industries.slice(industryStartIndex, Math.min(industryStartIndex + industriesToShow, industries.length)).map((industry) => (
                <TouchableOpacity
                  key={industry.id}
                  style={[
                    styles.industryChip,
                    selectedIndustry?.id === industry.id && styles.selectedIndustryChip,
                    { borderColor: colors.border },
                  ]}
                  onPress={() => {
                    setSelectedIndustry(industry);
                    setVisibleLibraryCount(8);
                  }}
                >
                  <Text
                    style={[
                      styles.industryChipText,
                      { color: colors.foreground },
                      selectedIndustry?.id === industry.id && styles.selectedIndustryChipText,
                    ]}
                  >
                    {industry.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {!isIndustryRightDisabled && (
              <TouchableOpacity
                style={[styles.carouselButton, { backgroundColor: colors.card }]}
                onPress={handleIndustryRight}
              >
                <ChevronRight size={20} color={colors.foreground} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Course Library */}
        <Text style={[styles.title, { color: colors.foreground }]}>
          Checkout on any Course to buy that industry
        </Text>

        <View style={styles.coursesContainer}>
          {libraryToDisplay.length === 0 ? (
            <View style={styles.emptyCoursesContainer}>
              <Text style={[styles.emptyCoursesText, { color: colors.mutedForeground }]}>
                No courses available
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.coursesGrid}>
                {libraryToDisplay.map((course) => (
                  <TouchableOpacity
                    key={course.id}
                    style={[styles.courseCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => openPurchaseModal(course)}
                  >
                    <Code size={24} color={colors.foreground} />
                    <Text style={[styles.courseName, { color: colors.foreground }]} numberOfLines={2}>
                      {course.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {hasMoreLibrary && (
                <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMoreLibrary}>
                  <Text style={[styles.loadMoreText, { color: colors.yellow || '#ffd404' }]}>
                    load more
                  </Text>
                  <ArrowRight size={16} color={colors.yellow || '#ffd404'} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Purchase Modal */}
      <Modal
        visible={purchaseModalOpen}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {/* Step Tabs */}
            <View style={[styles.modalTabs, { borderBottomColor: colors.border }]}>
              <TouchableOpacity
                style={styles.modalTab}
                onPress={() => setPurchaseStep(1)}
              >
                <Text
                  style={[
                    styles.modalTabText,
                    { color: purchaseStep === 1 ? colors.foreground : colors.mutedForeground },
                    purchaseStep === 1 && styles.modalTabTextActive,
                  ]}
                >
                  Confirm Purchase
                </Text>
                {purchaseStep === 1 && <View style={[styles.modalTabUnderline, { backgroundColor: colors.yellow || '#ffd404' }]} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalTab}
                onPress={() => purchaseStep === 2 && setPurchaseStep(2)}
                disabled={purchaseStep === 1}
              >
                <Text
                  style={[
                    styles.modalTabText,
                    { color: purchaseStep === 2 ? colors.foreground : colors.mutedForeground },
                    purchaseStep === 2 && styles.modalTabTextActive,
                    purchaseStep === 1 && { opacity: 0.5 },
                  ]}
                >
                  Choose Plan
                </Text>
                {purchaseStep === 2 && <View style={[styles.modalTabUnderline, { backgroundColor: colors.yellow || '#ffd404' }]} />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <X size={20} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            {/* Modal Content Area */}
            <View style={styles.modalBody}>
            {showWebView && checkoutUrl ? (
              <View style={styles.webViewContainer}>
                <WebView
                  source={{ uri: checkoutUrl }}
                  onNavigationStateChange={handleWebViewNavigationStateChange}
                  style={styles.webView}
                />
              </View>
            ) : purchaseStep === 1 ? (
              <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                    Purchase {selectedIndustry?.name || 'this domain'}?
                  </Text>
                  <Text style={[styles.modalDescription, { color: colors.mutedForeground }]}>
                    Unlock this industry and get access to the following courses. They will be added to your dashboard immediately after purchase.
                  </Text>
                </View>

                <View style={styles.coursesList}>
                  {(selectedIndustry?.course_library || []).map((course) => (
                    <View
                      key={course.id}
                      style={[styles.modalCourseCard, { backgroundColor: colors.background, borderColor: colors.border }]}
                    >
                      <Code size={20} color={colors.foreground} />
                      <Text style={[styles.modalCourseName, { color: colors.foreground }]}>
                        {course.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <ScrollView 
                style={styles.modalScrollView} 
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                    Choose Your Subscription Plan
                  </Text>
                  <Text style={[styles.modalDescription, { color: colors.mutedForeground }]}>
                    Select a monthly or yearly plan to proceed with your purchase.
                  </Text>
                </View>

                {/* Show courses list in plan selection too */}
                {selectedIndustry?.course_library && selectedIndustry.course_library.length > 0 && (
                  <View style={styles.coursesListInPlan}>
                    <Text style={[styles.coursesListTitle, { color: colors.foreground }]}>
                      Courses included:
                    </Text>
                    {(selectedIndustry.course_library || []).slice(0, 3).map((course) => (
                      <View
                        key={course.id}
                        style={[styles.modalCourseCard, { backgroundColor: colors.background, borderColor: colors.border }]}
                      >
                        <Code size={16} color={colors.foreground} />
                        <Text style={[styles.modalCourseName, { color: colors.foreground }]}>
                          {course.name}
                        </Text>
                      </View>
                    ))}
                    {selectedIndustry.course_library.length > 3 && (
                      <Text style={[styles.moreCoursesText, { color: colors.mutedForeground }]}>
                        +{selectedIndustry.course_library.length - 3} more courses
                      </Text>
                    )}
                  </View>
                )}

                <View style={styles.plansContainer}>
                  {/* Monthly Plan */}
                  <TouchableOpacity
                    style={[
                      styles.planCard,
                      selectedSubscription === 'monthly' && styles.selectedPlanCard,
                      selectedSubscription === 'monthly' 
                        ? { borderColor: '#ffd404', backgroundColor: '#282434' }
                        : { 
                            borderColor: colors.border || '#9CA3AF', 
                            backgroundColor: colors.card || colors.background || '#FFFFFF',
                            borderWidth: 2,
                          },
                    ]}
                    onPress={() => {
                      console.log('Monthly plan selected');
                      setSelectedSubscription('monthly');
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.planContent}>
                      <View style={{ flex: 1 }}>
                        <Text style={[
                          styles.planTitle, 
                          { color: selectedSubscription === 'monthly' ? '#FFFFFF' : colors.foreground }
                        ]}>
                          Monthly
                        </Text>
                        <Text style={[
                          styles.planDescription, 
                          { color: selectedSubscription === 'monthly' ? '#D1D5DB' : colors.mutedForeground }
                        ]}>
                          Pay monthly and get full access
                        </Text>
                      </View>
                      <View style={styles.planPrice}>
                        <Text style={[styles.planPriceAmount, { color: '#ffd404' }]}>
                          ${PRICING.monthly}
                        </Text>
                        <Text style={[
                          styles.planPricePeriod, 
                          { color: selectedSubscription === 'monthly' ? '#9CA3AF' : colors.mutedForeground }
                        ]}>
                          per month
                        </Text>
                      </View>
                    </View>
                    {selectedSubscription === 'monthly' && (
                      <View style={[styles.checkmark, { backgroundColor: '#ffd404' }]}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Yearly Plan */}
                  <TouchableOpacity
                    style={[
                      styles.planCard,
                      selectedSubscription === 'yearly' && styles.selectedPlanCard,
                      selectedSubscription === 'yearly' 
                        ? { borderColor: '#ffd404', backgroundColor: '#282434' }
                        : { 
                            borderColor: colors.border || '#9CA3AF', 
                            backgroundColor: colors.card || colors.background || '#FFFFFF',
                            borderWidth: 2,
                          },
                    ]}
                    onPress={() => {
                      console.log('Yearly plan selected');
                      setSelectedSubscription('yearly');
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.planContent}>
                      <View style={{ flex: 1 }}>
                        <Text style={[
                          styles.planTitle, 
                          { color: selectedSubscription === 'yearly' ? '#FFFFFF' : colors.foreground }
                        ]}>
                          Yearly
                        </Text>
                        <Text style={[
                          styles.planDescription, 
                          { color: selectedSubscription === 'yearly' ? '#D1D5DB' : colors.mutedForeground }
                        ]}>
                          Save more with annual billing
                        </Text>
                      </View>
                      <View style={styles.planPrice}>
                        <Text style={[styles.planPriceAmount, { color: '#ffd404' }]}>
                          ${PRICING.annually}
                        </Text>
                        <Text style={[
                          styles.planPricePeriod, 
                          { color: selectedSubscription === 'yearly' ? '#9CA3AF' : colors.mutedForeground }
                        ]}>
                          per year
                        </Text>
                      </View>
                    </View>
                    {selectedSubscription === 'yearly' && (
                      <View style={[styles.checkmark, { backgroundColor: '#ffd404' }]}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
            </View>

            {/* Modal Footer */}
            {!showWebView && (
              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                {purchaseStep === 1 ? (
                  <>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                      onPress={handleCloseModal}
                    >
                      <Text style={[styles.modalButtonText, { color: colors.foreground }]}>
                        Maybe later
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.primaryButton, { backgroundColor: colors.yellow || '#ffd404' }]}
                      onPress={handlePurchaseDomain}
                    >
                      <Text style={[styles.modalButtonText, { color: '#000' }]}>
                        Purchase Domain
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                      onPress={() => setPurchaseStep(1)}
                    >
                      <Text style={[styles.modalButtonText, { color: colors.foreground }]}>
                        Back
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.modalButton,
                        styles.primaryButton,
                        { backgroundColor: colors.yellow || '#ffd404' },
                        (!selectedSubscription || isProcessingPayment) && { opacity: 0.5 },
                      ]}
                      onPress={handleProceedWithPayment}
                      disabled={!selectedSubscription || isProcessingPayment}
                    >
                      {isProcessingPayment ? (
                        <DotLoader size="small" color="#000" />
                      ) : (
                        <Text style={[styles.modalButtonText, { color: '#000' }]}>
                          Proceed to Payment
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  industrySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  carouselButton: {
    padding: 8,
    borderRadius: 8,
  },
  industryList: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  industryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 8,
  },
  selectedIndustryChip: {
    borderBottomWidth: 2,
    borderBottomColor: '#ffd404',
  },
  industryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedIndustryChipText: {
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  coursesContainer: {
    marginTop: 16,
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  courseCard: {
    width: '48%',
    padding: 16,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 80,
  },
  courseName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyCoursesContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyCoursesText: {
    fontSize: 14,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    maxWidth: 600,
    height: '85%',
    maxHeight: 700,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  modalBody: {
    flex: 1,
    minHeight: 300,
  },
  modalTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    position: 'relative',
  },
  modalTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
  },
  modalTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalTabTextActive: {
    fontWeight: 'bold',
  },
  modalTabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  modalContentContainer: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  coursesList: {
    padding: 20,
    gap: 12,
  },
  coursesListInPlan: {
    marginBottom: 20,
    gap: 8,
  },
  coursesListTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  moreCoursesText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  modalCourseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    gap: 12,
  },
  modalCourseName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  plansContainer: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 10,
    width: '100%',
  },
  planCard: {
    width: '100%',
    padding: 16,
    borderRadius: 6,
    borderWidth: 2,
    minHeight: 120,
    position: 'relative',
  },
  selectedPlanCard: {
    borderColor: '#ffd404',
    backgroundColor: '#282434',
  },
  planContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 100,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 16,
  },
  planPrice: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  planPriceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  planPricePeriod: {
    fontSize: 12,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  webViewContainer: {
    flex: 1,
    height: 500,
  },
  webView: {
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  primaryButton: {
    // Background color set inline
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

