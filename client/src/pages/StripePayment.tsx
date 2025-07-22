import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Shield, Star, Crown, Zap } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import api from '../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  stripePriceId: string;
}

interface Subscription {
  id: string;
  planName: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

const StripePayment: React.FC = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansResponse, subscriptionResponse] = await Promise.all([
        api.get('/billing/plans'),
        api.get('/billing/subscription').catch(() => ({ data: null }))
      ]);
      
      setPlans(plansResponse.data);
      setSubscription(subscriptionResponse.data);
    } catch (error) {
      console.error('Failed to load billing data:', error);
      // Set default plans if API fails
      setPlans([
        {
          id: 'basic',
          name: 'Basic',
          price: 5,
          interval: 'month',
          stripePriceId: 'price_basic_monthly',
          features: [
            'Store up to 100 items',
            'Basic password generation',
            'Email support',
            'Mobile app access',
            '2FA authentication'
          ]
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 10,
          interval: 'month',
          stripePriceId: 'price_premium_monthly',
          popular: true,
          features: [
            'Unlimited items',
            'Advanced password generation',
            'Priority support',
            'File attachments (up to 1GB)',
            'Emergency access',
            'Security dashboard',
            'Dark web monitoring'
          ]
        },
        {
          id: 'family',
          name: 'Family',
          price: 15,
          interval: 'month',
          stripePriceId: 'price_family_monthly',
          features: [
            'Everything in Premium',
            'Up to 6 family accounts',
            'Shared vaults',
            'Family dashboard',
            'Advanced reporting',
            'Admin controls'
          ]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (plan: PricingPlan) => {
    setProcessingPlanId(plan.id);
    
    try {
      const response = await api.post('/billing/create-subscription', {
        priceId: plan.stripePriceId
      });

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      });

      if (error) {
        console.error('Stripe error:', error);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setProcessingPlanId('');
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await api.post('/billing/customer-portal');
      window.open(response.data.url, '_blank');
    } catch (error) {
      console.error('Failed to open customer portal:', error);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic':
        return <Shield className="h-6 w-6" />;
      case 'premium':
        return <Star className="h-6 w-6" />;
      case 'family':
        return <Crown className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic':
        return 'text-success bg-success-light';
      case 'premium':
        return 'text-accent bg-accent-light';
      case 'family':
        return 'text-warning bg-warning-light';
      default:
        return 'text-primary bg-primary-light';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-2">Choose the perfect plan for your needs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded mb-4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-3 bg-muted rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Choose the perfect plan for your security needs
        </p>
      </div>

      {/* Current Subscription */}
      {subscription && (
        <Card className="card-security border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-accent" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{subscription.planName} Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Status: <span className="capitalize">{subscription.status}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
                {subscription.cancelAtPeriodEnd && (
                  <p className="text-sm text-warning">
                    Subscription will cancel at the end of the current period
                  </p>
                )}
              </div>
              
              <Button variant="outline" onClick={handleManageSubscription}>
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`card-security relative ${
              plan.popular ? 'border-accent shadow-glow' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`inline-flex p-3 rounded-2xl ${getPlanColor(plan.name)} mx-auto mb-4`}>
                {getPlanIcon(plan.name)}
              </div>
              
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              
              <div className="text-3xl font-bold mt-2">
                ${plan.price}
                <span className="text-lg font-normal text-muted-foreground">
                  /{plan.interval}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full ${plan.popular ? 'btn-security' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => handleSubscribe(plan)}
                disabled={!!processingPlanId || (subscription?.planName.toLowerCase() === plan.name.toLowerCase())}
              >
                {processingPlanId === plan.id ? (
                  'Processing...'
                ) : subscription?.planName.toLowerCase() === plan.name.toLowerCase() ? (
                  'Current Plan'
                ) : (
                  `Subscribe to ${plan.name}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Features */}
      <Card className="card-security bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Why Choose LifeLockr?</h3>
            <p className="text-muted-foreground">
              Enterprise-grade security features included in all plans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary p-3 rounded-2xl w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Zero-Knowledge Architecture</h4>
              <p className="text-sm text-muted-foreground">
                We can't see your data even if we wanted to. Everything is encrypted locally.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent p-3 rounded-2xl w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Military-Grade Encryption</h4>
              <p className="text-sm text-muted-foreground">
                AES-256 encryption protects your data with the same standards used by governments.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-success p-3 rounded-2xl w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Check className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">SOC 2 Compliant</h4>
              <p className="text-sm text-muted-foreground">
                Independently audited security controls ensure your data is always protected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="card-security">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-1">Can I change plans anytime?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, or at the next billing cycle for downgrades.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-1">Is there a free trial?</h4>
            <p className="text-sm text-muted-foreground">
              All plans come with a 14-day free trial. No credit card required to start.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-1">What happens to my data if I cancel?</h4>
            <p className="text-sm text-muted-foreground">
              You'll have 30 days to export your data after cancellation. After that, your account and data will be permanently deleted.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StripePayment;