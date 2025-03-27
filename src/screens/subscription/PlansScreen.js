// Path: src/screens/subscription/PlansScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

// Subscription plans
const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$9.99',
    period: '/month',
    description: 'Billed monthly. Cancel anytime.',
    features: [
      'Access to all premium courses',
      'Download videos for offline learning',
      'Hands-on coding exercises',
      'Course completion certificates',
      'Priority support',
    ],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '$99.99',
    period: '/year',
    description: 'Save 17% with yearly billing. Cancel anytime.',
    features: [
      'Everything in Monthly plan',
      'Exclusive advanced projects',
      'Early access to new courses',
      'Course completion certificates',
      'Priority support',
    ],
    popular: true,
  },
];

const PlansScreen = ({ navigation }) => {
  const { colors, getTypography, styles: themeStyles } = useContext(ThemeContext);
  const { isPremiumUser, updateUserSubscription } = useContext(AuthContext);
  
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [loading, setLoading] = useState(false);
  
  // Handle upgrade
  const handleUpgrade = async () => {
    if (isPremiumUser) {
      Alert.alert(
        'Already a Premium User',
        'You are already subscribed to our premium plan. Would you like to manage your subscription?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Manage Subscription', 
            onPress: () => {
              // In a real app, this would open a web page to manage subscription
              Linking.openURL('https://pyaiapp.com/manage-subscription');
            }
          },
        ]
      );
      return;
    }
    
    // In a real app, this would open a payment gateway
    Alert.alert(
      'External Payment',
      'You will be redirected to our website to complete the payment process.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: async () => {
            setLoading(true);
            
            try {
              // Simulate opening a payment page
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // For demonstration, we'll just update the user's subscription status
              await updateUserSubscription('premium');
              
              Alert.alert(
                'Subscription Successful',
                'You have successfully upgraded to a premium account!',
                [
                  { 
                    text: 'OK', 
                    onPress: () => navigation.goBack()
                  }
                ]
              );
            } catch (error) {
              console.error('Subscription error:', error);
              Alert.alert(
                'Subscription Failed',
                'An error occurred during the subscription process. Please try again later.'
              );
            } finally {
              setLoading(false);
            }
          }
        },
      ]
    );
  };
  
  // Render plan card
  const renderPlanCard = (plan) => {
    const isSelected = selectedPlan === plan.id;
    
    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.planCard,
          isSelected && styles.selectedPlanCard,
          { 
            backgroundColor: colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
          }
        ]}
        onPress={() => setSelectedPlan(plan.id)}
        activeOpacity={0.7}
      >
        {/* Popular tag */}
        {plan.popular && (
          <View 
            style={[
              styles.popularTag,
              { backgroundColor: colors.accent }
            ]}
          >
            <Text 
              style={[
                getTypography('caption'),
                { 
                  color: '#FFF',
                  fontWeight: 'bold',
                }
              ]}
            >
              MOST POPULAR
            </Text>
          </View>
        )}
        
        {/* Plan header */}
        <View style={styles.planHeader}>
          <View>
            <Text 
              style={[
                getTypography('h3'),
                { color: colors.text }
              ]}
            >
              {plan.name}
            </Text>
            
            <Text 
              style={[
                getTypography('body2'),
                { 
                  color: colors.grayText,
                  marginTop: 4,
                }
              ]}
            >
              {plan.description}
            </Text>
          </View>
          
          <View 
            style={[
              styles.radioButton,
              { 
                borderColor: isSelected ? colors.primary : colors.border,
                backgroundColor: isSelected ? colors.primary : 'transparent',
              }
            ]}
          >
            {isSelected && (
              <View 
                style={[
                  styles.radioInner,
                  { backgroundColor: '#FFF' }
                ]}
              />
            )}
          </View>
        </View>
        
        {/* Price */}
        <View style={styles.priceContainer}>
          <Text 
            style={[
              getTypography('h2'),
              { color: colors.text }
            ]}
          >
            {plan.price}
          </Text>
          <Text 
            style={[
              getTypography('body2'),
              { color: colors.grayText }
            ]}
          >
            {plan.period}
          </Text>
        </View>
        
        {/* Features */}
        <View style={styles.featuresList}>
          {plan.features.map((feature, index) => (
            <View 
              key={index}
              style={styles.featureItem}
            >
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color={colors.success} 
                style={styles.featureIcon}
              />
              <Text 
                style={[
                  getTypography('body1'),
                  { color: colors.text }
                ]}
              >
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView 
      style={[
        themeStyles.container,
        { backgroundColor: colors.background }
      ]}
      edges={['top']}
    >
      <StatusBar style={colors.isDark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View 
        style={[
          styles.header,
          { 
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.icon} />
        </TouchableOpacity>
        
        <Text 
          style={[
            getTypography('h3'),
            { 
              color: colors.text,
              flex: 1,
              textAlign: 'center',
            }
          ]}
        >
          Subscription Plans
        </Text>
        
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text 
          style={[
            getTypography('h2'),
            { 
              color: colors.text,
              textAlign: 'center',
              marginBottom: 8,
            }
          ]}
        >
          Upgrade to Premium
        </Text>
        
        <Text 
          style={[
            getTypography('body1'),
            { 
              color: colors.grayText,
              textAlign: 'center',
              marginBottom: 24,
            }
          ]}
        >
          Unlock all premium courses and features
        </Text>
        
        {/* Plans */}
        <View style={styles.plansContainer}>
          {plans.map(renderPlanCard)}
        </View>
        
        {/* Features comparison */}
        <View style={styles.featuresSection}>
          <Text 
            style={[
              getTypography('h3'),
              { 
                color: colors.text,
                marginBottom: 16,
              }
            ]}
          >
            What's included
          </Text>
          
          <View 
            style={[
              styles.featuresTable,
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }
            ]}
          >
            {/* Feature rows */}
            <View 
              style={[
                styles.featureRow,
                { borderBottomColor: colors.border }
              ]}
            >
              <Text 
                style={[
                  getTypography('subtitle1'),
                  { 
                    color: colors.text,
                    flex: 1,
                  }
                ]}
              >
                All Premium Courses
              </Text>
              <View style={styles.planColumns}>
                <View style={styles.planColumn}>
                  <Ionicons 
                    name="close" 
                    size={20} 
                    color={colors.error} 
                  />
                </View>
                <View style={styles.planColumn}>
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={colors.success} 
                  />
                </View>
              </View>
            </View>
            
            <View 
              style={[
                styles.featureRow,
                { borderBottomColor: colors.border }
              ]}
            >
              <Text 
                style={[
                  getTypography('subtitle1'),
                  { 
                    color: colors.text,
                    flex: 1,
                  }
                ]}
              >
                Offline Learning
              </Text>
              <View style={styles.planColumns}>
                <View style={styles.planColumn}>
                  <Ionicons 
                    name="close" 
                    size={20} 
                    color={colors.error} 
                  />
                </View>
                <View style={styles.planColumn}>
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={colors.success} 
                  />
                </View>
              </View>
            </View>
            
            <View 
              style={[
                styles.featureRow,
                { borderBottomColor: colors.border }
              ]}
            >
              <Text 
                style={[
                  getTypography('subtitle1'),
                  { 
                    color: colors.text,
                    flex: 1,
                  }
                ]}
              >
                Course Certificates
              </Text>
              <View style={styles.planColumns}>
                <View style={styles.planColumn}>
                  <Ionicons 
                    name="close" 
                    size={20} 
                    color={colors.error} 
                  />
                </View>
                <View style={styles.planColumn}>
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={colors.success} 
                  />
                </View>
              </View>
            </View>
            
            <View 
              style={[
                styles.featureRow,
                { borderBottomColor: colors.border }
              ]}
            >
              <Text 
                style={[
                  getTypography('subtitle1'),
                  { 
                    color: colors.text,
                    flex: 1,
                  }
                ]}
              >
                Advanced Projects
              </Text>
              <View style={styles.planColumns}>
                <View style={styles.planColumn}>
                  <Ionicons 
                    name="close" 
                    size={20} 
                    color={colors.error} 
                  />
                </View>
                <View style={styles.planColumn}>
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={colors.success} 
                  />
                </View>
              </View>
            </View>
            
            <View style={styles.featureRow}>
              <Text 
                style={[
                  getTypography('subtitle1'),
                  { 
                    color: colors.text,
                    flex: 1,
                  }
                ]}
              >
                Priority Support
              </Text>
              <View style={styles.planColumns}>
                <View style={styles.planColumn}>
                  <Ionicons 
                    name="close" 
                    size={20} 
                    color={colors.error} 
                  />
                </View>
                <View style={styles.planColumn}>
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={colors.success} 
                  />
                </View>
              </View>
            </View>
            
            {/* Plan headers */}
            <View style={styles.planHeaders}>
              <View style={styles.planHeaderItem}>
                <Text 
                  style={[
                    getTypography('caption'),
                    { color: colors.grayText }
                  ]}
                >
                  FREE
                </Text>
              </View>
              <View style={styles.planHeaderItem}>
                <Text 
                  style={[
                    getTypography('caption'),
                    { color: colors.primary }
                  ]}
                >
                  PREMIUM
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* FAQ */}
        <View style={styles.faqSection}>
          <Text 
            style={[
              getTypography('h3'),
              { 
                color: colors.text,
                marginBottom: 16,
              }
            ]}
          >
            Frequently Asked Questions
          </Text>
          
          <View 
            style={[
              styles.faqCard,
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }
            ]}
          >
            <View style={styles.faqItem}>
              <Text 
                style={[
                  getTypography('subtitle1'),
                  { 
                    color: colors.text,
                    marginBottom: 8,
                  }
                ]}
              >
                Can I cancel my subscription?
              </Text>
              <Text 
                style={[
                  getTypography('body1'),
                  { color: colors.text }
                ]}
              >
                Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to premium content until the end of your billing period.
              </Text>
            </View>
            
            <View 
              style={[
                styles.divider,
                { backgroundColor: colors.border }
              ]}
            />
            
            <View style={styles.faqItem}>
              <Text 
                style={[
                  getTypography('subtitle1'),
                  { 
                    color: colors.text,
                    marginBottom: 8,
                  }
                ]}
              >
                What payment methods do you accept?
              </Text>
              <Text 
                style={[
                  getTypography('body1'),
                  { color: colors.text }
                ]}
              >
                We accept credit cards, PayPal, and Apple Pay. All payments are processed securely through our payment provider.
              </Text>
            </View>
            
            <View 
              style={[
                styles.divider,
                { backgroundColor: colors.border }
              ]}
            />
            
            <View style={styles.faqItem}>
              <Text 
                style={[
                  getTypography('subtitle1'),
                  { 
                    color: colors.text,
                    marginBottom: 8,
                  }
                ]}
              >
                Is there a free trial?
              </Text>
              <Text 
                style={[
                  getTypography('body1'),
                  { color: colors.text }
                ]}
              >
                Yes, we offer a 7-day free trial for new premium subscribers. You can try all premium features during this period.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Upgrade Button */}
      <View 
        style={[
          styles.footer,
          { 
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          }
        ]}
      >
        <Button
          title={isPremiumUser ? "Manage Subscription" : "Upgrade Now"}
          onPress={handleUpgrade}
          gradient
          size="large"
          fullWidth
        />
      </View>
      
      {loading && <Loading fullScreen />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  plansContainer: {
    marginBottom: 32,
  },
  planCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedPlanCard: {
    borderWidth: 2,
  },
  popularTag: {
    position: 'absolute',
    top: 12,
    right: -30,
    transform: [{ rotate: '45deg' }],
    paddingHorizontal: 30,
    paddingVertical: 6,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 16,
    marginBottom: 16,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresTable: {
    borderRadius: 12,
    borderWidth: 1,
    position: 'relative',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  planColumns: {
    flexDirection: 'row',
    width: 100,
  },
  planColumn: {
    flex: 1,
    alignItems: 'center',
  },
  planHeaders: {
    position: 'absolute',
    top: -30,
    right: 0,
    flexDirection: 'row',
    width: 100,
  },
  planHeaderItem: {
    flex: 1,
    alignItems: 'center',
  },
  faqSection: {
    marginBottom: 24,
  },
  faqCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  faqItem: {
    padding: 16,
  },
  divider: {
    height: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

export default PlansScreen;